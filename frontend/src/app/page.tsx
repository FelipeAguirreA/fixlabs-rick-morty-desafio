'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import SearchBar from './components/SearchBar';
import CharacterCard from './components/CharacterCard';
import SkeletonCard from './components/SkeletonCard';

type RMSearchResult = {
  id: number;
  name: string;
  status: 'Alive' | 'Dead' | 'unknown';
};

type RMSearchResponse = {
  results: RMSearchResult[];
};

type BackendCharacter = {
  id: number;
  name: string;
  status: 'Alive' | 'Dead' | 'unknown';
  species: string;
  type: string;
  gender: string;
  image: string;
  origin: {
    name: string;
    location: { name: string; type: string; dimension: string } | null;
  };
};

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL;

async function searchByName(name: string): Promise<RMSearchResult[]> {
  const q = name.trim();
  if (!q) return [];

  const res = await fetch(
    `https://rickandmortyapi.com/api/character/?name=${encodeURIComponent(q)}`,
  );

  if (!res.ok) {
    // En esa API, 404 significa “sin resultados”
    if (res.status === 404) return [];
    throw new Error('Error buscando personajes');
  }

  const data = (await res.json()) as RMSearchResponse;
  const results = data.results ?? [];

  return results.map((c) => ({
    id: c.id,
    name: c.name,
    status: c.status,
  }));
}

async function fetchFromBackend(id: number): Promise<BackendCharacter> {
  if (!BACKEND) throw new Error('Falta NEXT_PUBLIC_BACKEND_URL');

  const res = await fetch(`${BACKEND}/character/${id}`);

  if (!res.ok) {
    if (res.status === 404) throw new Error('Personaje no encontrado');
    throw new Error('Error consultando el backend');
  }

  return (await res.json()) as BackendCharacter;
}

export default function Page() {
  const [debouncedQuery, setDebouncedQuery] = useState('');

  const [statusFilter, setStatusFilter] = useState<
    'all' | 'Alive' | 'Dead' | 'unknown'
  >('all');

  const [options, setOptions] = useState<RMSearchResult[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [loadingOptions, setLoadingOptions] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const [character, setCharacter] = useState<BackendCharacter | null>(null);
  const [error, setError] = useState<string | null>(null);

  const filteredOptions = useMemo(() => {
    if (statusFilter === 'all') return options;
    return options.filter((o) => o.status === statusFilter);
  }, [options, statusFilter]);

  const onDebouncedChange = useCallback((v: string) => {
    setDebouncedQuery(v);
  }, []);

  // Buscar por nombre (API pública) -> lista
  useEffect(() => {
    let cancelled = false;

    async function run() {
      setError(null);
      setLoadingOptions(true);
      setSelectedId(null);
      setCharacter(null);

      try {
        const results = await searchByName(debouncedQuery);
        if (!cancelled) setOptions(results);
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : 'Error inesperado';
        if (!cancelled) setError(message);
      } finally {
        if (!cancelled) setLoadingOptions(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  // Cargar detalle desde tu backend cuando seleccionas un ID
  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (selectedId == null) return;

      setError(null);
      setLoadingDetail(true);

      try {
        const data = await fetchFromBackend(selectedId);
        if (!cancelled) setCharacter(data);
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : 'Error inesperado';
        if (!cancelled) setError(message);
      } finally {
        if (!cancelled) setLoadingDetail(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [selectedId]);

  return (
    <main className="min-h-screen p-6">
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <header className="space-y-2">
          <h1 className="text-2xl font-bold">Rick & Morty Explorer</h1>
          <p className="text-gray-600">
            Busca personajes, filtra por estado y carga el detalle desde tu backend.
          </p>
        </header>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <SearchBar value={debouncedQuery} onDebouncedChange={onDebouncedChange} />

          <div>
            <label className="block text-sm font-medium mb-2">
              Filtrar por status
            </label>

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value as 'all' | 'Alive' | 'Dead' | 'unknown',
                )
              }
              className="w-full rounded-md border px-3 py-2 outline-none focus:ring"
            >
              <option value="all">Todos</option>
              <option value="Alive">Alive</option>
              <option value="Dead">Dead</option>
              <option value="unknown">Unknown</option>
            </select>

            <p className="mt-2 text-xs text-gray-500">
              Tip: si no aparece nada, prueba otra búsqueda.
            </p>
          </div>
        </section>

        <section className="rounded-lg border p-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-semibold">Resultados</h2>

            {loadingOptions ? (
              <span className="text-sm text-gray-500">Buscando...</span>
            ) : (
              <span className="text-sm text-gray-500">
                {filteredOptions.length} encontrados
              </span>
            )}
          </div>

          <div className="mt-4 grid grid-cols-1 gap-2 md:grid-cols-2">
            {loadingOptions ? (
              <>
                <div className="h-10 rounded bg-gray-100 animate-pulse" />
                <div className="h-10 rounded bg-gray-100 animate-pulse" />
                <div className="h-10 rounded bg-gray-100 animate-pulse" />
                <div className="h-10 rounded bg-gray-100 animate-pulse" />
              </>
            ) : filteredOptions.length === 0 ? (
              <p className="text-sm text-gray-600">Sin resultados.</p>
            ) : (
              filteredOptions.map((o) => (
                <button
                  key={o.id}
                  onClick={() => setSelectedId(o.id)}
                  className={`rounded border px-3 py-2 text-left hover:bg-gray-50 ${
                    selectedId === o.id ? 'ring-2' : ''
                  }`}
                >
                  <div className="font-medium">{o.name}</div>
                  <div className="text-xs text-gray-600">{o.status}</div>
                </button>
              ))
            )}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="font-semibold">Detalle</h2>

          {error ? (
            <div className="rounded-lg border p-4 text-sm text-red-600">
              {error}
            </div>
          ) : loadingDetail ? (
            <SkeletonCard />
          ) : character ? (
            <CharacterCard character={character} />
          ) : (
            <div className="rounded-lg border p-4 text-sm text-gray-600">
              Selecciona un personaje para ver el detalle.
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
