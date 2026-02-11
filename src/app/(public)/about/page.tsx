/**
 * Created At: 2025.05.28:12:07:02
 * @author - @FL03
 * @file - about/page.tsx
 */
// imports
import { Metadata } from 'next';
import { AboutPage } from '@/features/platform';

// page metadata
export const metadata: Metadata = {
  title: 'About',
  description: 'About our mission, staff, and story.',
};

// render the page
export default function Page() {
  return <AboutPage />;
}
Page.displayName = 'AboutPage';
