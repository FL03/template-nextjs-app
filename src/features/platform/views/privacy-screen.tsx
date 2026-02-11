/**
 * Created At: 2025.07.23:16:47:30
 * @author - @FL03
 * @file - about-screen.tsx
 */
'use client';
// imports
import * as React from 'react';
// project
import Privacy from '@/content/privacy.mdx';
// components
import { ArticleCard } from '@/components/common/articles';
export const PrivacyScreen: React.FC<
  Omit<
    React.ComponentPropsWithoutRef<typeof ArticleCard>,
    'title' | 'children' | 'showDescription'
  >
> = ({ ...props }) => (
  <ArticleCard {...props} showDescription title='Privacy Policy'>
    <Privacy />
  </ArticleCard>
);
PrivacyScreen.displayName = 'PrivacyScreen';

export default PrivacyScreen;
