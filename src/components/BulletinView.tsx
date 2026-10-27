import React from 'react';
import { Book, formatCallNumber } from '../types/book';
import { Printer } from 'lucide-react';
import { HighlightText } from '../utils/searchUtils';

interface BulletinViewProps {
  books: Book[];
  searchQuery?: string;
}

export const BulletinView: React.FC<BulletinViewProps> = ({ books, searchQuery = '' }) => {
  // Group by year descending
  const years = Array.from(new Set(books.map((b) => b.year))).sort((a, b) => b - a);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-xs max-w-5xl mx-auto print:border-none print:shadow-none print:p-0">
      
      {/* Bulletin Official Header */}
      <div className="border-b-2 border-sky-800 pb-5 mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold text-sky-800 uppercase tracking-widest block font-sans">
              UNIVERSIDAD NACIONAL TECNOLÓGICA DE LIMA SUR · UNTELS
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-0.5 font-sans">
              BOLETÍN DE ALERTA BIBLIOGRÁFICA
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Dirección de Biblioteca Central y Recursos de Información · Adquisiciones ordenadas cronológicamente
            </p>
          </div>
          <div className="text-right shrink-0 no-print">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-sky-700 hover:bg-sky-800 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              Imprimir este Boletín
            </button>
            <span className="text-[10px] text-slate-400 block mt-1">
              Fecha de emisión: {new Date().toLocaleDateString('es-PE', { year: 'numeric', month: 'long' })}
            </span>
          </div>
        </div>
      </div>

      {/* Year-by-Year Chronological Sections */}
      <div className="space-y-10">
        {years.map((year) => {
          const yearBooks = books.filter((b) => b.year === year);
          return (
            <section key={year} className="space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-200 pb-2">
                <span className="bg-sky-700 text-white font-mono font-bold text-xs px-2.5 py-1 rounded-sm">
                  AÑO {year}
                </span>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
                  Adquisiciones del año ({yearBooks.length} obras registradas)
                </h3>
              </div>

              <div className="divide-y divide-slate-100">
                {yearBooks.map((b, idx) => {
                  const displayCallNumber = formatCallNumber(b.callNumber);
                  return (
                    <div key={b.id} className="py-4 px-2 space-y-1.5">
                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                        <div className="flex items-baseline gap-2">
                          <span className="font-mono text-xs text-slate-400 font-bold shrink-0">
                            {String(idx + 1).padStart(2, '0')}.
                          </span>
                          <h4 className="font-serif-book font-bold text-base text-slate-900">
                            <HighlightText text={b.title} query={searchQuery} />
                          </h4>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {b.entryNumber && (
                            <span className="text-xs font-mono font-bold text-sky-900 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                              N° {b.entryNumber}
                            </span>
                          )}
                          <code className="text-xs font-mono font-bold text-sky-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                            <HighlightText text={displayCallNumber} query={searchQuery} />
                          </code>
                        </div>
                      </div>

                      <div className="text-xs text-slate-600 pl-6 space-y-1">
                        <p>
                          <strong className="text-slate-800">Autor(es):</strong>{' '}
                          <HighlightText text={b.author} query={searchQuery} />
                          {b.edition && <span> · {b.edition}</span>}
                        </p>
                        <p>
                          {b.publisher && b.publisher.trim() !== '' && b.publisher.trim().toLowerCase() !== 'no especificado' && (
                            <>
                              <strong className="text-slate-800">Editorial:</strong>{' '}
                              <HighlightText text={b.publisher} query={searchQuery} /> ({b.year})
                              <span className="mx-2 text-slate-300">|</span>
                            </>
                          )}
                          {b.isbn && (
                            <>
                              <span className="mx-2 text-slate-300">|</span>
                              <strong className="text-slate-800">ISBN:</strong> {b.isbn}
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      {/* Bulletin Footer */}
      <div className="mt-12 pt-6 border-t border-slate-200 text-center text-xs text-slate-500 space-y-1">
        <p className="font-semibold text-slate-700">
          UNIVERSIDAD NACIONAL TECNOLÓGICA DE LIMA SUR (UNTELS)
        </p>
        <p>
          Av. Central y Av. Bolívar, Villa El Salvador, Lima - Perú
        </p>
      </div>

    </div>
  );
};
