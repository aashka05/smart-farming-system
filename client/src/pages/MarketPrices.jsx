import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { HiSearch, HiFilter, HiTrendingUp, HiTrendingDown } from 'react-icons/hi';
import { useTranslation } from '../utils/useTranslation';

const API_URL = 'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=579b464db66ec23bdd0000010aa6c3f3acb747e15ce120e5c74de5ce&format=json&limit=15';

export default function MarketPrices() {
  const [marketData, setMarketData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stateFilter, setStateFilter] = useState('');
  const [districtFilter, setDistrictFilter] = useState('');
  const [cropFilter, setCropFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const mStrings = useMemo(() => ({
    title: 'Market Prices', subtitle: 'Real-time crop prices from mandis across India',
    filters: 'Filters', clearAll: 'Clear All', searchPlaceholder: 'Search...',
    allStates: 'All States', allDistricts: 'All Districts', allCrops: 'All Crops',
    showing: 'Showing', results: 'results',
    crop: 'Crop', market: 'Market', state: 'State',
    minPrice: 'Min Price', maxPrice: 'Max Price', modalPrice: 'Modal Price',
    noResults: 'No matching results. Try different filters.',
    disclaimer: 'Live prices sourced from government mandis via data.gov.in.',
    loadingMsg: 'Loading market prices...',
    errorMsg: 'Unable to load market prices.',
    retry: 'Retry',
  }), []);
  const { t: mt } = useTranslation(mStrings);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error('Failed to fetch market data');
        const json = await res.json();
        const records = (json.records || []).map((r) => ({
          crop: r.commodity || '',
          market: r.market || '',
          state: r.state || '',
          district: r.district || '',
          minPrice: Number(r.min_price) || 0,
          maxPrice: Number(r.max_price) || 0,
          modalPrice: Number(r.modal_price) || 0,
        }));
        setMarketData(records);
      } catch (err) {
        console.error('Market data fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMarketData();
  }, []);

  const states = useMemo(() => [...new Set(marketData.map((d) => d.state))].sort(), [marketData]);
  const allCrops = useMemo(() => [...new Set(marketData.map((d) => d.crop))].sort(), [marketData]);
  const districts = useMemo(() => {
    if (!stateFilter) return [...new Set(marketData.map((d) => d.district))].sort();
    return [...new Set(marketData.filter((d) => d.state === stateFilter).map((d) => d.district))].sort();
  }, [stateFilter, marketData]);

  const filteredData = useMemo(() => {
    return marketData.filter((d) => {
      if (stateFilter && d.state !== stateFilter) return false;
      if (districtFilter && d.district !== districtFilter) return false;
      if (cropFilter && d.crop !== cropFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return d.crop.toLowerCase().includes(q) || d.market.toLowerCase().includes(q) || d.state.toLowerCase().includes(q);
      }
      return true;
    });
  }, [stateFilter, districtFilter, cropFilter, searchQuery, marketData]);

  const clearFilters = () => {
    setStateFilter('');
    setDistrictFilter('');
    setCropFilter('');
    setSearchQuery('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-yellow-50/30 to-white dark:from-dark-bg dark:to-dark-card flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">{mt.loadingMsg}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-yellow-50/30 to-white dark:from-dark-bg dark:to-dark-card flex items-center justify-center">
        <div className="text-center glass-card p-8 max-w-md">
          <span className="text-5xl block mb-4">⚠️</span>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{mt.errorMsg}</p>
          <button onClick={() => window.location.reload()} className="btn-primary">{mt.retry}</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50/30 to-white dark:from-dark-bg dark:to-dark-card">
      <div className="section-container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="section-title">📊 {mt.title}</h1>
          <p className="section-subtitle">{mt.subtitle}</p>
        </motion.div>

        {/* Filters */}
        <div className="glass-card p-5 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <HiFilter className="w-5 h-5 text-primary-500" />
            <h3 className="font-semibold text-gray-800 dark:text-white">{mt.filters}</h3>
            {(stateFilter || districtFilter || cropFilter || searchQuery) && (
              <button onClick={clearFilters} className="ml-auto text-sm text-primary-600 hover:underline">{mt.clearAll}</button>
            )}
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder={mt.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-10 py-2.5 text-sm"
              />
            </div>
            <select value={stateFilter} onChange={(e) => { setStateFilter(e.target.value); setDistrictFilter(''); }} className="input-field py-2.5 text-sm">
              <option value="">{mt.allStates}</option>
              {states.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={districtFilter} onChange={(e) => setDistrictFilter(e.target.value)} className="input-field py-2.5 text-sm">
              <option value="">{mt.allDistricts}</option>
              {districts.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
            <select value={cropFilter} onChange={(e) => setCropFilter(e.target.value)} className="input-field py-2.5 text-sm">
              <option value="">{mt.allCrops}</option>
              {allCrops.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Results Count */}
        <p className="text-sm text-gray-500 mb-4">{mt.showing} {filteredData.length} {mt.results}</p>

        {/* Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-primary-50 dark:bg-primary-900/20">
                    <th className="text-left py-4 px-5 font-semibold text-gray-700 dark:text-gray-300">{mt.crop}</th>
                    <th className="text-left py-4 px-5 font-semibold text-gray-700 dark:text-gray-300">{mt.market}</th>
                    <th className="text-left py-4 px-5 font-semibold text-gray-700 dark:text-gray-300">{mt.state}</th>
                    <th className="text-right py-4 px-5 font-semibold text-gray-700 dark:text-gray-300">{mt.minPrice}</th>
                    <th className="text-right py-4 px-5 font-semibold text-gray-700 dark:text-gray-300">{mt.maxPrice}</th>
                    <th className="text-right py-4 px-5 font-semibold text-gray-700 dark:text-gray-300">{mt.modalPrice}</th>
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
                <p className="text-gray-500">{mt.noResults}</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Disclaimer */}
        
      </div>
    </div>
  );
}
