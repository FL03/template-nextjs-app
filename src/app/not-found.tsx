/**
 * Created At: 2025.09.14:16:41:46
 * @author - @FL03
 * @directory - src/app
 * @file - not_found.tsx
 */
// imports
import Link from 'next/link';
// components
import { HomeIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default async function NotFound() {
  return (
    <Card className='flex flex-1 flex-col h-full w-full'>
      <CardContent>
        <CardHeader>
          <CardTitle className='text-xl font-semibold tracking-tight'>
            Not Found
          </CardTitle>
          <CardDescription className='leading-snug tracking-tight text-muted-foreground'>
            Could not find requested resource
          </CardDescription>
          <CardAction>
            <Button asChild variant='link' size='sm'>
              <Link href='/' className='flex flex-nowrap items-center gap-2'>
                <HomeIcon className='h-4 w-4' />
                <span>Home</span>
              </Link>
            </Button>
          </CardAction>
        </CardHeader>
      </CardContent>
    </Card>
  );
}
NotFound.displayName = 'NotFound';
