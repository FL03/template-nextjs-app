/**
 * Created At: 2025.07.27:13:14:02
 * @author - @FL03
 * @file - mdx-components.tsx
 */
// imports
import type { MDXComponents } from 'mdx/types';
import Image from 'next/image';
// project
import { cn } from '@/lib/utils';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    h1: (props) => (
      <h1
        {...props}
        className={cn(
          'text-3xl font-bold leading-loose tracking-snug',
          'font-sans',
        )}
      />
    ),
    h2: (props) => (
      <h2
        {...props}
        className={cn('text-2xl font-semibold leading-loose tracking-snug')}
      />
    ),
    h3: (props) => (
      <h3
        {...props}
        className={cn('text-xl font-semibold leading-normal tracking-tight')}
      />
    ),
    h4: (props) => <h4 {...props} className={cn('text-lg font-medium')} />,
    h5: (props) => (
      <h5 {...props} className={cn('text-base font-light underline')} />
    ),
    h6: (props) => (
      <h6 {...props} className={cn('text-base font-thin italic')} />
    ),
    p: (props) => <p {...props} className={cn('text-base text-foreground')} />,
    a: (props) => (
      <a
        className={cn(
          'text-base text-blue-400',
          'cursor-pointer transition-colors duration-200 ease-in-out',
          '[aria-disabled]:text-muted-foreground',
          'hover:italic hover:underline hover:text-blue-400/80 hover:text-shadow-md',
        )}
        {...props}
      />
    ),
    ul: (props) => (
      <ul
        className={cn(
          'list-disc list-inside h-fit inline-flex flex-col w-full',
          'peer:pl-5',
        )}
        {...props}
      />
    ),
    ol: (props) => (
      <ol
        className={cn(
          'list-decimal list-inside h-fit inline-flex flex-col w-full',
          'peer:pl-5',
        )}
        {...props}
      />
    ),
    li: (props) => (
      <li className={cn('text-base text-foreground px-2 py-1')} {...props} />
    ),
    blockquote: (props) => (
      <blockquote className='text-primary italic border-l-4 pl-4' {...props} />
    ),
    code: (props) => (
      <code
        className={cn(
          'bg-primary text-primary-foreground border-primary/10 p-1 rounded-lg w-full',
          'hover:opacity-90 hover:ring hover:ring-primary/10 hover:ring-offset-2',
          'transition-opacity duration-300 ease-in-out font-serif',
        )}
        {...props}
      />
    ),
    pre: (props) => (
      <pre
        className='text-primary-foreground bg-primary/90 border-primary/10 p-4 rounded overflow-x-auto'
        {...props}
      />
    ),
    img: (props) => (
      <Image
        className='h-auto max-h-sm w-full rounded-lg'
        alt='mdx-image'
        {...props}
      />
    ),
    table: (props) => (
      <table
        className='min-w-full border-collapse bg-transparent text-foreground container mx-auto'
        {...props}
      />
    ),
    th: (props) => (
      <th className='border border-b-2 px-4 py-2 font-semibold' {...props} />
    ),
    td: (props) => <td className='border px-4 py-2' {...props} />,
    hr: (props) => <hr className='my-4 border-primary/20' {...props} />,
  };
}
