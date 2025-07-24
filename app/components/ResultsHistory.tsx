import { useState, useEffect } from 'react';

export interface TestResult {
  id: string;
  wpm: number;
  accuracy: number;
  time: number;
  textType: string;
  date: string;
  errors: number;
}

interface ResultsHistoryProps {
  results: TestResult[];
  onClearHistory: () => void;
}

export function ResultsHistory({ results, onClearHistory }: ResultsHistoryProps) {
  const [sortBy, setSortBy] = useState<'date' | 'wpm' | 'accuracy'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

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
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Results Yet</h3>
          <p className="text-gray-500">Complete some typing tests to see your progress here!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Typing Test Results</h2>
        <button
          onClick={onClearHistory}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
        >
          Clear History
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{averageWpm}</div>
          <div className="text-sm text-blue-800">Average WPM</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{averageAccuracy}%</div>
          <div className="text-sm text-green-800">Average Accuracy</div>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{bestWpm}</div>
          <div className="text-sm text-purple-800">Best WPM</div>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">{bestAccuracy}%</div>
          <div className="text-sm text-orange-800">Best Accuracy</div>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('date')}
                >
                  Date {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('wpm')}
                >
                  WPM {sortBy === 'wpm' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('accuracy')}
                >
                  Accuracy {sortBy === 'accuracy' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Text Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Errors
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedResults.map((result, index) => (
                <tr key={result.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(result.date).toLocaleDateString()} {new Date(result.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-semibold ${
                      result.wpm >= 60 ? 'text-green-600' : 
                      result.wpm >= 40 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {result.wpm}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-semibold ${
                      result.accuracy >= 95 ? 'text-green-600' : 
                      result.accuracy >= 85 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {result.accuracy}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {result.time}s
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {result.textType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {result.errors}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Progress Chart Placeholder */}
      <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Progress Over Time</h3>
        <div className="text-center py-8 text-gray-500">
          📈 Chart visualization would go here<br/>
          <span className="text-sm">(Consider adding Chart.js or similar for visual progress tracking)</span>
        </div>
      </div>
    </div>
  );
}