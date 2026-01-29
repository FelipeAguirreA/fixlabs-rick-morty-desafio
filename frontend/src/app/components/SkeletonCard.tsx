export default function SkeletonCard() {
  return (
    <div className="w-full rounded-lg border p-4 animate-pulse">
      <div className="flex gap-4">
        <div className="h-24 w-24 rounded bg-gray-200" />
        <div className="flex-1 space-y-3">
          <div className="h-4 w-2/3 rounded bg-gray-200" />
          <div className="h-4 w-1/3 rounded bg-gray-200" />
          <div className="h-4 w-1/2 rounded bg-gray-200" />
        </div>
      </div>
    </div>
  );
}
