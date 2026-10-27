import React, { useState } from 'react';
import { BookOpen } from 'lucide-react';
import { Book } from '../types/book';

interface HeaderProps {
  books: Book[];
}

export const Header: React.FC<HeaderProps> = ({ books }) => {
  const [imgError, setImgError] = useState(false);
  const logoUrl = 'https://posgrado.untels.edu.pe/assets/img/pagos/pago-caja.png';
  const localLogo = '/assets/aistudio/untels_logo_dfb6cc09.jpeg';
  const [currentSrc, setCurrentSrc] = useState(logoUrl);

  const totalBooks = books.length;

  return (
    <header className="bg-gradient-to-r from-sky-600 via-sky-500 to-cyan-600 text-white shadow-md border-b border-sky-400/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Logo & Institutional Title */}
          <div className="flex items-center gap-3.5 w-full sm:w-auto">
            <div className="bg-white p-1 rounded-xl shadow-sm flex items-center justify-center shrink-0 w-12 h-12 overflow-hidden border border-sky-100">
              {!imgError ? (
                <img
                  src={currentSrc}
                  alt="Logo UNTELS"
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                  onError={() => {
                    if (currentSrc !== localLogo) setCurrentSrc(localLogo);
                    else setImgError(true);
                  }}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-sky-700 text-white rounded-lg">
                  <span className="text-[10px] font-black tracking-tighter leading-none">UNTELS</span>
                  <BookOpen className="w-3.5 h-3.5 text-sky-200 mt-0.5" />
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase drop-shadow-sm font-sans">
                  ALERTA DE LIBROS
                </h1>
              </div>
              <p className="text-xs text-sky-100 font-medium">
                Universidad Nacional Tecnológica de Lima Sur · Biblioteca Central
              </p>
            </div>
          </div>

          {/* Right side: Clean official badge with total books counter */}
          <div className="flex items-center self-end sm:self-center">
            <div className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/25 backdrop-blur-md border border-white/40 text-white font-bold text-xs sm:text-sm px-4 py-2 rounded-xl shadow-xs transition-colors">
              <BookOpen className="w-4 h-4 text-amber-200 shrink-0" />
              <span className="tabular-nums tracking-wide">{totalBooks} libros</span>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};
