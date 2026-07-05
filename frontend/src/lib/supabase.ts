import { createClient } from '@supabase/supabase-js';

// These are now from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Validate that environment variables are set
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env.local file.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Media storage functions
export const uploadToSupabase = async (
  file: File,
  onProgress?: (progress: number) => void
) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
  
  const { data, error } = await supabase.storage
    .from('bmm-media')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) throw error;

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('bmm-media')
    .getPublicUrl(fileName);

  return {
    url: publicUrl,
    path: data.path,
  };
};

export const deleteFromSupabase = async (filePath: string) => {
  const { error } = await supabase.storage
    .from('bmm-media')
    .remove([filePath]);

  if (error) throw error;
};

export const getMediaFromSupabase = async () => {
  const { data, error } = await supabase.storage
    .from('bmm-media')
    .list('', {
      limit: 1000,
      offset: 0,
    });

  if (error) throw error;

  // Get public URLs for all files
  const mediaWithUrls = await Promise.all(
    data.map(async (file) => {
      const { data: { publicUrl } } = supabase.storage
        .from('bmm-media')
        .getPublicUrl(file.name);

      return {
        id: file.name,
        filename: file.name,
        url: publicUrl,
        mimeType: file.metadata?.mimeType || 'image/jpeg',
        size: file.metadata?.size || 0,
        uploadedAt: file.created_at,
      };
    })
  );

  return mediaWithUrls;
};