/**
 * Created At: 2025.08.05:08:44:44
 * @author - @FL03
 * @file - sample-screen.tsx
 */
'use client';
// imports
import * as React from 'react';
// local
import Test from '@/content/test.mdx';
// components
import { ArticleCard } from '@/components/common/articles';

export const SampleScreen: React.FC<
  Omit<
    React.ComponentPropsWithoutRef<typeof ArticleCard>,
    'author' | 'description' | 'title' | 'children'
  >
> = ({ ...props }) => (
  <ArticleCard
    {...props}
    showDescription
    author='Joe McCain III'
    title='Example'
    description='This is an example content card to demonstrate the structure.'
  >
    <Test />
  </ArticleCard>
);
SampleScreen.displayName = 'SampleScreen';

export default SampleScreen;
