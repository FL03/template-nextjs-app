#!/usr/bin/env -S bash

schema="${1:-public}"
outdir="${2:-./src/types/database.types}"
projectId="${3:-gilqgzjkzkmhbbcqidqb}"

# Ensure the output directory exists
mkdir -p "$outdir"
# Check if Supabase CLI is installed; if not, install it
if ! command -v npx supabase@latest --version &> /dev/null; then
    echo "Supabase CLI not found. Installing..."
    echo "y" | npx supabase@latest --version
fi

# Generate TypeScript types from Supabase schema
if ! npx supabase gen types typescript --project-id "$projectId" --schema "$schema" > "$outdir/database.$schema.types.ts"; then
    echo "Failed to generate types from Supabase schema." >&2
    exit 1
fi

# Ensure the output file is UTF-8 encoded (no BOM)
iconv -f UTF-8 -t UTF-8 "$outdir/database.$schema.types.ts" -o "$outdir/database.$schema.types.ts"

# Check if the file was created successfully
if [ ! -f "$outdir/database.$schema.types.ts" ]; then
    echo "Failed to create the output file." >&2
    exit 1
fi
