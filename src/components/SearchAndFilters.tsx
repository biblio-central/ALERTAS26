import React from 'react';
import { Search, X, RotateCcw, ArrowUpDown, LayoutGrid, Table, Newspaper } from 'lucide-react';
import { SortOption, ViewMode } from '../types/book';

interface SearchAndFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedYear: number | 'all';
  onYearChange: (year: number | 'all') => void;
  availableYears: number[];
  sortOption: SortOption;
  onSortChange: (sort: SortOption) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  filteredCount: number;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
}

export const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedYear,
  onYearChange,
  availableYears,
  sortOption,
  onSortChange,
  viewMode,
  onViewModeChange,
  filteredCount,
  onResetFilters,
  hasActiveFilters,
}) => {
  const isSearching = searchQuery.trim() !== '';

  return (
    <div className="bg-white border-b border-slate-200 sticky top-0 z-30 py-4 shadow-2xs no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3.5">
        
        {/* 1. BUSCADOR EN EL MEDIO CON BORDE DORADO BONITO */}
        <div className="w-full max-w-2xl mx-auto">
          <div className="relative group">
            <div className="flex items-center w-full bg-white rounded-xl border-2 border-amber-400 hover:border-amber-500 focus-within:border-amber-500 focus-within:ring-4 focus-within:ring-amber-200/60 shadow-md transition-all">
              <div className="pl-4 pr-2 flex items-center pointer-events-none text-amber-500">
                <Search className="w-5 h-5 stroke-[2.5]" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Buscar por título, autor, signatura topográfica o año..."
                className="w-full py-2.5 pr-10 text-sm sm:text-base text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="pr-3 pl-1 text-slate-400 hover:text-amber-600 transition-colors cursor-pointer"
                  title="Limpiar búsqueda"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Año y estado de búsqueda en una fila independiente */}
        <div className="flex flex-wrap items-center gap-2.5">
            {/* Año desplegable con borde verde/destacado como en la captura */}
            <div className="relative inline-flex items-center">
              <label htmlFor="year-select" className="sr-only">Seleccionar Año</label>
              <select
                id="year-select"
                value={selectedYear}
                onChange={(e) => {
                  const val = e.target.value;
                  onYearChange(val === 'all' ? 'all' : Number(val));
                }}
                className="appearance-none bg-white border-2 border-emerald-600 text-slate-800 text-xs sm:text-sm font-semibold rounded-lg pl-3 pr-8 py-1.5 shadow-2xs hover:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 cursor-pointer"
              >
                <option value="all">Todos los Años</option>
                {availableYears.map((yr) => (
                  <option key={yr} value={yr}>
                    Año {yr}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-600">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* CRITICAL: Se encontraron X libros relacionados a tu búsqueda SOLO CUANDO HAY BÚSQUEDA */}
            {isSearching && (
              <div className="inline-flex items-center border border-emerald-200/90 rounded-full px-3.5 py-1 text-xs font-medium bg-emerald-50 text-emerald-950 shadow-2xs animate-in fade-in transition-all">
                <span>
                  Se encontraron{' '}
                  <strong className="font-bold tabular-nums px-1.5 py-0.5 rounded bg-yellow-300 text-slate-950 shadow-2xs">
                    {filteredCount}
                  </strong>{' '}
                  libros relacionados a tu búsqueda
                </span>
              </div>
            )}

            {/* Restablecer filtros si hay alguno activo */}
            {hasActiveFilters && (
              <button
                onClick={onResetFilters}
                className="inline-flex items-center gap-1 text-xs text-sky-700 hover:text-sky-900 font-semibold underline cursor-pointer ml-1"
                title="Restablecer todos los filtros"
              >
                <RotateCcw className="w-3 h-3" />
                Restablecer
              </button>
            )}
        </div>

        {/* Orden y modo de vista, sin filtros por carrera */}
        <div className="grid grid-cols-2 items-center gap-2 pt-0.5">
            {/* Ordenamiento */}
            <div className="flex w-fit max-w-full items-center gap-1 bg-slate-50 border border-slate-300 rounded-lg px-2 py-1 text-xs justify-self-center">
              <ArrowUpDown className="w-3.5 h-3.5 text-sky-600 shrink-0" />
              <label htmlFor="sort-select" className="sr-only">Ordenar</label>
              <select
                id="sort-select"
                value={sortOption}
                onChange={(e) => onSortChange(e.target.value as SortOption)}
                className="bg-transparent text-slate-800 font-medium focus:outline-none cursor-pointer"
              >
                <option value="year-desc">Año: Más reciente primero</option>
                <option value="year-asc">Año: Más antiguo primero</option>
                <option value="title-asc">Título: A → Z</option>
                <option value="title-desc">Título: Z → A</option>
                <option value="author-asc">Autor: A → Z</option>
              </select>
            </div>

            {/* Selector de Vista */}
            <div className="flex w-fit items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 justify-self-end">
              <button
                onClick={() => onViewModeChange('grid')}
                className={`p-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-white text-sky-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Vista Cuadrícula (de a dos)"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onViewModeChange('table')}
                className={`p-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-white text-sky-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Vista Tabla"
              >
                <Table className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onViewModeChange('bulletin')}
                className={`p-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  viewMode === 'bulletin'
                    ? 'bg-white text-sky-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Vista Boletín"
              >
                <Newspaper className="w-3.5 h-3.5" />
              </button>
            </div>

        </div>

      </div>
    </div>
  );
};
