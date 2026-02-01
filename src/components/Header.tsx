// Header Component with dataset switching and search

'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { DatasetType } from '@/types';

interface HeaderProps {
  onSearch?: (term: string) => void;
  searchTerm?: string;
}

export default function Header({ onSearch, searchTerm = '' }: HeaderProps) {
  const { user, logout } = useAuth();
  const { currentDataset, switchDataset, totalRecords, isLoading } = useData();
  const [searchValue, setSearchValue] = useState(searchTerm);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleDatasetChange = (dataset: DatasetType) => {
    switchDataset(dataset);
    setIsDropdownOpen(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    onSearch?.(value);
  };

  const clearSearch = () => {
    setSearchValue('');
    onSearch?.('');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/50 shadow-lg relative z-[100000]">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Title and Dataset Info */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-xl flex items-center justify-center">
                <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                IndiaDataHub
              </h1>
            </div>
            <div className="hidden sm:flex items-center space-x-3">
              <div className="bg-slate-100 rounded-full px-3 py-1 flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-slate-600">Dataset:</span>
                <span className="font-semibold text-slate-800">
                  {currentDataset === 'default' ? 'Default' : 'IMF'}
                </span>
              </div>
              {isLoading && (
                <div className="flex items-center space-x-2 bg-orange-50 border border-orange-200 rounded-lg px-3 py-1">
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-orange-500"></div>
                  <span className="text-orange-700 text-xs font-medium">Loading...</span>
                </div>
              )}
            </div>
          </div>

          {/* Center - Search */}
          <div className="flex-1 max-w-md mx-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-[99]">
                <svg className="h-5 w-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                className="w-full pl-10 pr-10 py-2.5 bg-white/80 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm backdrop-blur-sm"
                placeholder="Search products, categories, sources..."
                value={searchValue}
                onChange={handleSearchChange}
              />
              {searchValue && (
                <button
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-slate-100 rounded-r-xl transition-colors"
                >
                  <svg className="h-4 w-4 text-slate-400 hover:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Right side - Dataset Switcher and User Menu */}
          <div className="flex items-center space-x-4">
            {/* Dataset Switcher */}
            <div className="flex items-center space-x-3">
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  disabled={isLoading}
                  className="flex items-center justify-between text-sm border border-slate-200 rounded-xl px-4 py-2.5 bg-white/90 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm font-medium text-slate-700 hover:bg-white hover:shadow-md hover:border-blue-300 cursor-pointer min-w-44 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-indigo-600 to-indigo-800"></div>
                    <span>{currentDataset === 'default' ? 'Default Dataset' : 'IMF Dataset'}</span>
                  </div>
                  <svg
                    className={`h-4 w-4 text-slate-500 group-hover:text-blue-600 transition-all duration-200 transform ${
                      isDropdownOpen ? 'rotate-180' : 'rotate-0'
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {isDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-[999998]" onClick={() => setIsDropdownOpen(false)}></div>
                    <div 
                      className="fixed bg-white border border-slate-200 rounded-xl shadow-2xl z-[999999] overflow-hidden backdrop-blur-xl bg-white/95 min-w-44"
                      style={{
                        left: dropdownRef.current?.getBoundingClientRect().left + 'px',
                        top: (dropdownRef.current?.getBoundingClientRect().bottom ?? 0) + 8 + 'px'
                      }}
                    >
                    <div className="py-2">
                      <button
                        onClick={() => handleDatasetChange('default')}
                        className={`w-full flex items-center space-x-3 px-4 py-3 text-sm transition-all duration-200 group hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 ${
                          currentDataset === 'default'
                            ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-r-2 border-blue-500'
                            : 'text-slate-700 hover:text-blue-700'
                        }`}
                      >
                        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-indigo-600 to-indigo-800 flex-shrink-0"></div>
                        <div className="flex-1 text-left">
                          <div className="font-medium">Default Dataset</div>
                          <div className="text-xs text-slate-500 group-hover:text-blue-600">Standard product catalogue data</div>
                        </div>
                        {currentDataset === 'default' && (
                          <svg className="h-4 w-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                      <button
                        onClick={() => handleDatasetChange('IMF')}
                        className={`w-full flex items-center space-x-3 px-4 py-3 text-sm transition-all duration-200 group hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 ${
                          currentDataset === 'IMF'
                            ? 'bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 border-r-2 border-purple-500'
                            : 'text-slate-700 hover:text-purple-700'
                        }`}
                      >
                        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-indigo-600 to-indigo-800 flex-shrink-0"></div>
                        <div className="flex-1 text-left">
                          <div className="font-medium">IMF Dataset</div>
                          <div className="text-xs text-slate-500 group-hover:text-purple-600">International Monetary Fund data</div>
                        </div>
                        {currentDataset === 'IMF' && (
                          <svg className="h-4 w-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                    </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-3 bg-white/80 border border-slate-200 rounded-xl px-3 py-2 backdrop-blur-sm">
                <div className="h-8 w-8 bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-lg flex items-center justify-center shadow-sm">
                  <span className="text-sm font-bold text-white">
                    {user?.username?.[0]?.toUpperCase()}
                  </span>
                </div>
                <span className="text-sm font-semibold text-slate-700 hidden sm:block">
                  {user?.username}
                </span>
              </div>
              <button
                onClick={logout}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none shadow-sm hover:shadow-md"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Dataset Info */}
      <div className="sm:hidden px-4 py-2 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>
            Dataset: <span className="font-medium">{currentDataset === 'default' ? 'Default' : 'IMF'}</span>
          </span>
        </div>
      </div>
    </header>
  );
}