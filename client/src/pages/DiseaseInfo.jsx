import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiSearch, HiChevronDown, HiChevronUp, HiShieldCheck, HiBeaker, HiEye, HiLightBulb } from 'react-icons/hi';
import CropCard from '../components/CropCard';
import diseasesData from '../data/diseases.json';

const crops = [
  { name: 'Rice', image: '🌾', season: 'Kharif' },
  { name: 'Wheat', image: '🌿', season: 'Rabi' },
  { name: 'Cotton', image: '☁️', season: 'Kharif' },
  { name: 'Maize', image: '🌽', season: 'Kharif' },
  { name: 'Sugarcane', image: '🎋', season: 'Kharif' },
];

const AccordionItem = ({ title, icon, children, color }) => {
  const [open, setOpen] = useState(false);
  const colorClasses = {
    red: 'border-red-200 dark:border-red-800',
    yellow: 'border-yellow-200 dark:border-yellow-800',
    blue: 'border-blue-200 dark:border-blue-800',
    green: 'border-green-200 dark:border-green-800',
    purple: 'border-purple-200 dark:border-purple-800',
  };
  const iconBg = {
    red: 'bg-red-50 dark:bg-red-900/20 text-red-500',
    yellow: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600',
    blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-500',
    green: 'bg-green-50 dark:bg-green-900/20 text-green-500',
    purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-500',
  };

  return (
    <div className={`border-l-4 ${colorClasses[color]} rounded-r-xl overflow-hidden`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 bg-white/50 dark:bg-dark-card/50 hover:bg-gray-50 dark:hover:bg-dark-card transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg ${iconBg[color]} flex items-center justify-center`}>
            {icon}
          </div>
          <span className="font-semibold text-gray-800 dark:text-white text-sm">{title}</span>
        </div>
        {open ? <HiChevronUp className="w-5 h-5 text-gray-400" /> : <HiChevronDown className="w-5 h-5 text-gray-400" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function DiseaseInfo() {
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCrops = crops.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const diseases = selectedCrop ? diseasesData[selectedCrop.name]?.diseases || [] : [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50/50 to-white dark:from-dark-bg dark:to-dark-card">
      <div className="section-container">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="section-title">🔬 Plant Disease Information</h1>
          <p className="section-subtitle">
            Select a crop to view common diseases, symptoms, remedies, and prevention tips
          </p>
        </motion.div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search crops..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-12"
            />
          </div>
        </div>

        {/* Crop Selection */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-10">
          {filteredCrops.map((crop) => (
            <CropCard
              key={crop.name}
              crop={crop}
              onClick={() => setSelectedCrop(crop)}
              isSelected={selectedCrop?.name === crop.name}
            />
          ))}
        </div>

        {/* Disease Information */}
        {selectedCrop ? (
          <motion.div
            key={selectedCrop.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <div className="glass-card p-6 mb-6">
              <div className="flex items-center gap-4 mb-2">
                <span className="text-4xl">{selectedCrop.image}</span>
                <div>
                  <h2 className="text-2xl font-display font-bold text-gray-800 dark:text-white">{selectedCrop.name}</h2>
                  <span className="badge-green text-xs">{selectedCrop.season} Season</span>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
                {diseases.length} known disease{diseases.length !== 1 ? 's' : ''} documented below
              </p>
            </div>

            {diseases.length > 0 ? (
              <div className="space-y-6">
                {diseases.map((disease, idx) => (
                  <div key={disease.name} className="glass-card p-6">
                    <h3 className="font-display font-bold text-lg mb-4 text-gray-800 dark:text-white flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center text-sm font-bold text-red-600">
                        {idx + 1}
                      </span>
                      {disease.name}
                    </h3>

                    <div className="space-y-3">
                      <AccordionItem title="Symptoms" icon={<HiEye className="w-4 h-4" />} color="red">
                        <ul className="space-y-2">
                          {disease.symptoms.map((s, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                              <span className="text-red-400 mt-0.5">•</span> {s}
                            </li>
                          ))}
                        </ul>
                      </AccordionItem>

                      <AccordionItem title="Causes" icon={<HiBeaker className="w-4 h-4" />} color="yellow">
                        <ul className="space-y-2">
                          {disease.causes.map((c, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                              <span className="text-yellow-500 mt-0.5">•</span> {c}
                            </li>
                          ))}
                        </ul>
                      </AccordionItem>

                      <AccordionItem title="Remedies" icon={<HiLightBulb className="w-4 h-4" />} color="blue">
                        <ul className="space-y-2">
                          {disease.remedies.map((r, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                              <span className="text-blue-500 mt-0.5">✓</span> {r}
                            </li>
                          ))}
                        </ul>
                      </AccordionItem>

                      <AccordionItem title="Prevention" icon={<HiShieldCheck className="w-4 h-4" />} color="green">
                        <ul className="space-y-2">
                          {disease.prevention.map((p, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                              <span className="text-green-500 mt-0.5">🛡️</span> {p}
                            </li>
                          ))}
                        </ul>
                      </AccordionItem>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="glass-card p-8 text-center">
                <p className="text-gray-500">No disease data available for {selectedCrop.name} yet.</p>
              </div>
            )}
          </motion.div>
        ) : (
          <div className="text-center py-16">
            <span className="text-6xl mb-4 block">🌿</span>
            <h3 className="text-xl font-display font-semibold text-gray-600 dark:text-gray-400">
              Select a crop above to view disease information
            </h3>
          </div>
        )}
      </div>
    </div>
  );
}
