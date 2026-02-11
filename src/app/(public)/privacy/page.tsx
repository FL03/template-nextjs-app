/**
 * Created At: 2025.07.25:06:38:44
 * @author - @FL03
 * @file - privacy/page.tsx
 */
// features
import { PrivacyScreen } from '@/features/platform';

export default function Page() {
  // render the page
  return <PrivacyScreen />;
}
Page.displayName = 'PrivacyPage';

// page metadata
export const metadata: import('next').Metadata = {
  title: 'Privacy Policy',
};
