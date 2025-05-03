param(
    [string]$schema = "public"             
)

supabase gen types typescript --project-id gilqgzjkzkmhbbcqidqb --schema $schema > ./src/types/database/database.$schema.types.ts
