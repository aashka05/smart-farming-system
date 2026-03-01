import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { HiSearch, HiFilter, HiTrendingUp, HiTrendingDown } from 'react-icons/hi';

const mockData = [
  { crop: 'Rice', market: 'Ahmedabad APMC', state: 'Gujarat', district: 'Ahmedabad', minPrice: 1800, maxPrice: 2200, modalPrice: 2000 },
  { crop: 'Wheat', market: 'Rajkot APMC', state: 'Gujarat', district: 'Rajkot', minPrice: 2100, maxPrice: 2500, modalPrice: 2300 },
  { crop: 'Cotton', market: 'Surat APMC', state: 'Gujarat', district: 'Surat', minPrice: 5500, maxPrice: 6200, modalPrice: 5800 },
  { crop: 'Maize', market: 'Indore Mandi', state: 'Madhya Pradesh', district: 'Indore', minPrice: 1400, maxPrice: 1800, modalPrice: 1600 },
  { crop: 'Sugarcane', market: 'Pune APMC', state: 'Maharashtra', district: 'Pune', minPrice: 280, maxPrice: 350, modalPrice: 310 },
  { crop: 'Soybean', market: 'Nagpur APMC', state: 'Maharashtra', district: 'Nagpur', minPrice: 4200, maxPrice: 4800, modalPrice: 4500 },
  { crop: 'Groundnut', market: 'Junagadh APMC', state: 'Gujarat', district: 'Junagadh', minPrice: 4800, maxPrice: 5500, modalPrice: 5200 },
  { crop: 'Bajra', market: 'Jodhpur Mandi', state: 'Rajasthan', district: 'Jodhpur', minPrice: 2000, maxPrice: 2400, modalPrice: 2200 },
  { crop: 'Rice', market: 'Lucknow Mandi', state: 'Uttar Pradesh', district: 'Lucknow', minPrice: 1900, maxPrice: 2300, modalPrice: 2100 },
  { crop: 'Wheat', market: 'Bhopal Mandi', state: 'Madhya Pradesh', district: 'Bhopal', minPrice: 2050, maxPrice: 2450, modalPrice: 2250 },
  { crop: 'Tomato', market: 'Nashik APMC', state: 'Maharashtra', district: 'Nashik', minPrice: 800, maxPrice: 1500, modalPrice: 1100 },
  { crop: 'Onion', market: 'Lasalgaon APMC', state: 'Maharashtra', district: 'Nashik', minPrice: 1200, maxPrice: 2000, modalPrice: 1600 },
  { crop: 'Potato', market: 'Agra Mandi', state: 'Uttar Pradesh', district: 'Agra', minPrice: 600, maxPrice: 1000, modalPrice: 800 },
  { crop: 'Cotton', market: 'Guntur APMC', state: 'Andhra Pradesh', district: 'Guntur', minPrice: 5600, maxPrice: 6400, modalPrice: 6000 },
  { crop: 'Mustard', market: 'Jaipur Mandi', state: 'Rajasthan', district: 'Jaipur', minPrice: 4800, maxPrice: 5400, modalPrice: 5100 },
];

