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
    character.status === 'unknown' ? 'Unknown' : character.status;

  return (
    <div className="w-full rounded-lg border p-4">
      <div className="flex gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={character.image}
          alt={character.name}
          className="h-24 w-24 rounded object-cover"
        />

        <div className="flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">{character.name}</h2>
              <p className="text-sm text-gray-600">
                {statusLabel} · {character.species}
                {character.type ? ` · ${character.type}` : ''}
              </p>
            </div>
            <span className="text-xs rounded-full border px-2 py-1">
              #{character.id}
            </span>
          </div>

          <div className="mt-3 text-sm">
            <p>
              <span className="font-medium">Origen:</span> {character.origin.name}
            </p>

            {character.origin.location ? (
              <p className="text-gray-700">
                <span className="font-medium">Location:</span>{' '}
                {character.origin.location.name} · {character.origin.location.type}{' '}
                · {character.origin.location.dimension}
              </p>
            ) : (
              <p className="text-gray-500">
                <span className="font-medium">Location:</span> no disponible
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
