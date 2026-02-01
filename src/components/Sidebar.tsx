// Sidebar Component for displaying categories

'use client';

import { useMemo } from 'react';
import { useData } from '@/context/DataContext';
import { Categories } from '@/types';

interface SidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}

function CategoryTree({ categories, level = 0 }: { categories: Categories; level?: number }) {
  return (
    <ul className={`${level > 0 ? 'ml-4 pl-4' : ''} space-y-2 overflow-hidden`}>
      {Object.entries(categories).map(([key, value]) => {
        const hasChildren = Object.keys(value).length > 0;
        
        return (
          <li key={key} className="text-sm">
            <div
              className={`
                py-2 px-3 rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 cursor-pointer transition-all duration-200 hover:shadow-sm border border-transparent hover:border-blue-100 overflow-hidden
                ${level === 0 ? 'font-semibold text-slate-800 bg-white shadow-sm border-slate-200' : 'text-slate-600 hover:text-slate-800'}
                ${level === 1 ? 'text-xs bg-slate-50' : ''}
                ${level >= 2 ? 'text-xs' : ''}
              `}
            >
              {hasChildren ? (
                <details className="group" open={level === 0}>
                  <summary className="flex items-center justify-between cursor-pointer list-none">
                    <span className="select-none flex items-center space-x-2 min-w-0 flex-1">
                      {level === 0 && (
                        <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex-shrink-0"></div>
                      )}
                      <span className="truncate" title={key}>{key}</span>
                    </span>
                    <div className="flex items-center space-x-1">
                      <div className={`text-xs px-2 py-1 rounded-md ${
                        level === 0 ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {Object.keys(value).length}
                      </div>
                      <svg
                        className="h-4 w-4 group-open:rotate-90 transition-transform duration-200 text-slate-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </summary>
                  <div className="mt-2">
                    <CategoryTree categories={value} level={level + 1} />
                  </div>
                </details>
              ) : (
                <div className="flex items-center space-x-2 min-w-0">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full flex-shrink-0"></div>
                  <span className="truncate" title={key}>{key}</span>
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default function Sidebar({ isCollapsed = false, onToggle }: SidebarProps) {
  const { categories, isLoading, error } = useData();

  const categoryCount = useMemo(() => {
    return Object.keys(categories).length;
  }, [categories]);

  if (isCollapsed) {
    return (
      <div className="w-16 bg-gradient-to-b from-slate-50 to-white border-r border-slate-200/50 flex flex-col items-center py-4 shadow-lg">
        <button
          onClick={onToggle}
          className="p-3 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200 hover:shadow-md border border-transparent hover:border-blue-100 group"
          aria-label="Expand sidebar"
        >
          <svg className="h-6 w-6 text-slate-600 group-hover:text-blue-600 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className="w-80 bg-gradient-to-b from-slate-50 to-white border-r border-slate-200/50 flex flex-col h-full shadow-lg">
      <div className="flex items-center justify-between p-6 border-b border-slate-200/50 bg-white/80 backdrop-blur-sm flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
            <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">Categories</h2>
        </div>
        <button
          onClick={onToggle}
          className="p-2 rounded-lg hover:bg-slate-100 transition-colors duration-200 text-slate-400 hover:text-slate-600"
          aria-label="Collapse sidebar"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div className="p-4 border-b border-slate-200/50 bg-gradient-to-r from-blue-50 to-purple-50 flex-shrink-0">
        <div className="bg-white/80 rounded-lg p-3 backdrop-blur-sm border border-white/50 shadow-sm">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600 font-medium">Total Categories</span>
            <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md font-bold text-xs">
              {categoryCount}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 min-h-0">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <span className="text-blue-700 text-sm font-medium">Loading categories...</span>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 shadow-sm">
            <div className="flex items-center space-x-2">
              <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-red-700 text-sm font-medium">{error}</span>
            </div>
          </div>
        ) : (
          <CategoryTree categories={categories} />
        )}
      </div>
    </div>
  );
}