export interface Book {
  id: string;
  title: string;
  author: string;
  year: number;
  edition?: string;
  publisher: string;
  entryNumber?: string; // Número de Ingreso (ej. 000331, 000233)
  career?: string;
  callNumber: string; // Clasificación / Signatura Topográfica
  isbn?: string;
  copies?: number;
  availableCopies?: number;
  format?: 'Físico' | 'Digital' | 'Híbrido' | string;
  location?: string;
  summary?: string;
  keywords?: string[];
  coverColor?: string;
  acquisitionDate?: string;
}

export interface BookGroup {
  id: string;
  book: Book;
  records: Book[];
}

export type SortOption = 'year-desc' | 'year-asc' | 'title-asc' | 'title-desc' | 'author-asc';

export type ViewMode = 'grid' | 'table' | 'bulletin';

// Carreras oficiales de Pregrado de la UNTELS (según portal oficial)
export const UNTELS_CAREERS = [
  'Todas las Carreras',
  'Administración de Empresas',
  'Ingeniería Ambiental',
  'Ingeniería de Sistemas',
  'Ingeniería Electrónica y Telecomunicaciones',
  'Ingeniería Mecánica y Eléctrica',
  'Ingeniería de Ciencia de Datos e Inteligencia Artificial',
  'Ingeniería Industrial',
  'Estudios Generales',
] as const;

export type UntelsCareer = typeof UNTELS_CAREERS[number];

/** Formatea la signatura topográfica, indicando consultar en biblioteca si no está disponible. */
export function formatCallNumber(callNumber?: string): string {
  if (!callNumber || !callNumber.trim()) return 'Preguntar en biblioteca';
  const upper = callNumber.trim().toUpperCase();
  if (upper === 'S/C' || upper === 'SC' || upper.includes('PROCESO') || upper.includes('TECNICO')) {
    return 'Preguntar en biblioteca';
  }
  return callNumber.trim();
}
