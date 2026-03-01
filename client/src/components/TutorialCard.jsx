import { HiPlay } from 'react-icons/hi';

export default function TutorialCard({ tutorial }) {
  return (
    <div className="glass-card-hover overflow-hidden group">
      {/* Thumbnail */}
      <div className="relative h-48 bg-gradient-to-br from-primary-200 to-earth-200 dark:from-primary-900 dark:to-earth-900 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-6xl opacity-30">🎬</span>
        </div>
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300 shadow-lg">
            <HiPlay className="w-7 h-7 text-primary-600 ml-1" />
          </div>
        </div>
        {/* Duration Badge */}
        {tutorial.duration && (
          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-md">
            {tutorial.duration}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <span className="badge-green text-xs mb-2">{tutorial.category}</span>
        <h3 className="font-display font-semibold text-gray-800 dark:text-white mt-2 line-clamp-2">
          {tutorial.title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">
          {tutorial.description}
        </p>
        <button className="mt-4 w-full py-2.5 rounded-xl bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-semibold text-sm hover:bg-primary-100 dark:hover:bg-primary-900/40 transition-colors flex items-center justify-center gap-2">
          <HiPlay className="w-4 h-4" />
          Watch Tutorial
        </button>
      </div>
    </div>
  );
}
