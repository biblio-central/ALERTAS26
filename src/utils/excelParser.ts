import * as XLSX from 'xlsx';
import { Book } from '../types/book';

// Normalized key detector that strips diacritics, spaces, and punctuation
function normalizeKey(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');
}

export function parseExcelFile(file: File): Promise<{ books: Book[]; count: number }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array', cellDates: true });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // raw: false gets formatted strings preserving leading zeroes and text formatting
        const rawJson = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, {
          defval: '',
          raw: false,
        });

        if (!rawJson || rawJson.length === 0) {
          resolve({ books: [], count: 0 });
          return;
        }

        const books: Book[] = rawJson.map((row, index) => {
          const keys = Object.keys(row);
          const getVal = (targetKeys: string[]): string => {
            // First try exact key match
            for (const key of keys) {
              const norm = normalizeKey(key);
              if (targetKeys.some((t) => norm === t)) {
                const val = row[key];
                return val !== undefined && val !== null ? String(val).trim() : '';
              }
            }
            // Then try partial match
            for (const key of keys) {
              const norm = normalizeKey(key);
              if (targetKeys.some((t) => norm.includes(t))) {
                const val = row[key];
                return val !== undefined && val !== null ? String(val).trim() : '';
              }
            }
            return '';
          };

          // 1. Número de Ingreso (e.g. "000331") - Must prioritize 'ingreso' over simple row 'n' / 'nro'
          let entryNumber = getVal(['numerodeingreso', 'numeroingreso', 'nroingreso', 'noingreso', 'ingreso', 'codigoingreso', 'acceso']);
          if (!entryNumber) {
            // fallback if column is just 'registro'
            entryNumber = getVal(['registro']);
          }
          // Format numeric strings to 6 digits if needed (e.g., 331 -> 000331)
          if (entryNumber && /^\d+$/.test(entryNumber) && entryNumber.length < 6) {
            entryNumber = entryNumber.padStart(6, '0');
          }

          // 2. Clasificación (e.g. "621.3192/I76/2003/ej.2") - Preserve exact slashes and formatting
          let callNumber = getVal(['clasificacion', 'signatura', 'cota', 'callnumber', 'codigo']) || '';
          const upperCall = callNumber.toUpperCase();
          if (!callNumber || upperCall === 'S/C' || upperCall === 'SC' || upperCall.includes('PROCESO') || upperCall.includes('TECNICO')) {
            callNumber = 'Preguntar en Biblioteca';
          }

          // 3. Título
          const title = getVal(['titulo', 'title', 'nombre', 'obra', 'libro']) || `Libro #${index + 1}`;

          // 4. Autor
          const author = getVal(['autor', 'autores', 'author']) || 'Autor No Especificado';

          // 5. Año
          const rawYear = getVal(['ano', 'year', 'fecha', 'publicacion']);
          let year = 0;
          const yearMatch = rawYear.match(/\b(19\d\d|20\d\d)\b/);
          if (yearMatch) {
            year = parseInt(yearMatch[0], 10);
          } else {
            const parsedNum = parseInt(rawYear, 10);
            year = !isNaN(parsedNum) && parsedNum > 1900 && parsedNum < 2100 ? parsedNum : 0;
          }

          // 6. Edición (e.g. "6a ed.")
          const edition = getVal(['edicion', 'edition']) || undefined;

          // 7. ISBN (e.g. "978-9972-421-95-2")
          const isbn = getVal(['isbn']) || undefined;

          // 8. Editorial & Carrera (empty string if not in file, don't invent)
          const publisher = getVal(['editorial', 'publisher', 'editor']) || '';
          const career = getVal(['carrera', 'especialidad', 'facultad', 'area', 'escuela']) || '';

          const rawCopies = getVal(['ejemplares', 'copias', 'cantidad', 'stock']);
          const copies = rawCopies && !isNaN(parseInt(rawCopies, 10)) ? parseInt(rawCopies, 10) : 1;

          return {
            id: `excel-row-${index + 1}-${entryNumber || index}`,
            entryNumber: entryNumber || undefined,
            title,
            author,
            year: year || new Date().getFullYear(),
            edition,
            publisher,
            career,
            callNumber: callNumber || 'S/C',
            isbn,
            copies,
            availableCopies: copies,
            format: 'Físico',
            location: '',
            keywords: [],
            coverColor: '#0284c7',
          };
        });

        resolve({ books, count: books.length });
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });
}

