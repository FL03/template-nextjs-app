#! /bin/bash
# This script generates types for Supabase using the supabase CLI
# Usage: ./scripts/supatypes.sh <project-id> <schema>
# Example: ./scripts/supatypes.sh abc123 public


print_usage() {
  printf "Usage: {project_id} {schema}"
}

project_id=$1
schema=$2
verbose='false'

if [ -z "$project_id" ]; then
  echo "Error: Project ID is required."
  print_usage
  exit 1
fi

if [ -z "$schema" ]; then
  schema="public"
fi

while getopts ':v' flag; do
  case "${flag}" in
    v) verbose='true' ;;
    *) print_usage
       exit 1 ;;
  esac
done

npx supabase gen types typescript --project-id $1 --schema $2 > ./src/types/database.$schema.types.ts