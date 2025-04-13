import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://krctsbsoyfedcyjkkeeu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtyY3RzYnNveWZlZGN5amtrZWV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ1NjE4ODYsImV4cCI6MjA2MDEzNzg4Nn0.QF8Qt3Sbp0qt2pmmGrWOr9pWUWAAjJGT2URvgpL1fxI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
