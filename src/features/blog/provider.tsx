/**
 * Created At: 2025.07.05:22:28:11
 * @author - @FL03
 * @file - provider.tsx
 */
'use client';
// imports
import * as React from 'react';

type StateT = {
  isChanging: boolean;
  isEditing: boolean;
  isLoading: boolean;
  isPosting: boolean;
  isDeleting: boolean;
  isPublished: boolean;
  error: string | null;
};

type BlogContextT = {
  post: React.RefObject<{
    date: string;
    title: string;
    content: string;
    tags: string[];

  }>;
  state: StateT;
};


const BlogContext = React.createContext<BlogContextT | undefined>(undefined);

export const usePostEditor = () => {
  const context = React.useContext(BlogContext);
  if (!context) {
    throw new Error('usePostEditor must be used within a BlogProvider');
  }
  return context;
}