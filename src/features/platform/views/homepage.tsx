/**
 * Created At: 2025.07.05:08:39:48
 * @author - @FL03
 * @file - landing-screen.tsx
 */
'use client';
// imports
import * as React from 'react';
import { ArrowRightIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
// project
import { cn } from '@/lib/utils';
// components
import { PzzldLogo } from '@/components/common/icons';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item';
import { ButtonGroup } from '@/components/ui/button-group';

type FeatureItem = {
  title: string;
  description: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
};

export const HomePage: React.FC<
  Omit<React.ComponentPropsWithoutRef<'div'>, 'children'>
> = ({ className, ...props }) => {
  const features: FeatureItem[] = [
    {
      title: 'Ledger',
      description: 'Maintain a personal ledger of all your earned tips',
    },
    {
      title: 'Analytics',
      description:
        ' \
        Analyze your earned tips to gain critical insights into your patterns to make more informed decisions, \
        optimize your schedule, and maximize your potential earnings. \
      ',
    },
  ];
  return (
    <div
      data-slot='homepage'
      className={cn(
        'relative z-auto flex flex-1 flex-col items-center h-full w-full gap-4 lg:gap-6',
        className,
      )}
      {...props}
    >
      {/* Hero */}
      <Item className='flex-1 max-w-xl'>
        <ItemHeader>
          <ItemMedia className='mx-auto'>
            <PzzldLogo className='size-36' />
          </ItemMedia>
        </ItemHeader>
        <ItemContent>
          <ItemTitle className='text-xl text-nowrap'>Tip Tracker</ItemTitle>
          <ItemDescription>
            A comprehensive tip tracking solution designed to help you manage
            and analyze your tips with ease.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <ButtonGroup>
            <Button asChild variant='secondary'>
              <Link href='/pricing'>
                <span className='text-nowrap'>Pricing</span>
                <ArrowRightIcon className='size-4' />
              </Link>
            </Button>
          </ButtonGroup>
        </ItemActions>
      </Item>
      {/* Features */}
      <Card className='flex flex-col w-full max-w-3xl'>
        <CardContent className='flex-1 h-full w-full'>
          <CardHeader>
            <CardTitle className='text-lg'>Features</CardTitle>
            <CardDescription className='sr-only'>
              Explore the powerful features of Tip Tracker
            </CardDescription>
          </CardHeader>
          <CardFooter className='flex-1 h-full w-full'>
            <ItemGroup className='grid grid-cols-1 md:grid-cols-2 auto-rows-auto grid-rows-flow-dense gap-4'>
              {features.map(({ description, title, actions, icon }, index) => (
                <Item
                  key={index}
                  className='col-span-1 row-auto flex-1 h-full w-full'
                >
                  {icon && <ItemMedia variant='icon'>{icon}</ItemMedia>}
                  <ItemContent className='flex-1 w-full'>
                    <ItemTitle className='leading-none tracking-tight'>
                      {title}
                    </ItemTitle>
                    <ItemDescription>{description}</ItemDescription>
                  </ItemContent>
                  {actions && <ItemActions>{actions}</ItemActions>}
                </Item>
              ))}
            </ItemGroup>
          </CardFooter>
        </CardContent>
      </Card>
    </div>
  );
};
HomePage.displayName = 'HomePage';

export default HomePage;
