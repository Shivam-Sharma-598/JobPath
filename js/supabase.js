// js/supabase.js
const SUPABASE_URL = "https://yzqmdwjxiemcspyvjcpj.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6cW1kd2p4aWVtY3NweXZqY3BqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyODE0NDgsImV4cCI6MjA4NTg1NzQ0OH0.O1l94oPZ0gxiUbx1ydqTQ8xw7ChgHCK67SpU24ENGDs";

// Initialize Supabase client
const { createClient } = supabase;
window.supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
