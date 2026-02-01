// Authentication utilities and mock users

import { User } from '@/types';

// Mock user database - in a real application, this would be server-side
const mockUsers: User[] = [
  { username: 'admin', password: 'admin123' },
  { username: 'user', password: 'user123' },
  { username: 'test', password: 'test123' }
];

export const authenticateUser = (username: string, password: string): User | null => {
  const user = mockUsers.find(u => u.username === username && u.password === password);
  return user || null;
};

export const setAuthToken = (user: User): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('authUser', JSON.stringify(user));
  }
};

export const getAuthToken = (): User | null => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('authUser');
    return stored ? JSON.parse(stored) : null;
  }
  return null;
};

export const clearAuthToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authUser');
  }
};