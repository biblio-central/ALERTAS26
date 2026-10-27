import React, { useState } from 'react';
import { Book } from '../types/book';
import { X, Plus, Save } from 'lucide-react';
import { UNTELS_CAREERS } from '../data/initialBooks';

interface BookFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveBook: (book: Book) => void;
}

export const BookFormModal: React.FC<BookFormModalProps> = ({
  isOpen,
  onClose,
  onSaveBook,
}) => {
  const currentYear = new Date().getFullYear();
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [entryNumber, setEntryNumber] = useState('');
  const [year, setYear] = useState(currentYear);
  const [edition, setEdition] = useState('');
  const [publisher, setPublisher] = useState('');
  const [career, setCareer] = useState(UNTELS_CAREERS[1]); // Default to first actual career
  const [callNumber, setCallNumber] = useState('');
  const [isbn, setIsbn] = useState('');
  const [copies, setCopies] = useState(3);
  const [location, setLocation] = useState('Biblioteca Central UNTELS - Sala de Lectura');
  const [summary, setSummary] = useState('');
  const [keywordsStr, setKeywordsStr] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !author.trim()) return;

    const newBook: Book = {
      id: `manual-${Date.now()}`,
      entryNumber: entryNumber.trim() || undefined,
      title: title.trim(),
      author: author.trim(),
      year: Number(year) || currentYear,
      edition: edition.trim() || undefined,
      publisher: publisher.trim(), // Si no hay editorial, no pone nada
      career,
      callNumber: callNumber.trim() || `UNTELS/${year}/${Math.floor(100 + Math.random() * 900)}/ej.1`,
      isbn: isbn.trim() || undefined,
      copies: Number(copies) || 1,
      availableCopies: Number(copies) || 1,
      format: 'Físico',
      location: location.trim() || 'Biblioteca Central UNTELS',
      summary: summary.trim() || undefined,
      keywords: keywordsStr
        ? keywordsStr.split(/[,;]/).map((k) => k.trim()).filter(Boolean)
        : [career],
      coverColor: '#0284c7',
      acquisitionDate: new Date().toISOString().slice(0, 10),
    };

    onSaveBook(newBook);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-xl w-full overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-600 to-cyan-600 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-white" />
            <h3 className="font-bold text-lg text-white">
              Registrar Nuevo Libro en la Alerta
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                N° de Ingreso (Opcional)
              </label>
              <input
                type="text"
                value={entryNumber}
                onChange={(e) => setEntryNumber(e.target.value)}
                placeholder="Ej. 04521"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Año de Publicación *
              </label>
              <input
                type="number"
                required
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                min={1950}
                max={2030}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Título de la Obra *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej. Inteligencia Artificial Aplicada a la Robótica"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Autor(es) Principal(es) *
            </label>
            <input
              type="text"
              required
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Ej. Russell, Stuart; Norvig, Peter"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Carrera / Especialidad
              </label>
              <select
                value={career}
                onChange={(e) => setCareer(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500"
              >
                {UNTELS_CAREERS.filter((c) => c !== 'Todas las Carreras').map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Editorial
              </label>
              <input
                type="text"
                value={publisher}
                onChange={(e) => setPublisher(e.target.value)}
                placeholder="Ej. Pearson Educación, Alfaomega..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Signatura Topográfica
              </label>
              <input
                type="text"
                value={callNumber}
                onChange={(e) => setCallNumber(e.target.value)}
                placeholder="621.3192/I76/2003/ej.2"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Edición
              </label>
              <input
                type="text"
                value={edition}
                onChange={(e) => setEdition(e.target.value)}
                placeholder="Ej. 4ta ed."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Ejemplares
              </label>
              <input
                type="number"
                value={copies}
                min={1}
                max={50}
                onChange={(e) => setCopies(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Descriptores / Palabras Clave (separadas por coma)
            </label>
            <input
              type="text"
              value={keywordsStr}
              onChange={(e) => setKeywordsStr(e.target.value)}
              placeholder="Ej. Inteligencia Artificial, Redes Neuronales, Python"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Resumen Breve
            </label>
            <textarea
              rows={2}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Contenido principal del libro o temas de investigación que aborda..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500"
            />
          </div>

          {/* Buttons */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              Guardar en la Alerta
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
