import React, { useState, useRef } from 'react';
import { Upload, FileSpreadsheet, X, CheckCircle2, AlertTriangle, Download, ArrowRight, Loader2, FileJson, Sparkles } from 'lucide-react';
import { Book } from '../types/book';
import { parseExcelFile, downloadJsonFile, downloadSampleExcel } from '../utils/excelParser';

interface ExcelUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportBooks: (newBooks: Book[]) => void;
}

export const ExcelUploadModal: React.FC<ExcelUploadModalProps> = ({
  isOpen,
  onClose,
  onImportBooks,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parsedPreview, setParsedPreview] = useState<{
    fileName: string;
    books: Book[];
    count: number;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const processFile = async (file: File) => {
    if (!file.name.match(/\.(xlsx|xls|csv)$/i)) {
      setError('Por favor selecciona un archivo válido de Excel (.xlsx, .xls) o CSV (.csv)');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await parseExcelFile(file);
      if (result.count === 0) {
        setError('El archivo Excel no contiene filas de datos o las columnas no pudieron leerse.');
        setLoading(false);
        return;
      }

      setParsedPreview({
        fileName: file.name,
        books: result.books,
        count: result.count,
      });
    } catch (err: any) {
      console.error(err);
      setError(`Error al leer el archivo Excel: ${err.message || 'Formato no reconocido'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const handleConfirmImport = () => {
    if (!parsedPreview) return;
    onImportBooks(parsedPreview.books);
    onClose();
  };

  const handleDownloadConvertedJson = () => {
    if (!parsedPreview) return;
    downloadJsonFile(parsedPreview.books, 'booksData.json');
  };

  const resetUpload = () => {
    setParsedPreview(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-sky-600 via-sky-500 to-cyan-600 text-white px-6 py-4 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-xs border border-white/30">
              <FileSpreadsheet className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white tracking-tight flex items-center gap-2">
                Adjuntar Excel y Convertir a JSON
                <span className="text-[10px] uppercase font-bold bg-amber-400 text-amber-950 px-2 py-0.5 rounded-full">
                  UNTELS
                </span>
              </h3>
              <p className="text-xs text-sky-100 font-medium">
                Carga tu archivo con N° de Ingreso, Clasificación, Título, Autor, Año, Edición e ISBN
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar modal"
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {!parsedPreview ? (
            <>
              {/* Dropzone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-sky-500 bg-sky-50/80 scale-[0.99]'
                    : 'border-slate-300 hover:border-sky-500 hover:bg-sky-50/30'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx, .xls, .csv"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {loading ? (
                  <div className="flex flex-col items-center justify-center py-6">
                    <Loader2 className="w-12 h-12 text-sky-600 animate-spin mb-3" />
                    <p className="text-base font-bold text-slate-800">
                      Leyendo y convirtiendo archivo Excel a JSON...
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Mapeando columnas: N° de Ingreso, Clasificación, Título, Autor, Año, Edición, ISBN
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-sky-100 text-sky-700 rounded-2xl flex items-center justify-center mb-3 shadow-inner">
                      <Upload className="w-8 h-8" />
                    </div>
                    <p className="text-base font-bold text-slate-800">
                      Arrastra tu archivo Excel aquí o haz clic para seleccionarlo
                    </p>
                    <p className="text-xs text-slate-500 mt-1.5">
                      Archivos soportados: <span className="font-semibold text-slate-700">.xlsx, .xls, .csv</span>
                    </p>
                    
                    <div className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs shadow-sm transition-all hover:scale-102">
                      <FileSpreadsheet className="w-4 h-4 text-amber-300" />
                      <span>Examinar en mi computadora</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Error message */}
              {error && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-800">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">No se pudo procesar el archivo:</span>
                    <span>{error}</span>
                  </div>
                </div>
              )}

              {/* Information Box */}
              <div className="bg-sky-50/70 border border-sky-100 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div>
                  <h4 className="font-bold text-sky-950 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                    Estructura exacta soportada
                  </h4>
                  <p className="text-sky-800/80 mt-0.5">
                    Reconoce columnas oficiales: <span className="font-mono font-semibold">N°, NÚMERO DE INGRESO, CLASIFICACIÓN, TITULO, AUTOR, AÑO, EDICIÓN, ISBN</span>.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={downloadSampleExcel}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 font-semibold text-sky-800 bg-sky-100 hover:bg-sky-200 rounded-lg transition-colors shrink-0 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  Descargar Plantilla
                </button>
              </div>
            </>
          ) : (
            /* Preview of Parsed Books */
            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 rounded-xl text-emerald-700">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">
                      ¡Excel convertido a JSON exitosamente!
                    </h4>
                    <p className="text-xs text-emerald-800">
                      Se identificaron <strong className="font-black text-emerald-950">{parsedPreview.count} libros</strong> en <span className="font-mono">{parsedPreview.fileName}</span>.
                    </p>
                  </div>
                </div>
                <button
                  onClick={resetUpload}
                  className="text-xs font-semibold text-slate-600 hover:text-slate-900 underline cursor-pointer"
                >
                  Cambiar archivo
                </button>
              </div>

              {/* Table preview (first 5 items) */}
              <div className="border border-slate-200 rounded-xl overflow-hidden text-xs shadow-xs">
                <div className="bg-slate-100 px-3.5 py-2 font-bold text-slate-700 flex justify-between items-center border-b border-slate-200">
                  <span>Vista previa de registros convertidos:</span>
                  <span className="font-mono text-slate-500 text-[11px]">Mostrando los primeros 5</span>
                </div>
                <div className="max-h-56 overflow-y-auto divide-y divide-slate-100">
                  {parsedPreview.books.slice(0, 5).map((b, i) => (
                    <div key={i} className="p-3 hover:bg-sky-50/50 flex items-start justify-between gap-3 transition-colors">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {b.entryNumber && (
                            <span className="font-mono text-[10px] font-bold bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded border border-amber-200">
                              N° {b.entryNumber}
                            </span>
                          )}
                          <span className="font-mono text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200">
                            {b.callNumber}
                          </span>
                          {b.edition && (
                            <span className="text-[10px] text-slate-500 italic">
                              {b.edition}
                            </span>
                          )}
                        </div>
                        <div className="font-bold text-slate-900 text-sm truncate">
                          {b.title}
                        </div>
                        <div className="text-[11px] text-slate-600 truncate mt-0.5">
                          Autor: {b.author} {b.isbn ? `· ISBN: ${b.isbn}` : ''}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-mono font-bold text-sky-800 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded-md text-xs">
                          {b.year}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Info text */}
              <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex items-center justify-between">
                <span>Al confirmar, los datos se guardarán en tu navegador y actualizarán la Alerta de Libros y el buscador al instante.</span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            Cerrar
          </button>

          {parsedPreview && (
            <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
              {/* Option to download JSON directly */}
              <button
                type="button"
                onClick={handleDownloadConvertedJson}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-bold text-sky-800 bg-sky-100 hover:bg-sky-200 rounded-xl transition-colors cursor-pointer border border-sky-300"
                title="Descargar archivo booksData.json generado"
              >
                <FileJson className="w-3.5 h-3.5 text-sky-700" />
                <span>Descargar JSON ({parsedPreview.count} libros)</span>
              </button>

              {/* Confirm and load into app */}
              <button
                type="button"
                onClick={handleConfirmImport}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700 rounded-xl shadow-md transition-all cursor-pointer hover:shadow-lg"
              >
                <span>Cargar en la Alerta ({parsedPreview.count} libros)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
