import React, { useState } from 'react';
import { Copy, Check, BookOpen } from 'lucide-react';
import { Book, formatCallNumber } from '../types/book';
import { HighlightText } from '../utils/searchUtils';

interface BookCardProps {
  book: Book;
  records?: Book[];
  index?: number;
  searchQuery?: string;
}

export const BookCard: React.FC<BookCardProps> = ({ book, records = [book], index, searchQuery = '' }) => {
  const [copied, setCopied] = useState(false);

  const displayCallNumber = formatCallNumber(book.callNumber);

  const copyCallNumber = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(displayCallNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const itemNumber = index !== undefined ? `${index + 1}) ` : '';

  return (
    <div className={`flex flex-col ${records.length === 1 ? 'hover:-translate-y-2' : ''} transition-transform duration-300`}>
    <article className="group bg-white rounded-xl border border-slate-200 border-t-4 border-t-sky-600 p-5 sm:p-6 shadow-xs hover:shadow-xl hover:border-sky-400 transition-all duration-300 ease-out flex flex-col justify-between cursor-default">
      <div className="space-y-3.5">
        
        {/* 1. PRIMERO: NÚMERO DE INGRESO */}
        <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-sky-700">
          <div className="flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-sky-600 shrink-0" />
            <span>
              {itemNumber}N° de Ingreso:{' '}
              <span className="font-mono font-bold text-slate-900 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded text-xs">
                <HighlightText text={book.entryNumber || 'S/N'} query={searchQuery} />
              </span>
            </span>
          </div>
        </div>

        {/* 2. LUEGO: TÍTULO */}
        <h3 className="font-serif-book font-bold text-sky-950 text-lg sm:text-xl leading-snug group-hover:text-sky-700 transition-colors">
          <HighlightText text={book.title} query={searchQuery} />
        </h3>

        {/* 3. LUEGO: AUTOR */}
        <div className="text-xs sm:text-sm text-slate-800">
          <strong className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mr-1.5">
            AUTOR(ES):
          </strong>
          <span className="font-medium text-slate-900">
            <HighlightText text={book.author} query={searchQuery} />
          </span>
        </div>

        {/* 4. LUEGO: AÑO (y Edición, ISBN, Editorial si existen) */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs sm:text-sm text-slate-800">
          <div className="flex items-center gap-1">
            <strong className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              AÑO:
            </strong>
            <span className="font-mono font-bold text-slate-900 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-xs tabular-nums">
              <HighlightText text={String(book.year)} query={searchQuery} />
            </span>
          </div>

          {/* EDICIÓN (Solo si existe en el Excel) */}
          {book.edition && book.edition.trim() !== '' && (
            <div className="flex items-center gap-1">
              <strong className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                EDICIÓN:
              </strong>
              <span className="font-medium text-slate-700 bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded text-xs">
                <HighlightText text={book.edition} query={searchQuery} />
              </span>
            </div>
          )}

          {/* ISBN (Solo si existe en el Excel) */}
          {book.isbn && book.isbn.trim() !== '' && (
            <div className="flex items-center gap-1">
              <strong className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                ISBN:
              </strong>
              <span className="font-mono text-xs text-slate-800 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                <HighlightText text={book.isbn} query={searchQuery} />
              </span>
            </div>
          )}

          {/* EDITORIAL (SOLO si existe en el excel, si no hay no se pone nada) */}
          {book.publisher && book.publisher.trim() !== '' && book.publisher.trim().toLowerCase() !== 'no especificado' && (
            <div className="flex items-center gap-1">
              <strong className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                EDIT:
              </strong>
              <span className="font-medium text-slate-800">
                <HighlightText text={book.publisher} query={searchQuery} />
              </span>
            </div>
          )}
        </div>

        {records.length === 1 && (
          <div className="bg-sky-50/80 border border-sky-200/90 rounded-lg p-3 flex items-center justify-between mt-2">
            <div className="min-w-0 pr-2">
              <strong className="text-[10px] font-bold uppercase tracking-wider text-sky-800 block mb-0.5">
                CLASIFICACIÓN / SIGNATURA
              </strong>
              <code className="text-sm font-mono font-bold text-sky-950 truncate block tracking-tight">
                <HighlightText text={displayCallNumber} query={searchQuery} />
              </code>
            </div>
            {displayCallNumber !== 'Preguntar en biblioteca' && (
              <button
                onClick={copyCallNumber}
                className="p-1.5 rounded-md text-sky-700 bg-white border border-sky-300 hover:bg-sky-100 transition-colors cursor-pointer shrink-0 shadow-2xs"
                title="Copiar clasificación con slashes"
              >
                {copied ? (
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                    <Check className="w-3.5 h-3.5" /> Copiado
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-sky-800">
                    <Copy className="w-3.5 h-3.5" /> Copiar
                  </span>
                )}
              </button>
            )}
          </div>
        )}

      </div>
    </article>
    {records.length > 1 && (
      <section className="bg-white border border-slate-200 border-t-0 rounded-b-lg px-4 pb-3 -mt-1">
        <h4 className="py-2 text-sm font-bold text-sky-800">
          Existencias físicas ({records.length} ejemplares)
        </h4>
        <table className="w-full border-collapse text-xs text-slate-700">
          <thead>
            <tr className="bg-slate-100 text-left">
              <th className="px-3 py-2 font-semibold">N° de ingreso</th>
              <th className="px-3 py-2 font-semibold">Clasificación</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.id} className="border-t border-slate-200">
                <td className="px-3 py-2 font-mono">{record.entryNumber || 'S/N'}</td>
                <td className="px-3 py-2 font-mono">{formatCallNumber(record.callNumber)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    )}
    </div>
  );
};
