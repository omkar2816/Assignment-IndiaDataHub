// Custom hooks for performance optimization

import { useMemo, useCallback, useEffect, useState, useRef } from 'react';
import { FrequentItem } from '@/types';

// Hook for debounced search to prevent excessive filtering
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Hook for virtualized list performance
export function useVirtualizedData<T>(
  data: T[],
  itemsPerPage: number = 10
) {
  const [currentPage, setCurrentPage] = useState(1);
  
  const totalPages = useMemo(() => 
    Math.ceil(data.length / itemsPerPage), 
    [data.length, itemsPerPage]
  );

  const visibleData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  }, [data, currentPage, itemsPerPage]);

  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  }, [totalPages]);

  const resetToFirstPage = useCallback(() => {
    setCurrentPage(1);
  }, []);

  return {
    visibleData,
    currentPage,
    totalPages,
    goToPage,
    resetToFirstPage,
    totalItems: data.length,
    startIndex: (currentPage - 1) * itemsPerPage + 1,
    endIndex: Math.min(currentPage * itemsPerPage, data.length),
  };
}

// Hook for efficient data filtering
export function useFilteredData(
  data: FrequentItem[],
  searchTerm: string,
  delay: number = 300
) {
  const debouncedSearchTerm = useDebounce(searchTerm, delay);
  const previousSearchTerm = useRef<string>('');
  const cachedResults = useRef<Map<string, FrequentItem[]>>(new Map());

  const filteredData = useMemo(() => {
    if (!debouncedSearchTerm.trim()) {
      return data;
    }

    // Check cache first
    if (cachedResults.current.has(debouncedSearchTerm)) {
      return cachedResults.current.get(debouncedSearchTerm)!;
    }

    const searchLower = debouncedSearchTerm.toLowerCase();
    const filtered = data.filter(item => 
      item.title.toLowerCase().includes(searchLower) ||
      item.cat.toLowerCase().includes(searchLower) ||
      item.subCat.toLowerCase().includes(searchLower) ||
      item.src.toLowerCase().includes(searchLower) ||
      (item.region && item.region.toLowerCase().includes(searchLower)) ||
      item.id.toLowerCase().includes(searchLower)
    );

    // Cache the result
    cachedResults.current.set(debouncedSearchTerm, filtered);
    
    // Clear cache if it gets too large
    if (cachedResults.current.size > 50) {
      const firstKey = cachedResults.current.keys().next().value;
      if (firstKey) {
        cachedResults.current.delete(firstKey);
      }
    }

    return filtered;
  }, [data, debouncedSearchTerm]);

  // Clear cache when data changes
  useEffect(() => {
    cachedResults.current.clear();
  }, [data]);

  return {
    filteredData,
    isSearching: searchTerm !== debouncedSearchTerm,
    searchTerm: debouncedSearchTerm,
  };
}

// Hook for performance monitoring
export function usePerformanceMonitor(label: string) {
  const startTime = useRef<number>(0);

  const startMeasurement = useCallback(() => {
    startTime.current = performance.now();
  }, []);

  const endMeasurement = useCallback(() => {
    if (startTime.current > 0) {
      const endTime = performance.now();
      const duration = endTime - startTime.current;
      console.log(`⚡ ${label}: ${duration.toFixed(2)}ms`);
      startTime.current = 0;
      return duration;
    }
    return 0;
  }, [label]);

  return { startMeasurement, endMeasurement };
}

// Hook for memory-efficient data chunks
export function useDataChunks<T>(
  data: T[],
  chunkSize: number = 1000
) {
  const chunks = useMemo(() => {
    const result: T[][] = [];
    for (let i = 0; i < data.length; i += chunkSize) {
      result.push(data.slice(i, i + chunkSize));
    }
    return result;
  }, [data, chunkSize]);

  return chunks;
}