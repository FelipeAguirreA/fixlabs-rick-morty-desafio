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

  // Cargar detalle desde el backend cuando se selecciona un ID
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
    <main className="min-h-screen p-4 md:p-8">
      <div className="mx-auto w-full max-w-5xl space-y-8">
        <header className="space-y-4 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
            <div className="text-4xl md:text-5xl">🎬</div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">Rick & Morty Explorer</h1>
          </div>
          <p className="text-gray-300 max-w-2xl text-base md:text-lg leading-relaxed">
            Descubre personajes del multiverso de Rick y Morty. Busca, filtra y explora detalles fascinantes de tus personajes favoritos.
          </p>
        </header>

        <section className="glass-effect rounded-2xl p-6 md:p-8 space-y-6 glow-effect">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <SearchBar value={debouncedQuery} onDebouncedChange={onDebouncedChange} />

            <div>
              <label className="block text-sm font-semibold mb-3 text-gray-200">
                Filtrar por estado
              </label>

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value as 'all' | 'Alive' | 'Dead' | 'unknown',
                  )
                }
                className="w-full rounded-lg bg-slate-700/50 border border-slate-600 px-4 py-3 text-gray-100 outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
              >
                <option value="all">Todos los estados</option>
                <option value="Alive">🟢 Vivos</option>
                <option value="Dead">💀 Fallecidos</option>
                <option value="unknown">❓ Desconocido</option>
              </select>

              <p className="mt-2 text-xs text-gray-400">
                💡 Tip: Combina búsqueda y filtro para mejores resultados.
              </p>
            </div>
          </div>
        </section>

        <section className="glass-effect rounded-2xl p-6 md:p-8">
          <div className="flex items-center justify-between gap-3 mb-6">
            <h2 className="text-2xl font-bold text-gray-100">🔍 Resultados</h2>

            {loadingOptions ? (
              <span className="text-sm text-blue-400 animate-pulse font-medium">⏳ Buscando...</span>
            ) : (
              <span className="text-sm text-gray-400 bg-slate-700/50 px-3 py-1 rounded-full">
                {filteredOptions.length} personaje{filteredOptions.length !== 1 ? 's' : ''} encontrado{filteredOptions.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {loadingOptions ? (
              <>
                <div className="h-16 rounded-lg bg-slate-700/30 animate-pulse" />
                <div className="h-16 rounded-lg bg-slate-700/30 animate-pulse" />
                <div className="h-16 rounded-lg bg-slate-700/30 animate-pulse" />
                <div className="h-16 rounded-lg bg-slate-700/30 animate-pulse" />
              </>
            ) : filteredOptions.length === 0 ? (
              <p className="text-sm text-gray-400 col-span-full text-center py-8">😕 Sin resultados. Intenta otra búsqueda.</p>
            ) : (
              filteredOptions.map((o) => {
                const statusColor = o.status === 'Alive' ? 'from-green-500/20 to-green-600/20 border-green-500/30' : o.status === 'Dead' ? 'from-red-500/20 to-red-600/20 border-red-500/30' : 'from-gray-500/20 to-gray-600/20 border-gray-500/30';
                const statusIcon = o.status === 'Alive' ? '🟢' : o.status === 'Dead' ? '💀' : '❓';
                
                return (
                  <button
                    key={o.id}
                    onClick={() => setSelectedId(o.id)}
                    className={`bg-gradient-to-br ${statusColor} rounded-lg px-4 py-3 text-left transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/20 border ${
                      selectedId === o.id ? 'ring-2 ring-blue-400 shadow-lg shadow-blue-500/40' : 'hover:bg-slate-700/40'
                    }`}
                  >
                    <div className="font-semibold text-gray-100">{o.name}</div>
                    <div className="text-xs text-gray-400 mt-1">{statusIcon} {o.status}</div>
                  </button>
                );
              })
            )}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-100">📋 Detalles del Personaje</h2>

          {error ? (
            <div className="glass-effect rounded-2xl p-6 border-red-500/50 bg-gradient-to-br from-red-500/10 to-red-600/10 text-sm text-red-300 text-center">
              ⚠️ {error}
            </div>
          ) : loadingDetail ? (
            <SkeletonCard />
          ) : character ? (
            <CharacterCard character={character} />
          ) : (
            <div className="glass-effect rounded-2xl p-12 text-center glow-effect">
              <div className="text-5xl mb-4">👤</div>
              <p className="text-gray-400 text-lg">
                Selecciona un personaje de la lista para ver sus detalles.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
