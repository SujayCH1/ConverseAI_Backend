// supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl =  "https://zetdmzkgaehbhkcqhmby.supabase.co/"; // Replace with your project URL
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpldGRtemtnYWVoYmhrY3FobWJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM0MzM1ODMsImV4cCI6MjA1OTAwOTU4M30.ostTwDAWLfQc6AgGvkzJi0AFPNqvR48mO8M09C6S2yM"; // Replace with your anon/public API key

export const supabase = createClient(supabaseUrl, supabaseKey);