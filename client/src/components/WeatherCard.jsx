import { WiDaySunny, WiCloudy, WiRain, WiStrongWind, WiHumidity, WiThunderstorm, WiFog } from 'react-icons/wi';

const conditionIcons = {
  sunny: <WiDaySunny className="w-16 h-16 text-yellow-400" />,
  cloudy: <WiCloudy className="w-16 h-16 text-gray-400" />,
  rainy: <WiRain className="w-16 h-16 text-blue-400" />,
  stormy: <WiThunderstorm className="w-16 h-16 text-purple-500" />,
  foggy: <WiFog className="w-16 h-16 text-gray-300" />,
  'partly-cloudy': <WiCloudy className="w-16 h-16 text-gray-300" />,
  windy: <WiStrongWind className="w-16 h-16 text-teal-400" />,
};

export default function WeatherCard({ data }) {
  const icon = conditionIcons[data?.condition] || conditionIcons.sunny;

  return (
    <div className="glass-card p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary-200/30 to-transparent rounded-bl-full" />

      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-white">{data?.city || 'City'}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{data?.condition?.replace('-', ' ') || 'Clear'}</p>
        </div>
        {icon}
      </div>

      <div className="text-5xl font-bold gradient-text mb-4">
        {data?.temperature?.current || 32}°
        <span className="text-lg text-gray-400 font-normal ml-1">C</span>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3">
          <WiHumidity className="w-6 h-6 text-blue-500 mx-auto" />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Humidity</p>
          <p className="font-semibold text-gray-800 dark:text-white">{data?.humidity || 65}%</p>
        </div>
        <div className="bg-cyan-50 dark:bg-cyan-900/20 rounded-xl p-3">
          <WiRain className="w-6 h-6 text-cyan-500 mx-auto" />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Rain</p>
          <p className="font-semibold text-gray-800 dark:text-white">{data?.rainProbability || 40}%</p>
        </div>
        <div className="bg-teal-50 dark:bg-teal-900/20 rounded-xl p-3">
          <WiStrongWind className="w-6 h-6 text-teal-500 mx-auto" />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Wind</p>
          <p className="font-semibold text-gray-800 dark:text-white">{data?.windSpeed || 12} km/h</p>
        </div>
      </div>
    </div>
  );
}
