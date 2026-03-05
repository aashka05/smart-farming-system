import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiPlay, HiEye, HiCalendar, HiX, HiRefresh } from 'react-icons/hi';
import api from '../services/api';

/* ── Format helpers ───────────────────────────────────────── */
function formatViews(n) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}
function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

/* ── Video Card ───────────────────────────────────────────── */
function VideoCard({ video, index, onPlay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="glass-card-hover overflow-hidden group cursor-pointer"
      onClick={() => onPlay(video)}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-gray-200 dark:bg-dark-border overflow-hidden">
        <img
          src={video.thumbnail}
          alt={video.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* Play overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-red-600/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300 shadow-lg">
            <HiPlay className="w-7 h-7 text-white ml-1" />
          </div>
        </div>
        {/* Views badge */}
        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1">
          <HiEye className="w-3 h-3" />
          {formatViews(video.views)}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-display font-semibold text-gray-800 dark:text-white line-clamp-2 text-sm leading-snug min-h-[2.5rem]">
          {video.title}
        </h3>
        {video.description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">
            {video.description}
          </p>
        )}
        <div className="flex items-center gap-2 mt-3 text-xs text-gray-400">
          <HiCalendar className="w-3.5 h-3.5" />
          {formatDate(video.published)}
        </div>
      </div>
    </motion.div>
  );
}

/* ── Video Player Modal ───────────────────────────────────── */
function VideoModal({ video, onClose }) {
  if (!video) return null;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', duration: 0.4 }}
          className="w-full max-w-4xl bg-white dark:bg-dark-card rounded-2xl overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 dark:border-dark-border">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-white truncate pr-4">
              {video.title}
            </h3>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-border transition-colors shrink-0"
            >
              <HiX className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          {/* Player */}
          <div className="aspect-video">
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1&rel=0`}
              title={video.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          {/* Info */}
          <div className="px-5 py-3 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-dark-border">
            <span className="flex items-center gap-1"><HiEye className="w-3.5 h-3.5" /> {formatViews(video.views)} views</span>
            <span className="flex items-center gap-1"><HiCalendar className="w-3.5 h-3.5" /> {formatDate(video.published)}</span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ── Main Tutorials Page ──────────────────────────────────── */
export default function Tutorials() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [playing, setPlaying] = useState(null);

  const fetchVideos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get('/tutorials/playlist');
      setVideos(data.videos || []);
    } catch (err) {
      console.error('Failed to load tutorials:', err);
      setError('Unable to load videos. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (playing) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [playing]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50/30 to-white dark:from-dark-bg dark:to-dark-card">
      <div className="section-container">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="section-title">🎓 Farming Tutorials</h1>
          <p className="section-subtitle">
            Learn modern farming techniques through expert video tutorials from Bansi Gir Gaushala
          </p>
        </motion.div>

        {/* Featured Playlist Player */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-10 max-w-4xl mx-auto"
        >
          <div className="glass-card overflow-hidden rounded-2xl">
            <div className="aspect-video">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/videoseries?list=UU9OoW-ceIDeJLBVX37gBCww"
                title="FarmLytics Tutorials Playlist"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
          <p className="text-xs text-gray-400 text-center mt-3">
            ▶ Full playlist — use controls above to browse all videos
          </p>
        </motion.div>

        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-between mb-6"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            📹 Latest Videos
            {!loading && <span className="text-sm font-normal text-gray-400">({videos.length})</span>}
          </h2>
          <button
            onClick={fetchVideos}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-dark-border text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-border transition-colors disabled:opacity-50"
          >
            <HiRefresh className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-primary-400 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-gray-500 dark:text-gray-400">Loading videos from YouTube...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-16">
            <span className="text-5xl mb-4 block">⚠️</span>
            <p className="text-gray-500 dark:text-gray-400 mb-4">{error}</p>
            <button
              onClick={fetchVideos}
              className="px-5 py-2 bg-primary-500 text-white rounded-xl text-sm font-medium hover:bg-primary-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Video Grid */}
        {!loading && !error && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video, i) => (
              <VideoCard
                key={video.videoId}
                video={video}
                index={i}
                onPlay={setPlaying}
              />
            ))}
          </div>
        )}

        {!loading && !error && videos.length === 0 && (
          <div className="text-center py-16">
            <span className="text-5xl mb-4 block">📹</span>
            <p className="text-gray-500 dark:text-gray-400">No videos available at the moment.</p>
          </div>
        )}
      </div>

      {/* Video Player Modal */}
      {playing && <VideoModal video={playing} onClose={() => setPlaying(null)} />}
    </div>
  );
}
