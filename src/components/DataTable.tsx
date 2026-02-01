// Data Table Component with virtualization for performance

'use client';

import { useMemo, useState, useEffect, useCallback } from 'react';
import { useData } from '@/context/DataContext';
import { FrequentItem } from '@/types';
import { useFilteredData, useVirtualizedData, usePerformanceMonitor } from '@/hooks/usePerformance';

interface DataTableProps {
  searchTerm?: string;
}

const ITEMS_PER_PAGE = 10;

type SortDirection = 'asc' | 'desc' | null;
type SortField = keyof FrequentItem | null;

interface SortableHeaderProps {
  field: keyof FrequentItem;
  label: string;
  icon: React.ReactNode;
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: keyof FrequentItem) => void;
}

function SortableHeader({ field, label, icon, sortField, sortDirection, onSort }: SortableHeaderProps) {
  const isActive = sortField === field;
  
  return (
    <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
      <button
        onClick={() => onSort(field)}
        className="flex items-center space-x-2 hover:text-blue-600 transition-colors group w-full"
      >
        {icon}
        <span>{label}</span>
        <div className="flex flex-col ml-1">
          <svg
            className={`h-3 w-3 transition-colors ${
              isActive && sortDirection === 'asc' ? 'text-blue-600' : 'text-slate-400 group-hover:text-blue-500'
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          <svg
            className={`h-3 w-3 -mt-1 transition-colors ${
              isActive && sortDirection === 'desc' ? 'text-blue-600' : 'text-slate-400 group-hover:text-blue-500'
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </button>
    </th>
  );
}

export default function DataTable({ searchTerm = '' }: DataTableProps) {
  const { frequentData, isLoading, error, totalRecords } = useData();
  const { startMeasurement, endMeasurement } = usePerformanceMonitor('DataTable Render');
  
  // Sorting state
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  
  // Handle sorting
  const handleSort = useCallback((field: keyof FrequentItem) => {
    if (sortField === field) {
      // Cycle through: asc -> desc -> null
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortDirection(null);
        setSortField(null);
      } else {
        setSortDirection('asc');
      }
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  }, [sortField, sortDirection]);
  
  // Sort data
  const sortedData = useMemo(() => {
    if (!sortField || !sortDirection) return frequentData;
    
    return [...frequentData].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      
      // Handle null/undefined values
      if (!aVal && !bVal) return 0;
      if (!aVal) return sortDirection === 'asc' ? 1 : -1;
      if (!bVal) return sortDirection === 'asc' ? -1 : 1;
      
      // Convert to string for comparison
      const aStr = String(aVal).toLowerCase();
      const bStr = String(bVal).toLowerCase();
      
      if (aStr < bStr) return sortDirection === 'asc' ? -1 : 1;
      if (aStr > bStr) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [frequentData, sortField, sortDirection]);
  
  // Use performance-optimized filtering on sorted data
  const { filteredData, isSearching } = useFilteredData(sortedData, searchTerm, 300);
  
  // Use virtualized pagination
  const {
    visibleData,
    currentPage,
    totalPages,
    goToPage,
    resetToFirstPage,
    totalItems,
    startIndex,
    endIndex
  } = useVirtualizedData(filteredData, ITEMS_PER_PAGE);

  // Reset pagination when search changes
  useEffect(() => {
    resetToFirstPage();
  }, [searchTerm, resetToFirstPage]);

  // Performance monitoring
  useEffect(() => {
    startMeasurement();
    return () => {
      endMeasurement();
    };
  });

  const goToPrevious = useCallback(() => {
    goToPage(currentPage - 1);
  }, [currentPage, goToPage]);

  const goToNext = useCallback(() => {
    goToPage(currentPage + 1);
  }, [currentPage, goToPage]);

  // Memoized page numbers for better performance
  const pageNumbers = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  }, [currentPage, totalPages]);

  // Check if region column should be shown
  const showRegionColumn = useMemo(() => {
    return visibleData.some(item => item.region);
  }, [visibleData]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16 bg-gradient-to-b from-blue-50 to-purple-50 rounded-2xl">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto"></div>
          <div className="bg-white/80 border border-blue-200 rounded-xl px-6 py-3 backdrop-blur-sm shadow-sm">
            <p className="text-blue-700 font-medium">Loading data...</p>
            <p className="text-blue-600 text-sm mt-1">Please wait while we fetch your records</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-gradient-to-b from-red-50 to-pink-50 rounded-2xl">
        <div className="bg-white/90 border border-red-200 rounded-xl p-6 shadow-lg backdrop-blur-sm">
          <div className="flex items-center space-x-3">
            <div className="bg-red-100 rounded-lg p-2">
              <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="text-red-800 font-semibold">Error loading data</h4>
              <p className="text-red-700 text-sm mt-1">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (filteredData.length === 0 && !isSearching) {
    return (
      <div className="text-center py-16 bg-gradient-to-b from-slate-50 to-white rounded-2xl border border-slate-200">
        <div className="max-w-sm mx-auto">
          <div className="bg-gradient-to-r from-slate-100 to-slate-50 rounded-full p-4 w-fit mx-auto mb-4">
            <svg className="h-8 w-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-800 mb-2">No data found</h3>
          <p className="text-slate-500 text-sm">
            {searchTerm ? `No results match your search for "${searchTerm}"` : 'No data is currently available'}
          </p>
          {searchTerm && (
            <div className="mt-4">
              <p className="text-xs text-slate-400">Try adjusting your search terms or check back later</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl shadow-xl border border-slate-200/50 overflow-hidden h-full flex flex-col">
      {/* Data count and search info */}
      <div className="px-6 py-4 border-b border-slate-200/50 bg-white/90 backdrop-blur-sm flex-shrink-0">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-lg flex items-center justify-center">
                <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="text-sm">
                <div className="text-slate-800 font-semibold">
                  Showing {startIndex} to {endIndex} of {totalItems} results
                </div>
                {searchTerm && (
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs font-medium">
                      Search: "{searchTerm}"
                    </div>
                    {isSearching && (
                      <div className="flex items-center space-x-1 bg-orange-100 text-orange-700 px-2 py-1 rounded-md text-xs">
                        <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                        <span>Searching...</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-sm">
              <span className="text-sm font-medium text-slate-700">
                {totalRecords.toLocaleString()} records
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto min-h-0">
        <div className="min-w-full overflow-x-auto">
          <table className="w-full divide-y divide-slate-200 min-w-[800px]">
            <thead className="bg-gradient-to-r from-slate-100 to-slate-50 border-b border-slate-200 sticky top-0 z-10">
            <tr>
              <SortableHeader
                field="title"
                label="Title"
                icon={<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a1.994 1.994 0 01-1.414.586H7a4 4 0 01-4-4V7a4 4 0 014-4z" />
                </svg>}
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              />
              <SortableHeader
                field="cat"
                label="Category"
                icon={<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>}
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              />
              <SortableHeader
                field="subCat"
                label="Sub Category"
                icon={<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>}
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              />
              <SortableHeader
                field="freq"
                label="Frequency"
                icon={<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>}
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              />
              <SortableHeader
                field="unit"
                label="Unit"
                icon={<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>}
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              />
              <SortableHeader
                field="src"
                label="Source"
                icon={<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>}
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              />
              {showRegionColumn && (
                <SortableHeader
                  field="region"
                  label="Region"
                  icon={<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>}
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                />
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {visibleData.map((item: FrequentItem, index: number) => (
              <tr 
                key={item.id} 
                className={`transition-all duration-200 group border-b border-slate-100 ${
                  index % 2 === 0 
                    ? 'bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50' 
                    : 'bg-slate-50 hover:bg-gradient-to-r hover:from-blue-100 hover:to-purple-100'
                }`}
              >
                <td className="px-6 py-4 text-sm text-slate-900">
                  <div className="max-w-xs min-w-0">
                    <div className="font-semibold text-slate-900 line-clamp-2 group-hover:text-blue-900 transition-colors break-words" title={item.title}>
                      {item.title}
                    </div>
                    <div className="text-xs text-slate-500 mt-1 font-mono bg-slate-50 px-2 py-1 rounded group-hover:bg-blue-50 transition-colors inline-block truncate">
                      ID: {item.id}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 px-3 py-1.5 rounded-lg font-medium group-hover:from-blue-200 group-hover:to-indigo-200 transition-all duration-200">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>{item.cat}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 px-3 py-1.5 rounded-lg font-medium group-hover:from-purple-200 group-hover:to-pink-200 transition-all duration-200">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>{item.subCat}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 px-3 py-1.5 rounded-lg font-semibold shadow-sm group-hover:shadow-md group-hover:from-green-200 group-hover:to-emerald-200 transition-all duration-200">
                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{item.freq}</span>
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 px-3 py-1.5 rounded-lg font-medium border border-amber-200 group-hover:from-amber-200 group-hover:to-yellow-200 group-hover:border-amber-300 transition-all duration-200 shadow-sm">
                    {item.unit}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 px-3 py-1.5 rounded-lg font-medium group-hover:from-orange-200 group-hover:to-red-200 transition-all duration-200">
                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>{item.src}</span>
                  </span>
                </td>
                {showRegionColumn && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {item.region ? (
                      <span className="inline-flex items-center space-x-2 bg-gradient-to-r from-teal-100 to-cyan-100 text-teal-800 px-3 py-1.5 rounded-lg font-medium group-hover:from-teal-200 group-hover:to-cyan-200 transition-all duration-200">
                        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                        <span>{item.region}</span>
                      </span>
                    ) : (
                      <span className="text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg">-</span>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-gradient-to-r from-slate-50 to-white px-6 py-4 border-t border-slate-200/50 flex-shrink-0">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3 text-sm">
              <div className="bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-sm">
                <span className="text-slate-600 font-medium">
                  <span className="text-slate-800 font-semibold">{startIndex}</span> to{' '}
                  <span className="text-slate-800 font-semibold">{endIndex}</span> of{' '}
                  <span className="text-slate-800 font-semibold">{totalItems}</span> results
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {/* Mobile pagination */}
              <div className="flex sm:hidden space-x-2">
                <button
                  onClick={goToPrevious}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
                >
                  Previous
                </button>
                <button
                  onClick={goToNext}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
                >
                  Next
                </button>
              </div>
              
              {/* Desktop pagination */}
              <div className="hidden sm:flex items-center space-x-1">
                <button
                  onClick={goToPrevious}
                  disabled={currentPage === 1}
                  className="p-2 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                
                {pageNumbers.map((pageNum, idx) => {
                  if (pageNum === '...') {
                    return (
                      <span key={`dots-${idx}`} className="px-3 py-2 text-slate-400">
                        ...
                      </span>
                    );
                  }
                  return (
                    <button
                      key={`page-${pageNum}`}
                      onClick={() => goToPage(pageNum as number)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm ${
                        pageNum === currentPage
                          ? 'bg-gradient-to-r from-indigo-600 to-indigo-800 text-white shadow-md transform scale-105'
                          : 'bg-white border border-slate-300 text-slate-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-indigo-100 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  onClick={goToNext}
                  disabled={currentPage === totalPages}
                  className="p-2 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}