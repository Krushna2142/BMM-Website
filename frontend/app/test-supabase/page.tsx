'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/src/lib/supabase';

export default function TestSupabasePage() {
  const [status, setStatus] = useState('Testing...');

  useEffect(() => {
    async function testConnection() {
      try {
        const { data, error } = await supabase
          .from('pages')
          .select('count')
          .limit(1);

        if (error) throw error;

        setStatus('✅ Supabase connected successfully!');
      } catch (error: any) {
        setStatus(`❌ Error: ${error.message}`);
      }
    }

    testConnection();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Supabase Connection Test</h1>
        <p className="text-lg">{status}</p>
      </div>
    </div>
  );
}