// Download books array as a structured JSON file (booksData.json)
export function downloadJsonFile(data: unknown, filename = 'booksData.json') {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Official Sample Excel Download with UNTELS structure
export function downloadSampleExcel() {
  const sampleData = [
    {
      'N°': 1,
      'NÚMERO DE INGRESO': '000331',
      'CLASIFICACIÓN': '621.3192/I76/2003',
      'TITULO': 'Análisis básico de circuitos en ingeniería',
      'AUTOR': 'Irwin J. David',
      'AÑO': 2003,
      'EDICIÓN': '6a ed.',
      'ISBN': '',
    },
    {
      'N°': 2,
      'NÚMERO DE INGRESO': '000332',
      'CLASIFICACIÓN': '621.3192/I76/2003/ej.2',
      'TITULO': 'Análisis básico de circuitos en ingeniería',
      'AUTOR': 'Irwin J. David',
      'AÑO': 2003,
      'EDICIÓN': '6a ed.',
      'ISBN': '',
    },
    {
      'N°': 3,
      'NÚMERO DE INGRESO': '000233',
      'CLASIFICACIÓN': '515.43/K74/2004',
      'TITULO': 'Cálculo integral',
      'AUTOR': 'Kong Maynard',
      'AÑO': 2004,
      'EDICIÓN': '4a ed.',
      'ISBN': '978-9972-421-95-2',
    },
    {
      'N°': 4,
      'NÚMERO DE INGRESO': '000234',
      'CLASIFICACIÓN': '515.43/K74/2004/ej.2',
      'TITULO': 'Cálculo integral',
      'AUTOR': 'Kong Maynard',
      'AÑO': 2004,
      'EDICIÓN': '4a ed.',
      'ISBN': '978-9972-421-95-2',
    },
    {
      'N°': 5,
      'NÚMERO DE INGRESO': '000269',
      'CLASIFICACIÓN': '519.53/E92',
      'TITULO': 'Estadística descriptiva y nociones de probabilidades',
      'AUTOR': 'Esteban Jesús',
      'AÑO': 2005,
      'EDICIÓN': '',
      'ISBN': '',
    },
    {
      'N°': 6,
      'NÚMERO DE INGRESO': '000199',
      'CLASIFICACIÓN': '512/G65',
      'TITULO': 'Introducción al álgebra',
      'AUTOR': 'Gonçalves Adilson',
      'AÑO': 2002,
      'EDICIÓN': '',
      'ISBN': '9972-9394-2-1',
    },
    {
      'N°': 7,
      'NÚMERO DE INGRESO': '000374',
      'CLASIFICACIÓN': '658.562/N28',
      'TITULO': '¿Qué es la calidad?',
      'AUTOR': 'Nava Carbellido Victor Manuel',
      'AÑO': 2005,
      'EDICIÓN': '',
      'ISBN': '978-968-18-6579-5',
    },
    {
      'N°': 8,
      'NÚMERO DE INGRESO': '000044',
      'CLASIFICACIÓN': '658/CH548',
      'TITULO': 'Administración en los nuevos tiempos',
      'AUTOR': 'Chiavenato Idalberto',
      'AÑO': 2004,
      'EDICIÓN': '',
      'ISBN': '958-41-0301-3',
    },
  ];

  const worksheet = XLSX.utils.json_to_sheet(sampleData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Alerta_Libros_UNTELS');
  XLSX.writeFile(workbook, 'Plantilla_Alerta_Libros_UNTELS.xlsx');
}

export function exportBooksToExcel(books: Book[], filename = 'Alerta_Libros_UNTELS.xlsx') {
  const exportRows = books.map((b, index) => ({
    'N°': index + 1,
    'NÚMERO DE INGRESO': b.entryNumber || '',
    'CLASIFICACIÓN': b.callNumber || '',
    'TITULO': b.title,
    'AUTOR': b.author,
    'AÑO': b.year,
    'EDICIÓN': b.edition || '',
    'ISBN': b.isbn || '',
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportRows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Alerta_Libros');
  XLSX.writeFile(workbook, filename);
}
