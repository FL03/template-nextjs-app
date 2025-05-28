/**
 * Created At: 2025.05.28:12:07:02
 * @author - @FL03
 * @file - about/page.tsx
 */
'use server';
import { AboutScreenView } from '@/features/landing';

export default async function Page() {
  return <AboutScreenView/>;
}
Page.displayName = 'AboutPage';