export default function MarketPrices() {
  const [stateFilter, setStateFilter] = useState('');
  const [districtFilter, setDistrictFilter] = useState('');
  const [cropFilter, setCropFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const states = useMemo(() => [...new Set(mockData.map((d) => d.state))].sort(), []);
  const allCrops = useMemo(() => [...new Set(mockData.map((d) => d.crop))].sort(), []);
  const districts = useMemo(() => {
    if (!stateFilter) return [...new Set(mockData.map((d) => d.district))].sort();
    return [...new Set(mockData.filter((d) => d.state === stateFilter).map((d) => d.district))].sort();
  }, [stateFilter]);

  const filteredData = useMemo(() => {
    return mockData.filter((d) => {
      if (stateFilter && d.state !== stateFilter) return false;
      if (districtFilter && d.district !== districtFilter) return false;
      if (cropFilter && d.crop !== cropFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return d.crop.toLowerCase().includes(q) || d.market.toLowerCase().includes(q) || d.state.toLowerCase().includes(q);
      }
      return true;
    });
  }, [stateFilter, districtFilter, cropFilter, searchQuery]);

  const clearFilters = () => {
    setStateFilter('');
    setDistrictFilter('');
    setCropFilter('');
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50/30 to-white dark:from-dark-bg dark:to-dark-card">
      <div className="section-container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="section-title">📊 Market Prices</h1>
          <p className="section-subtitle">Real-time crop prices from mandis across India</p>
        </motion.div>

        {/* Filters */}
        <div className="glass-card p-5 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <HiFilter className="w-5 h-5 text-primary-500" />
            <h3 className="font-semibold text-gray-800 dark:text-white">Filters</h3>
            {(stateFilter || districtFilter || cropFilter || searchQuery) && (
              <button onClick={clearFilters} className="ml-auto text-sm text-primary-600 hover:underline">Clear All</button>
            )}
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-10 py-2.5 text-sm"
              />
            </div>
            <select value={stateFilter} onChange={(e) => { setStateFilter(e.target.value); setDistrictFilter(''); }} className="input-field py-2.5 text-sm">
              <option value="">All States</option>
              {states.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={districtFilter} onChange={(e) => setDistrictFilter(e.target.value)} className="input-field py-2.5 text-sm">
              <option value="">All Districts</option>
              {districts.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
            <select value={cropFilter} onChange={(e) => setCropFilter(e.target.value)} className="input-field py-2.5 text-sm">
              <option value="">All Crops</option>
              {allCrops.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Results Count */}
        <p className="text-sm text-gray-500 mb-4">Showing {filteredData.length} results</p>

        {/* Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-primary-50 dark:bg-primary-900/20">
                    <th className="text-left py-4 px-5 font-semibold text-gray-700 dark:text-gray-300">Crop</th>
                    <th className="text-left py-4 px-5 font-semibold text-gray-700 dark:text-gray-300">Market</th>
                    <th className="text-left py-4 px-5 font-semibold text-gray-700 dark:text-gray-300">State</th>
                    <th className="text-right py-4 px-5 font-semibold text-gray-700 dark:text-gray-300">Min Price</th>
                    <th className="text-right py-4 px-5 font-semibold text-gray-700 dark:text-gray-300">Max Price</th>
                    <th className="text-right py-4 px-5 font-semibold text-gray-700 dark:text-gray-300">Modal Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-dark-border">
                  {filteredData.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-dark-card/50 transition-colors">
                      <td className="py-3.5 px-5 font-medium text-gray-800 dark:text-white">{item.crop}</td>
                      <td className="py-3.5 px-5 text-gray-600 dark:text-gray-400">{item.market}</td>
                      <td className="py-3.5 px-5 text-gray-600 dark:text-gray-400">{item.state}</td>
                      <td className="py-3.5 px-5 text-right text-gray-600 dark:text-gray-400">₹{item.minPrice.toLocaleString()}</td>
                      <td className="py-3.5 px-5 text-right text-gray-600 dark:text-gray-400">₹{item.maxPrice.toLocaleString()}</td>
                      <td className="py-3.5 px-5 text-right">
                        <span className="font-semibold text-primary-600 dark:text-primary-400">₹{item.modalPrice.toLocaleString()}</span>
                        <span className="text-xs text-gray-400 ml-1">/q</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredData.length === 0 && (
              <div className="text-center py-12">
                <span className="text-4xl mb-3 block">🔍</span>
                <p className="text-gray-500">No matching results. Try different filters.</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Disclaimer */}
        <p className="text-xs text-gray-400 mt-4 text-center">
          ℹ️ Prices shown are mock data for demonstration. Will be replaced with live API data from government portals.
        </p>
      </div>
    </div>
  );
}
