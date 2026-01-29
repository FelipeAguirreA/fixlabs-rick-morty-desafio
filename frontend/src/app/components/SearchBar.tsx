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

  useEffect(() => setLocalValue(value), [value]);

  useEffect(() => {
    const id = setTimeout(() => onDebouncedChange(localValue), delayMs);
    return () => clearTimeout(id);
  }, [localValue, delayMs, onDebouncedChange]);

  return (
    <div className="w-full">
      <label className="block text-sm font-medium mb-2">Buscar personaje</label>
      <input
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder="Ej: Rick, Morty..."
        className="w-full rounded-md border px-3 py-2 outline-none focus:ring"
      />
      <p className="mt-2 text-xs text-gray-500">
        La búsqueda aplica debounce (≥ 300ms).
      </p>
    </div>
  );
}
