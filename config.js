// console.log(supabase)
const {createClient} = supabase;
let supabaseUrl = 'https://zftnumyqladnrmkxjtdv.supabase.co';
let supabaseApi = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmdG51bXlxbGFkbnJta3hqdGR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgwMDI0NzAsImV4cCI6MjA1MzU3ODQ3MH0.vXNx7b07M1Uq_vxHLTjOtRJhhzTzaRZaMPyfbKAxZE4';
let supabaseCreateClient = createClient(supabaseUrl, supabaseApi);
// console.log(supabaseClient)
// console.log(supabaseClient)
// window.supabaseCreateClient;
window.supabase = supabaseCreateClient;
// console.log(window.supabase)
// console.log(supabase)