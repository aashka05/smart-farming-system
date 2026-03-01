export default function CropCard({ crop, onClick, isSelected }) {
  return (
    <button
      onClick={() => onClick?.(crop)}
      className={`glass-card-hover p-5 text-center transition-all duration-300 w-full ${
        isSelected
          ? 'ring-2 ring-primary-500 bg-primary-50/50 dark:bg-primary-900/20'
          : ''
      }`}
    >
      <div className="text-4xl mb-3">{crop.image || '🌱'}</div>
      <h3 className="font-display font-semibold text-gray-800 dark:text-white">
        {crop.name}
      </h3>
      {crop.season && (
        <span className="inline-block mt-2 text-xs px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-medium">
          {crop.season}
        </span>
      )}
    </button>
  );
}
