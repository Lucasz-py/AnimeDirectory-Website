import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://usjcjsyksfyswqlehrvv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzamNqc3lrc2Z5c3dxbGVocnZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3MjAzOTQsImV4cCI6MjA3MzI5NjM5NH0.JipeEjojkDYY_Vz4uzk-AcVklv54smd1PgEET5Ax3JM'
export const supabase = createClient(supabaseUrl, supabaseKey)
