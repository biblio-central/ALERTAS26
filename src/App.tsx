/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import booksData from './data/booksData.json';
import { Book, BookGroup, SortOption, ViewMode, formatCallNumber } from './types/book';
import { matchSearch } from './utils/searchUtils';
import { Header } from './components/Header';
import { SearchAndFilters } from './components/SearchAndFilters';
import { BookGrid } from './components/BookGrid';
import { BookTableView } from './components/BookTableView';
import { BulletinView } from './components/BulletinView';

function compareBooks(a: Book, b: Book, sortOption: SortOption): number {
  if (sortOption === 'year-desc') {
    if (b.year !== a.year) return b.year - a.year;
    return Number(b.entryNumber || 0) - Number(a.entryNumber || 0);
  }
  if (sortOption === 'year-asc') {
    if (a.year !== b.year) return a.year - b.year;
    return Number(a.entryNumber || 0) - Number(b.entryNumber || 0);
  }
  if (sortOption === 'title-asc') return a.title.localeCompare(b.title);
  if (sortOption === 'title-desc') return b.title.localeCompare(a.title);
  if (sortOption === 'author-asc') return a.author.localeCompare(b.author);
  return 0;
}

function normalizeGroupValue(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export default function App() {
  // The catalog is loaded exclusively from the official JSON file.
  const [books] = useState<Book[]>(booksData as Book[]);

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState<number | 'all'>('all');
  
  // Default sort: Year descending (Desde el año más reciente)
  const [sortOption, setSortOption] = useState<SortOption>('year-desc');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // Unique available years sorted descending
  const availableYears = useMemo(() => {
    const set = new Set<number>();
    books.forEach((b) => {
      if (b.year && !isNaN(b.year)) set.add(b.year);
    });
    return Array.from(set).sort((a, b) => b - a);
  }, [books]);

  // Filter and sort books with accent, case, and slash-tolerant search
  const filteredAndSortedBooks = useMemo(() => {
    let result = [...books];

    // Filter by year if specific year selected
    if (selectedYear !== 'all') {
      result = result.filter((b) => b.year === selectedYear);
    }

    // Filter by search query (case, accent, tildes and slash-insensitive)
    if (searchQuery.trim()) {
      result = result.filter((b) =>
        matchSearch(
          [
            b.entryNumber,
            b.title,
            b.author,
            String(b.year),
            formatCallNumber(b.callNumber),
            b.publisher,
            b.isbn,
          ],
          searchQuery
        )
      );
    }

    // Apply sorting
    result.sort((a, b) => compareBooks(a, b, sortOption));

    return result;
  }, [books, selectedYear, searchQuery, sortOption]);

  const groupedBooks = useMemo(() => {
    const groupsByKey = new Map<string, Book[]>();

    books.forEach((book) => {
      const isbn = book.isbn?.trim().replace(/[\s-]/g, '').toUpperCase();
      const baseKey = [
        normalizeGroupValue(book.title),
        normalizeGroupValue(book.author),
        book.year,
      ].join('\u0000');
      const key = isbn
        ? `isbn\u0000${isbn}`
        : `no-isbn\u0000${baseKey}`;
      const records = groupsByKey.get(key);
      if (records) records.push(book);
      else groupsByKey.set(key, [book]);
    });

    const matchesSearch = (book: Book) =>
      matchSearch(
        [
          book.entryNumber,
          book.title,
          book.author,
          String(book.year),
          formatCallNumber(book.callNumber),
          book.publisher,
          book.isbn,
        ],
        searchQuery
      );

    return Array.from(groupsByKey.entries())
      .map(([, records]) => ({
        id: records[0].id,
        records: [...records].sort((a, b) => compareBooks(a, b, sortOption)),
      }))
      .filter(({ records }) => selectedYear === 'all' || records[0].year === selectedYear)
      .filter(({ records }) => !searchQuery.trim() || records.some(matchesSearch))
      .map(({ id, records }): BookGroup => ({ id, book: records[0], records }))
      .sort((a, b) => compareBooks(a.book, b.book, sortOption));
  }, [books, selectedYear, searchQuery, sortOption]);

  // Reset filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedYear('all');
    setSortOption('year-desc');
  };

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedYear !== 'all' ||
    sortOption !== 'year-desc';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      
      {/* Institutional Header with Celeste background, UNTELS logo, and total books counter (no yellow buttons) */}
      <Header books={books} />

      {/* Search and Filters Bar with Centered Gold Search and Dropdown Year */}
      <SearchAndFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
        availableYears={availableYears}
        sortOption={sortOption}
        onSortChange={setSortOption}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        filteredCount={filteredAndSortedBooks.length}
        onResetFilters={handleResetFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Main Content Area - All bibliographic data visible in a single page */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* View Mode: Cuadrícula (de a dos) */}
        {viewMode === 'grid' && (
          <BookGrid
            books={groupedBooks}
            onResetFilters={handleResetFilters}
            hasFilters={hasActiveFilters}
            searchQuery={searchQuery}
          />
        )}

        {/* View Mode: Tabla */}
        {viewMode === 'table' && (
          <BookTableView
            books={filteredAndSortedBooks}
            sortOption={sortOption}
            onSortChange={setSortOption}
            searchQuery={searchQuery}
          />
        )}

        {/* View Mode: Boletín Oficial */}
        {viewMode === 'bulletin' && (
          <BulletinView
            books={filteredAndSortedBooks}
            searchQuery={searchQuery}
          />
        )}
      </main>

    </div>
  );
}
