/**
 * Created At: 2025.05.02:23:10:22
 * @author - @FL03
 * @file - page.tsx
 */
'use client';
// hooks
import { useSearchParams } from 'next/navigation';
// components
import { ErrorCard } from '@/components/common/error';


export default function Page() {
  const searchParams = useSearchParams();
  return (
    <div className="flex flex-col w-full items-center justify-center justify-items-center min-h-svh">
      <ErrorCard
        message={searchParams.get('message') ?? 'Something went wrong...'}
      />
    </div>
  );
};
Page.displayName = 'ErrorPage';
