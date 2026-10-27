import React, { useState, useEffect } from 'react';
import { BookCard } from './BookCard';
import { BookGroup } from '../types/book';
import { BookX, ChevronDown } from 'lucide-react';

interface BookGridProps {
  books: BookGroup[];
  onResetFilters: () => void;
  hasFilters: boolean;
  searchQuery?: string;
}

const PAGE_SIZE = 40;

export const BookGrid: React.FC<BookGridProps> = ({
  books,
  onResetFilters,
  hasFilters,
  searchQuery = '',
}) => {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Reset pagination when search query or filter changes
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [books.length, searchQuery]);

  if (books.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center max-w-xl mx-auto my-8 shadow-xs">
        <div className="w-12 h-12 bg-sky-50 text-sky-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <BookX className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-1">
          No se encontraron libros con estos criterios
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 mb-6">
          Intenta buscar con otros términos, ajustar el año seleccionado o restablecer los filtros de búsqueda.
        </p>
        {hasFilters && (
          <button
            onClick={onResetFilters}
            className="px-4 py-2 text-xs font-semibold text-sky-800 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-lg transition-colors cursor-pointer"
          >
            Restablecer filtros
          </button>
        )}
      </div>
    );
  }

  const visibleBooks = books.slice(0, visibleCount);
  const hasMore = visibleCount < books.length;

  return (
    <div className="space-y-6">
      {/* 2-column grid layout as required ("QUE SE VEA DE A DOS NO DE A TRES") */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {visibleBooks.map((group, index) => (
          <BookCard
            key={group.id}
            book={group.book}
            records={group.records}
            index={index}
            searchQuery={searchQuery}
          />
        ))}
      </div>

      {/* Load more controls for fast rendering across 7402 records */}
      {hasMore && (
        <div className="pt-6 pb-8 text-center flex flex-col items-center justify-center gap-2">
          <button
            onClick={() => setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, books.length))}
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-sky-900 bg-white border-2 border-sky-600 hover:bg-sky-50 rounded-xl shadow-xs transition-all cursor-pointer hover:shadow-md hover:-translate-y-0.5"
          >
            <ChevronDown className="w-4 h-4 text-sky-600" />
            <span>Cargar más libros ({books.length - visibleCount} restantes)</span>
          </button>
          <p className="text-xs text-slate-500 font-medium">
            Mostrando {visibleCount} de {books.length} libros
          </p>
        </div>
      )}
    </div>
  );
};
