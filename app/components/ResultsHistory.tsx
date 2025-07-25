import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Trash2, TrendingUp, Calendar, Type, BarChart3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export interface TestResult {
  id: string;
  wpm: number;
  accuracy: number;
  time: number;
  textType: string;
  date: string;
  errors: number;
}

interface ProgressChartProps {
  results: TestResult[];
}

function ProgressChart({ results }: ProgressChartProps) {
  const { t } = useLanguage();
  
  // Get last 20 results for better trend visualization
  const chartData = results.slice(-20).map((result, index) => {
    const date = new Date(result.date);
    return {
      test: index + 1,
      wpm: result.wpm,
      accuracy: Math.round(result.accuracy * 10) / 10,
      date: date.toLocaleDateString(),
      time: `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      textType: result.textType,
      errors: result.errors,
      testTime: result.time
    };
  });

  // Calculate WPM trend (last 5 vs previous 5)
  const recentTests = chartData.slice(-5);
  const previousTests = chartData.slice(-10, -5);
  
  const recentAvgWpm = recentTests.reduce((sum, test) => sum + test.wpm, 0) / recentTests.length;
  const previousAvgWpm = previousTests.length > 0 
    ? previousTests.reduce((sum, test) => sum + test.wpm, 0) / previousTests.length 
    : recentAvgWpm;
  
  const wpmTrend = recentAvgWpm - previousAvgWpm;

  return (
    <div className="w-full">

      
      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="test" 
              tick={{ fontSize: 12 }}
              className="fill-gray-600 dark:fill-gray-400"
              label={{ value: 'Test Number', position: 'insideBottom', offset: -10, style: { textAnchor: 'middle', fontSize: '12px' } }}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              className="fill-blue-600 dark:fill-blue-400"
              label={{ value: 'Words Per Minute', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
              domain={['dataMin - 5', 'dataMax + 10']}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'var(--tooltip-bg, #ffffff)',
                border: '1px solid var(--tooltip-border, #e5e7eb)',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                fontSize: '13px'
              }}
              labelStyle={{ color: 'var(--tooltip-text, #374151)', fontWeight: 'bold' }}
              formatter={(value, name) => [`${value} WPM`, 'Typing Speed']}
              labelFormatter={(label, payload) => {
                if (payload && payload[0]) {
                  const data = payload[0].payload;
                  return `Test #${label} - ${data.time}`;
                }
                return `Test #${label}`;
              }}
            />
            <Line 
              type="monotone" 
              dataKey="wpm" 
              stroke="#3b82f6" 
              strokeWidth={4}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8, stroke: '#3b82f6', strokeWidth: 3, fill: '#ffffff' }}
              name="WPM"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {/* WPM Progress Insights */}
      {chartData.length >= 5 && (
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">WPM Progress</h4>
          <div className="flex items-center gap-2 text-sm mb-3">
            <span className={`text-lg ${wpmTrend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {wpmTrend >= 0 ? '📈' : '📉'}
            </span>
            <span className="text-gray-700 dark:text-gray-300">
              Your typing speed has {wpmTrend >= 0 ? 'improved' : 'decreased'} by {Math.abs(wpmTrend).toFixed(1)} WPM on average
            </span>
          </div>
          
          {/* Dynamic insights */}
          <div className="text-xs text-blue-700 dark:text-blue-300">
            {(() => {
              const avgWpm = chartData.reduce((sum, d) => sum + d.wpm, 0) / chartData.length;
              const latestWpm = chartData[chartData.length - 1]?.wpm || 0;
              
              if (latestWpm >= 70) {
                return "🏆 Outstanding! You're typing at an expert level.";
              } else if (latestWpm >= 50) {
                return "👍 Great speed! You're above average for most typists.";
              } else if (latestWpm >= 30) {
                return "📈 Good progress! Keep practicing to reach higher speeds.";
              } else {
                return "💪 Focus on consistent practice to build your typing speed.";
              }
            })()} 
          </div>
        </div>
      )}
    </div>
  );
}

interface ResultsHistoryProps {
  results: TestResult[];
  onClearResults: () => void;
}

export function ResultsHistory({ results, onClearResults }: ResultsHistoryProps) {
  const [sortBy, setSortBy] = useState<'date' | 'wpm' | 'accuracy'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const { t, language } = useLanguage();

  const sortedResults = [...results].sort((a, b) => {
    let aValue: number | string;
    let bValue: number | string;

    switch (sortBy) {
      case 'date':
        aValue = new Date(a.date).getTime();
        bValue = new Date(b.date).getTime();
        break;
      case 'wpm':
        aValue = a.wpm;
        bValue = b.wpm;
        break;
      case 'accuracy':
        aValue = a.accuracy;
        bValue = b.accuracy;
        break;
      default:
        aValue = new Date(a.date).getTime();
        bValue = new Date(b.date).getTime();
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const handleSort = (column: 'date' | 'wpm' | 'accuracy') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const averageWpm = results.length > 0 ? Math.round(results.reduce((sum, r) => sum + r.wpm, 0) / results.length) : 0;
  const averageAccuracy = results.length > 0 ? Math.round(results.reduce((sum, r) => sum + r.accuracy, 0) / results.length) : 0;
  const bestWpm = results.length > 0 ? Math.max(...results.map(r => r.wpm)) : 0;
  const bestAccuracy = results.length > 0 ? Math.max(...results.map(r => r.accuracy)) : 0;

  if (results.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">{t('results.noResults')}</h3>
          <p className="text-gray-500 dark:text-gray-400">{t('results.noResultsDescription')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
          <TrendingUp className="text-blue-500" size={24} />
          {t('results.title')}
        </h2>
        <button
          onClick={onClearResults}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium flex items-center gap-2"
        >
          <Trash2 size={16} />
          {t('results.clearHistory')}
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{averageWpm}</div>
          <div 
            className="text-sm text-blue-800 dark:text-blue-300"
            style={{
              fontFamily: language === 'my'
                ? '"Noto Sans Myanmar", "Padauk", "Myanmar Text", "Pyidaungsu", "Myanmar3", "Zawgyi-One", system-ui, sans-serif'
                : 'inherit'
            }}
          >{t('results.averageWpm')}</div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{averageAccuracy}%</div>
          <div 
            className="text-sm text-green-800 dark:text-green-300"
            style={{
              fontFamily: language === 'my'
                ? '"Noto Sans Myanmar", "Padauk", "Myanmar Text", "Pyidaungsu", "Myanmar3", "Zawgyi-One", system-ui, sans-serif'
                : 'inherit'
            }}
          >{t('results.averageAccuracy')}</div>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{bestWpm}</div>
          <div 
            className="text-sm text-purple-800 dark:text-purple-300"
            style={{
              fontFamily: language === 'my'
                ? '"Noto Sans Myanmar", "Padauk", "Myanmar Text", "Pyidaungsu", "Myanmar3", "Zawgyi-One", system-ui, sans-serif'
                : 'inherit'
            }}
          >{t('results.bestWpm')}</div>
        </div>
        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{bestAccuracy}%</div>
          <div 
            className="text-sm text-orange-800 dark:text-orange-300"
            style={{
              fontFamily: language === 'my'
                ? '"Noto Sans Myanmar", "Padauk", "Myanmar Text", "Pyidaungsu", "Myanmar3", "Zawgyi-One", system-ui, sans-serif'
                : 'inherit'
            }}
          >{t('results.bestAccuracy')}</div>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center gap-1"
                  onClick={() => handleSort('date')}
                  style={{
                    fontFamily: language === 'my'
                      ? '"Noto Sans Myanmar", "Padauk", "Myanmar Text", "Pyidaungsu", "Myanmar3", "Zawgyi-One", system-ui, sans-serif'
                      : 'inherit'
                  }}
                >
                  <Calendar size={14} />
                  {t('results.date')} {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => handleSort('wpm')}
                >
                  WPM {sortBy === 'wpm' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => handleSort('accuracy')}
                  style={{
                    fontFamily: language === 'my'
                      ? '"Noto Sans Myanmar", "Padauk", "Myanmar Text", "Pyidaungsu", "Myanmar3", "Zawgyi-One", system-ui, sans-serif'
                      : 'inherit'
                  }}
                >
                  {t('results.accuracy')} {sortBy === 'accuracy' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  style={{
                    fontFamily: language === 'my'
                      ? '"Noto Sans Myanmar", "Padauk", "Myanmar Text", "Pyidaungsu", "Myanmar3", "Zawgyi-One", system-ui, sans-serif'
                      : 'inherit'
                  }}
                >
                  {t('results.time')}
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  style={{
                    fontFamily: language === 'my'
                      ? '"Noto Sans Myanmar", "Padauk", "Myanmar Text", "Pyidaungsu", "Myanmar3", "Zawgyi-One", system-ui, sans-serif'
                      : 'inherit'
                  }}
                >
                  <Type size={14} className="inline mr-1" />
                  {t('results.textType')}
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  style={{
                    fontFamily: language === 'my'
                      ? '"Noto Sans Myanmar", "Padauk", "Myanmar Text", "Pyidaungsu", "Myanmar3", "Zawgyi-One", system-ui, sans-serif'
                      : 'inherit'
                  }}
                >
                  {t('results.errors')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {sortedResults.map((result, index) => (
                <tr key={result.id} className={index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {new Date(result.date).toLocaleDateString()} {new Date(result.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-semibold ${
                      result.wpm >= 60 ? 'text-green-600 dark:text-green-400' : 
                      result.wpm >= 40 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      {result.wpm}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-semibold ${
                      result.accuracy >= 95 ? 'text-green-600 dark:text-green-400' : 
                      result.accuracy >= 85 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      {result.accuracy}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {result.time}s
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span 
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
                      style={{
                        fontFamily: language === 'my'
                          ? '"Noto Sans Myanmar", "Padauk", "Myanmar Text", "Pyidaungsu", "Myanmar3", "Zawgyi-One", system-ui, sans-serif'
                          : 'inherit'
                      }}
                    >
                      {result.textType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {result.errors}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Progress Chart */}
      <div className="mt-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-6">
          <BarChart3 className="text-blue-500" size={20} />
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{t('results.progressOverTime')}</h3>
        </div>
        
        {results.length >= 2 ? (
          <ProgressChart results={sortedResults} />
        ) : (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg mb-2">{t('results.chartVisualization')}</p>
            <p className="text-sm">Complete at least 2 tests to see your progress chart</p>
          </div>
        )}
      </div>
    </div>
  );
}