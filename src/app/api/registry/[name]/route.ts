/**
 * Created At: 2025-04-04:13:33:08
 * @author - @FL03
 * @description - serve registry components using this sample route handler
 * @file - route.ts
 */
'use server';
// imports
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';
import { registryItemSchema } from 'shadcn/registry';

type RouteProps = {
  params: Promise<{ name: string }>;
};
// This route shows an example for serving a component using a route handler.
export async function GET(req: NextRequest, { params }: RouteProps) {
  const { searchParams, pathname } = new URL(req.url);
  const { name } = Object.fromEntries(searchParams.entries());
  try {
    const { name } = await params;
    // import the registry JSON file;
    const { default: registry } = await import('@/root/registry.json');
    // find the component from the registry.
    const component = registry.items.find((c) => c.name === name);

    // If the component is not found, return a 404 error.
    if (!component) {
      return NextResponse.json(
        { error: 'Component not found' },
        { status: 404 }
      );
    }

    // Validate before file operations.
    const registryItem = registryItemSchema.parse(component);

    // If the component has no files, return a 400 error.
    if (!registryItem.files?.length) {
      return NextResponse.json(
        { error: 'Component has no files' },
        { status: 400 }
      );
    }

    // Read all files in parallel.
    const filesWithContent = await Promise.all(
      registryItem.files.map(async (file) => {
        const filePath = path.join(process.cwd(), file.path);
        const content = await fs.readFile(filePath, 'utf8');
        return { ...file, content };
      })
    );

    // Return the component with the files.
    return NextResponse.json({ ...registryItem, files: filesWithContent });
  } catch (error) {
    console.error('Error processing component request:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
