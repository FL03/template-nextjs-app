import type { VercelConfig } from '@vercel/config/v1';

export const config: VercelConfig = {
  bunVersion: '1.x',
  outputDirectory: 'build',
  buildCommand: "bun run --bun next build",
  devCommand: "bun run --bun next dev",
};