import React from 'react';
import { Clock } from 'lucide-react';
import { Book } from '../types/book';

interface AlertBannerProps {
  books: Book[];
  availableYears: number[];
}

export const AlertBanner: React.FC<AlertBannerProps> = ({ books, availableYears }) => {
  const latestYear = availableYears.length > 0 ? Math.max(...availableYears) : new Date().getFullYear();
  const totalCopies = books.reduce((sum, b) => sum + (b.copies || 1), 0);
  const totalAvailable = books.reduce((sum, b) => sum + (b.availableCopies !== undefined ? b.availableCopies : b.copies || 1), 0);

  return (
    <section className="bg-white border-b border-slate-200/80 shadow-2xs no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Main Statement */}
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-sky-700 tracking-wider uppercase mb-0.5">
              <Clock className="w-3.5 h-3.5" />
              <span>Cronología Bibliográfica · Prioridad Novedades</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Alerta de Libros y Adquisiciones Recientes
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5 max-w-2xl">
              Catálogo oficial ordenado desde el año más reciente (<span className="font-semibold text-sky-700">{latestYear}</span>). Realiza búsquedas y consultas por año, especialidad y autor.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex items-center gap-4 sm:gap-6 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 shrink-0 self-start md:self-auto">
            <div>
              <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider block">Total Libros</span>
              <span className="text-base sm:text-lg font-bold text-slate-900 tabular-nums">{books.length}</span>
            </div>
            <div className="h-7 w-px bg-slate-200" />
            <div>
              <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider block">Año Reciente</span>
              <span className="text-base sm:text-lg font-bold text-sky-700 tabular-nums">{latestYear}</span>
            </div>
            <div className="h-7 w-px bg-slate-200" />
            <div>
              <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider block">Disponibles</span>
              <span className="text-base sm:text-lg font-bold text-emerald-700 tabular-nums">{totalAvailable} / {totalCopies}</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
