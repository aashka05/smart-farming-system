import { motion } from 'framer-motion';

export default function StatCard({ icon, title, value, subtitle, color = 'green', delay = 0 }) {
  const colorMap = {
    green: 'from-primary-500 to-primary-600',
    blue: 'from-blue-500 to-blue-600',
    orange: 'from-orange-500 to-orange-600',
    red: 'from-red-500 to-red-600',
    purple: 'from-purple-500 to-purple-600',
    cyan: 'from-cyan-500 to-cyan-600',
  };

  const bgMap = {
    green: 'bg-primary-50 dark:bg-primary-900/20',
    blue: 'bg-blue-50 dark:bg-blue-900/20',
    orange: 'bg-orange-50 dark:bg-orange-900/20',
    red: 'bg-red-50 dark:bg-red-900/20',
    purple: 'bg-purple-50 dark:bg-purple-900/20',
    cyan: 'bg-cyan-50 dark:bg-cyan-900/20',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      className="glass-card p-5 relative overflow-hidden group hover:shadow-xl transition-shadow duration-300"
    >
      <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${colorMap[color]} opacity-5 rounded-bl-full group-hover:opacity-10 transition-opacity`} />

      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl ${bgMap[color]} flex items-center justify-center`}>
          <span className="text-xl">{icon}</span>
        </div>
      </div>
    </motion.div>
  );
}
