param(
    [string]$path = "./src/types/database.types",
    [string]$filename = "datbase.public.types.ts"
)
# Convert the generated Supabase type file to UTF-8
Get-Content "$path/$filename" | Set-Content -Encoding utf8 "$path/$filename"