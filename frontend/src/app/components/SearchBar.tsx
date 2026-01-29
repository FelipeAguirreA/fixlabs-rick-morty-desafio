'use client';

import { useEffect, useState } from 'react';

type Props = {
  value: string;
  onDebouncedChange: (value: string) => void;
  delayMs?: number;
};

export default function SearchBar({
  value,
  onDebouncedChange,
  delayMs = 350,
}: Props) {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    const id = setTimeout(() => onDebouncedChange(localValue), delayMs);
    return () => clearTimeout(id);
  }, [localValue, delayMs, onDebouncedChange]);

  return (
    <div className="w-full">
      <label className="block text-sm font-semibold mb-3 text-gray-200">Buscar personaje</label>
      <input
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder="Ej: Rick, Morty, Summer..."
        className="w-full rounded-lg bg-slate-700/50 border border-slate-600 px-4 py-3 text-gray-100 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
      />
      <p className="mt-2 text-xs text-gray-400">
        ⚡ La búsqueda aplica debounce automático (≥300ms).
      </p>
    </div>
  );
}
