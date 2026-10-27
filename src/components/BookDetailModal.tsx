import React, { useState } from 'react';
import { Book, formatCallNumber } from '../types/book';
import { X, Copy, Check, BookOpen, MapPin, Tag, Share2, Layers, Bookmark } from 'lucide-react';

interface BookDetailModalProps {
  book: Book | null;
  onClose: () => void;
}

export const BookDetailModal: React.FC<BookDetailModalProps> = ({ book, onClose }) => {
  const [citationFormat, setCitationFormat] = useState<'APA' | 'IEEE' | 'Vancouver'>('APA');
  const [copiedCitation, setCopiedCitation] = useState(false);
  const [copiedCallNumber, setCopiedCallNumber] = useState(false);

  if (!book) return null;
  const displayCallNumber = formatCallNumber(book.callNumber);

  // Generate citation
  const generateCitation = () => {
    const mainAuthor = book.author;
    const title = book.title;
    const year = book.year;
    const publisherPart = book.publisher && book.publisher.trim() !== '' && book.publisher.trim().toLowerCase() !== 'no especificado'
      ? book.publisher
      : '';
    const edition = book.edition ? ` (${book.edition})` : '';

    if (citationFormat === 'APA') {
      return `${mainAuthor} (${year}). ${title}${edition}.${publisherPart ? ` ${publisherPart}.` : ''}`;
    } else if (citationFormat === 'IEEE') {
      return `[1] ${mainAuthor}, "${title}," ${edition ? edition.trim() + ', ' : ''}${publisherPart ? publisherPart + ', ' : ''}${year}.`;
    } else {
      // Vancouver
      return `${mainAuthor}. ${title}. ${edition ? edition.trim() + '. ' : ''}${publisherPart ? publisherPart + '; ' : ''}${year}.`;
    }
  };

  const handleCopyCitation = () => {
    navigator.clipboard.writeText(generateCitation());
    setCopiedCitation(true);
    setTimeout(() => setCopiedCitation(false), 2000);
  };

  const handleCopyCall = () => {
    navigator.clipboard.writeText(displayCallNumber);
    setCopiedCallNumber(true);
    setTimeout(() => setCopiedCallNumber(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header Ribbon */}
        <div
          className="px-6 py-5 text-white flex items-start justify-between relative"
          style={{ backgroundColor: book.coverColor || '#0284c7' }}
        >
          <div className="pr-8">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white/90 mb-1">
              <span className="font-mono">{book.year}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif-book font-bold text-white leading-tight">
              {book.title}
            </h2>
            <p className="text-sm text-white/90 mt-1 font-medium">
              {book.author}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-black/20 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Signatura Topográfica Banner */}
          <div className="bg-sky-50 border border-sky-200/80 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-bold text-sky-900 uppercase tracking-wider block">
                Signatura Topográfica (Ubicación en Estantería)
              </span>
              <code className="text-lg font-mono font-bold text-sky-950 mt-0.5 block">
                {displayCallNumber}
              </code>
              <span className="text-xs text-sky-800 flex items-center gap-1 mt-1">
                <MapPin className="w-3.5 h-3.5 text-sky-600" />
                {book.location}
              </span>
            </div>
            {displayCallNumber !== 'Preguntar en biblioteca' && (
              <button
                onClick={handleCopyCall}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-sky-900 bg-white border border-sky-300 rounded-lg hover:bg-sky-100 transition-colors cursor-pointer shrink-0 self-start sm:self-auto"
              >
                {copiedCallNumber ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCallNumber ? '¡Copiado!' : 'Copiar Signatura'}</span>
              </button>
            )}
          </div>

          {/* Bibliographic Data Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="border border-slate-200 rounded-lg p-3 space-y-2">
              <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] block border-b border-slate-100 pb-1">
                Detalles de Publicación
              </span>
              {book.publisher && book.publisher.trim() !== '' && book.publisher.trim().toLowerCase() !== 'no especificado' && (
                <div>
                  <span className="text-slate-500 block">Editorial:</span>
                  <span className="font-semibold text-slate-800">{book.publisher}</span>
                </div>
              )}
              <div className="flex justify-between">
                <div>
                  <span className="text-slate-500 block">Año de Edición:</span>
                  <span className="font-semibold text-slate-800 font-mono">{book.year}</span>
                </div>
                {book.edition && (
                  <div>
                    <span className="text-slate-500 block">Edición:</span>
                    <span className="font-semibold text-slate-800">{book.edition}</span>
                  </div>
                )}
              </div>
              {book.isbn && (
                <div>
                  <span className="text-slate-500 block">ISBN:</span>
                  <span className="font-mono text-slate-800">{book.isbn}</span>
                </div>
              )}
            </div>

            <div className="border border-slate-200 rounded-lg p-3 space-y-2">
              <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] block border-b border-slate-100 pb-1">
                Disponibilidad en Biblioteca
              </span>
              <div>
                <span className="text-slate-500 block">Estado de Ejemplares:</span>
                <span className="text-emerald-700 font-bold text-sm">
                  {book.availableCopies} disponibles de {book.copies} ejemplares en colección
                </span>
              </div>
              <div className="flex justify-between">
                <div>
                  <span className="text-slate-500 block">Tipo de Formato:</span>
                  <span className="font-semibold text-slate-800">{book.format}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Modalidad de Préstamo:</span>
                  <span className="font-semibold text-slate-800">Sala y Domicilio</span>
                </div>
              </div>
            </div>
          </div>

          {/* Summary / Descriptors */}
          {book.summary && (
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Resumen / Contenido Temático
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                {book.summary}
              </p>
            </div>
          )}

          {/* Descriptors / Keywords (Unboxed quiet text with separators) */}
          {book.keywords && book.keywords.length > 0 && (
            <div className="text-xs">
              <span className="font-bold text-slate-700 mr-2">Descriptores / Materias:</span>
              <span className="text-slate-600">
                {book.keywords.join(' · ')}
              </span>
            </div>
          )}

          {/* Citation Generator */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/60 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-sky-700" />
                Citar este libro para tesis e investigaciones
              </span>
              
              {/* Citation Style Tabs */}
              <div className="flex items-center bg-white p-0.5 rounded-lg border border-slate-200 self-start sm:self-auto text-xs">
                {(['APA', 'IEEE', 'Vancouver'] as const).map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => setCitationFormat(fmt)}
                    className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                      citationFormat === fmt
                        ? 'bg-sky-600 text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white p-3 rounded-lg border border-slate-200 font-serif-book text-xs sm:text-sm text-slate-800 select-all">
              {generateCitation()}
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleCopyCitation}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-sky-800 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-lg transition-colors cursor-pointer"
              >
                {copiedCitation ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCitation ? '¡Cita Copiada!' : `Copiar cita en formato ${citationFormat}`}</span>
              </button>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            Ficha Catalográfica según normas Angloamericanas (RDA) · Biblioteca Central UNTELS
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
};
