import React, { useState, useEffect } from 'react';
import { Book, SortOption, formatCallNumber } from '../types/book';
import { ArrowUpDown, Copy, Check, ChevronDown } from 'lucide-react';
import { HighlightText } from '../utils/searchUtils';

interface BookTableViewProps {
  books: Book[];
  sortOption: SortOption;
  onSortChange: (s: SortOption) => void;
  searchQuery?: string;
}

const PAGE_SIZE = 50;

export const BookTableView: React.FC<BookTableViewProps> = ({
  books,
  sortOption,
  onSortChange,
  searchQuery = '',
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [books.length, searchQuery]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const visibleBooks = books.slice(0, visibleCount);
  const hasMore = visibleCount < books.length;

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs space-y-2">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50/90 text-slate-700 font-bold border-b border-slate-200">
              
              {/* N° Ingreso */}
              <th className="py-3 px-3.5 whitespace-nowrap">N° Ingreso</th>

              {/* Año */}
              <th
                onClick={() => onSortChange(sortOption === 'year-desc' ? 'year-asc' : 'year-desc')}
                className="py-3 px-3.5 cursor-pointer hover:bg-slate-100 transition-colors w-20 text-center"
                title="Ordenar por año"
              >
                <div className="inline-flex items-center gap-1">
                  <span>Año</span>
                  <ArrowUpDown className="w-3 h-3 text-sky-600" />
                </div>
              </th>

              {/* Clasificación con slashes */}
              <th className="py-3 px-3.5 whitespace-nowrap">Clasificación / Signatura</th>

              {/* Título */}
              <th
                onClick={() => onSortChange(sortOption === 'title-asc' ? 'title-desc' : 'title-asc')}
                className="py-3 px-4 cursor-pointer hover:bg-slate-100 transition-colors"
                title="Ordenar por título"
              >
                <div className="inline-flex items-center gap-1">
                  <span>Título</span>
                  <ArrowUpDown className="w-3 h-3 text-sky-600" />
                </div>
              </th>

              {/* Autor */}
              <th
                onClick={() => onSortChange(sortOption === 'author-asc' ? 'year-desc' : 'author-asc')}
                className="py-3 px-4 cursor-pointer hover:bg-slate-100 transition-colors hidden md:table-cell"
                title="Ordenar por autor"
              >
                <div className="inline-flex items-center gap-1">
                  <span>Autor(es)</span>
                  <ArrowUpDown className="w-3 h-3 text-sky-600" />
                </div>
              </th>

              {/* Edición */}
              <th className="py-3 px-3.5 hidden sm:table-cell">Edición</th>

              {/* ISBN */}
              <th className="py-3 px-3.5 hidden md:table-cell">ISBN</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {visibleBooks.map((book) => {
              const isCopied = copiedId === book.id;
              const displayCallNumber = formatCallNumber(book.callNumber);

              return (
                <tr
                  key={book.id}
                  className="hover:bg-sky-50/50 transition-colors"
                >
                  {/* 1. N° Ingreso */}
                  <td className="py-3 px-3.5 whitespace-nowrap font-mono font-bold text-sky-900 bg-sky-50/30">
                    <HighlightText text={book.entryNumber || 'S/N'} query={searchQuery} />
                  </td>

                  {/* 2. Año */}
                  <td className="py-3 px-3.5 font-mono font-semibold text-slate-800 text-center">
                    <HighlightText text={String(book.year)} query={searchQuery} />
                  </td>

                  {/* 3. Clasificación con slashes */}
                  <td className="py-3 px-3.5 whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5 font-mono text-[11px] bg-slate-100 px-2 py-0.5 rounded text-slate-800">
                      <span>
                        <HighlightText text={displayCallNumber} query={searchQuery} />
                      </span>
                      {displayCallNumber !== 'Preguntar en biblioteca' && (
                        <button
                          onClick={() => handleCopy(displayCallNumber, book.id)}
                          className="text-slate-400 hover:text-sky-600 p-0.5 cursor-pointer"
                          title="Copiar signatura"
                        >
                          {isCopied ? (
                            <Check className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      )}
                    </div>
                  </td>

                  {/* 4. Título */}
                  <td className="py-3 px-4 text-slate-900 font-semibold max-w-sm">
                    <div className="line-clamp-2">
                      <HighlightText text={book.title} query={searchQuery} />
                    </div>
                    <div className="text-[11px] text-slate-500 md:hidden mt-0.5">
                      <HighlightText text={book.author} query={searchQuery} />
                    </div>
                  </td>

                  {/* 5. Autor */}
                  <td className="py-3 px-4 text-slate-600 hidden md:table-cell max-w-[200px] truncate" title={book.author}>
                    <HighlightText text={book.author} query={searchQuery} />
                  </td>

                  {/* 6. Edición */}
                  <td className="py-3 px-3.5 text-slate-600 hidden sm:table-cell whitespace-nowrap" title={book.edition || ''}>
                    {book.edition ? (
                      <span className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded">
                        <HighlightText text={book.edition} query={searchQuery} />
                      </span>
                    ) : (
                      ''
                    )}
                  </td>

                  {/* 7. ISBN */}
                  <td className="py-3 px-3.5 text-slate-600 hidden md:table-cell whitespace-nowrap font-mono text-xs" title={book.isbn || ''}>
                    {book.isbn ? (
                      <span className="bg-amber-50 text-slate-800 border border-amber-200 px-1.5 py-0.5 rounded">
                        <HighlightText text={book.isbn} query={searchQuery} />
                      </span>
                    ) : (
                      ''
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {hasMore && (
        <div className="p-4 text-center border-t border-slate-100 flex flex-col items-center justify-center gap-1.5">
          <button
            onClick={() => setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, books.length))}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-sky-800 bg-sky-50 hover:bg-sky-100 rounded-lg transition-colors cursor-pointer"
          >
            <ChevronDown className="w-3.5 h-3.5 text-sky-600" />
            <span>Cargar más filas ({books.length - visibleCount} restantes)</span>
          </button>
          <span className="text-[11px] text-slate-400">
            Mostrando {visibleCount} de {books.length} registros
          </span>
        </div>
      )}
    </div>
  );
};
