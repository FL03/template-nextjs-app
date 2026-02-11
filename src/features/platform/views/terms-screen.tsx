/**
 * Created At: 2025.07.25:06:39:24
 * @author - @FL03
 * @file - terms-screen.tsx
 */
'use client';
// imports
import * as React from 'react';
// content
import Terms from '@/content/terms.mdx';
// components
import { ArticleCard } from '@/components/common/articles';

export const TermScreen: React.FC<
  Omit<
    React.ComponentPropsWithoutRef<typeof ArticleCard>,
    'author' | 'description' | 'title' | 'children'
  >
> = ({ ...props }) => (
  <ArticleCard
    {...props}
    showDescription
    author='Joe McCain III'
    title='Terms of Service'
    description='This is an example content card to demonstrate the structure.'
  >
    <Terms />
  </ArticleCard>
);
TermScreen.displayName = 'TermScreen';

export default TermScreen;
