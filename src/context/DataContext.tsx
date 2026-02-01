// Data context for managing dataset switching and data fetching

'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { DataResponse, DatasetType, Categories, FrequentItem } from '@/types';

interface DataContextType {
  categories: Categories;
  frequentData: FrequentItem[];
  currentDataset: DatasetType;
  isLoading: boolean;
  error: string | null;
  switchDataset: (dataset: DatasetType) => void;
  totalRecords: number;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [categories, setCategories] = useState<Categories>({});
  const [frequentData, setFrequentData] = useState<FrequentItem[]>([]);
  const [currentDataset, setCurrentDataset] = useState<DatasetType>('default');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async (dataset: DatasetType) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const filename = dataset === 'default' ? '/response1.json' : '/response2.json';
      const response = await fetch(filename);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch ${filename}`);
      }
      
      const data: DataResponse = await response.json();
      
      setCategories(data.categories || {});
      setFrequentData(data.frequent || []);
      setCurrentDataset(dataset);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load data';
      setError(errorMessage);
      console.error('Error loading data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Load default dataset on mount
    loadData('default');
  }, [loadData]);

  const switchDataset = (dataset: DatasetType) => {
    if (dataset !== currentDataset) {
      loadData(dataset);
    }
  };

  return (
    <DataContext.Provider
      value={{
        categories,
        frequentData,
        currentDataset,
        isLoading,
        error,
        switchDataset,
        totalRecords: frequentData.length
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}