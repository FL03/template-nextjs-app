param(
    [string]$schema = "public",
    [string]$outdir = "./src/types/database.types",
    [string]$projectId = "gilqgzjkzkmhbbcqidqb"                
)
# Ensure the output directory exists
if (-not (Test-Path -Path $outdir)) {
    New-Item -ItemType Directory -Path $outdir | Out-Null
}
# Generate TypeScript types from Supabase schema
supabase gen types typescript --project-id $projectId --schema $schema > $outdir/database.$schema.types.ts
# Check if the command was successful
if ($LASTEXITCODE -ne 0) {
    Write-Error "Failed to generate types from Supabase schema."
    exit $LASTEXITCODE
}
# Ensure the output file was created
if (-not (Test-Path -Path "$outdir/database.$schema.types.ts")) {
    Write-Error "Output file not found: $outdir/database.$schema.types.ts"
    exit 1
}
