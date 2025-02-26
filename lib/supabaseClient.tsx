import { createClient } from '@supabase/supabase-js';

// Gantilah dengan URL dan public API key dari proyek Supabase Anda
const supabaseUrl = 'https://lnauvznspseugfqxpwjc.supabase.co/';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxuYXV2em5zcHNldWdmcXhwd2pjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg1MjgxNDMsImV4cCI6MjA0NDEwNDE0M30.DSIs9XE9BNT4LG4qwAgC1_bpcHQ65tNFPvMdgy6ePA8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
