import { useState } from 'react';
import { motion } from 'framer-motion';
import TutorialCard from '../components/TutorialCard';

const categories = ['All', 'Organic Farming', 'Drip Irrigation', 'Pest Control', 'Seasonal Crop Planning', 'Soil Health'];

const tutorials = [
  { id: '1', title: 'Introduction to Organic Farming', category: 'Organic Farming', duration: '12:34', description: 'Learn the basics of organic farming and sustainable agricultural practices for healthier crops.' },
  { id: '2', title: 'Setting Up Drip Irrigation System', category: 'Drip Irrigation', duration: '18:22', description: 'Step-by-step guide to installing a cost-effective drip irrigation system on your farm.' },
  { id: '3', title: 'Natural Pest Control Methods', category: 'Pest Control', duration: '15:45', description: 'Effective organic and natural pest control techniques for common crop pests.' },
  { id: '4', title: 'Seasonal Crop Planning Guide', category: 'Seasonal Crop Planning', duration: '20:10', description: 'Plan your crops according to seasons for maximum yield and profit throughout the year.' },
  { id: '5', title: 'Soil Health Management', category: 'Soil Health', duration: '14:55', description: 'Understanding soil health indicators and how to improve soil fertility naturally.' },
  { id: '6', title: 'Advanced Composting Techniques', category: 'Organic Farming', duration: '16:30', description: 'Learn how to make high-quality compost and vermicompost for your organic farm.' },
  { id: '7', title: 'Water-Efficient Farming Practices', category: 'Drip Irrigation', duration: '11:40', description: 'Techniques to reduce water usage by 40% while maintaining crop productivity.' },
  { id: '8', title: 'Integrated Pest Management (IPM)', category: 'Pest Control', duration: '22:15', description: 'Comprehensive IPM approach combining biological, cultural, and chemical strategies.' },
  { id: '9', title: 'Kharif Season Crop Selection', category: 'Seasonal Crop Planning', duration: '13:20', description: 'Best crops to grow during the kharif season with soil and water requirements.' },
  { id: '10', title: 'Soil Testing at Home', category: 'Soil Health', duration: '9:50', description: 'Simple methods to test your soil quality at home without expensive lab equipment.' },
  { id: '11', title: 'Zero Budget Natural Farming', category: 'Organic Farming', duration: '25:00', description: 'Complete guide to ZBNF — reducing input costs while maintaining crop quality.' },
  { id: '12', title: 'Micro-Sprinkler vs Drip: Which to Choose?', category: 'Drip Irrigation', duration: '14:10', description: 'Comparing micro-sprinkler and drip systems for different crop types and soil conditions.' },
];

export default function Tutorials() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = activeCategory === 'All'
    ? tutorials
    : tutorials.filter((t) => t.category === activeCategory);

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50/30 to-white dark:from-dark-bg dark:to-dark-card">
      <div className="section-container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="section-title">🎓 Farming Tutorials</h1>
          <p className="section-subtitle">
            Learn modern farming techniques through expert video tutorials
          </p>
        </motion.div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                activeCategory === cat
                  ? 'bg-primary-500 text-white shadow-md shadow-primary-500/30'
                  : 'bg-white dark:bg-dark-card text-gray-600 dark:text-gray-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 border border-gray-200 dark:border-dark-border'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Tutorial Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((tutorial, i) => (
            <motion.div
              key={tutorial.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <TutorialCard tutorial={tutorial} />
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <span className="text-5xl mb-4 block">📹</span>
            <p className="text-gray-500 dark:text-gray-400">No tutorials in this category yet.</p>
          </div>
        )}

        {/* Note */}
        <p className="text-xs text-gray-400 text-center mt-8">
          ℹ️ Tutorial videos will be integrated with YouTube Data API for real video content.
        </p>
      </div>
    </div>
  );
}
