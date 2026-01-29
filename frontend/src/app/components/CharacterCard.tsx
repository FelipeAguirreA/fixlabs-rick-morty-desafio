type OriginLocation = {
  name: string;
  type: string;
  dimension: string;
};

type Character = {
  id: number;
  name: string;
  status: 'Alive' | 'Dead' | 'unknown';
  species: string;
  type: string;
  gender: string;
  image: string;
  origin: {
    name: string;
    location: OriginLocation | null;
  };
};

export default function CharacterCard({ character }: { character: Character }) {
  const statusLabel =
    character.status === 'unknown' ? 'Desconocido' : character.status === 'Alive' ? 'Vivo' : 'Fallecido';
  const statusIcon = character.status === 'Alive' ? '🟢' : character.status === 'Dead' ? '💀' : '❓';
  const statusColor = character.status === 'Alive' ? 'from-green-500/20 to-green-600/20 border-green-500/30' : character.status === 'Dead' ? 'from-red-500/20 to-red-600/20 border-red-500/30' : 'from-gray-500/20 to-gray-600/20 border-gray-500/30';

  return (
    <div className={`glass-effect w-full rounded-2xl p-6 bg-gradient-to-br ${statusColor} border`}>
      <div className="flex flex-col md:flex-row gap-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={character.image}
          alt={character.name}
          className="h-32 w-32 md:h-40 md:w-40 rounded-xl object-cover shadow-lg shadow-blue-500/20 border border-slate-600"
        />

        <div className="flex-1">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-100">{character.name}</h2>
              <p className="text-sm text-gray-300 mt-1">
                {statusIcon} {statusLabel} · {character.species}
                {character.type ? ` · ${character.type}` : ''}
              </p>
            </div>
            <span className="text-xs rounded-full border border-blue-400/50 bg-blue-500/10 px-3 py-1 text-blue-300 font-medium">
              ID: {character.id}
            </span>
          </div>

          <div className="space-y-3 text-sm">
            <div className="bg-slate-700/30 rounded-lg p-3 border border-slate-600/50">
              <p className="text-gray-300">
                <span className="font-semibold text-blue-300">👽 Especie:</span> {character.species}
              </p>
              <p className="text-gray-300 mt-1">
                <span className="font-semibold text-blue-300">⚧️ Género:</span> {character.gender}
              </p>
            </div>

            <div className="bg-slate-700/30 rounded-lg p-3 border border-slate-600/50">
              <p className="text-gray-300">
                <span className="font-semibold text-blue-300">🌌 Origen:</span> {character.origin.name}
              </p>

              {character.origin.location ? (
                <p className="text-gray-300 mt-1">
                  <span className="font-semibold text-blue-300">📍 Ubicación:</span>{' '}
                  {character.origin.location.name}
                </p>
              ) : (
                <p className="text-gray-400 mt-1">
                  <span className="font-semibold text-blue-300">📍 Ubicación:</span> No disponible
                </p>
              )}

              {character.origin.location?.dimension && (
                <p className="text-gray-300 mt-1">
                  <span className="font-semibold text-blue-300">🔀 Dimensión:</span> {character.origin.location.dimension}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
