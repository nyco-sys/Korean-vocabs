/* SUPABASE CONFIGURATION */
const SUPABASE_URL = "https://nylbmogscfyxcgdbknds.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_iuBDHcXh4_s01Ba_ujDf3Q_PufyUFUS";
let supabaseClient = null;

function initializeSupabase() {
  if (window.supabase && window.supabase.createClient) {
    supabaseClient = window.supabase.createClient(
      SUPABASE_URL,
      SUPABASE_PUBLISHABLE_KEY
    );
    return true;
  }
  console.error('Supabase library was not loaded.');
  return false;
}
