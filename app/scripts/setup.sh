#!/usr/bin/env bash

projectId="${1:-gilqgzjkzkmhbbcqidqb}"

# Install Supabase CLI if not already installed
if ! command -v supabase &> /dev/null; then
    echo "Supabase CLI not found. Installing..."
    bun install --save-dev supabase
fi

# Log in to Supabase CLI (assumes you have set SUPABASE_ACCESS_TOKEN env variable)
if ! bunx supabase login; then
    echo "Failed to log in to Supabase CLI." >&2
    exit 1
fi
# Link the local project to the Supabase project
if ! bunx supabase link --project-ref "$projectId"; then
    echo "Failed to link to Supabase project." >&2
    exit 1
fi
echo "Supabase CLI setup completed successfully."
