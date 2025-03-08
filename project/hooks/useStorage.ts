import { useState } from 'react';
import { Platform } from 'react-native';
import { decode } from 'base64-js';
import { supabase } from '@/lib/supabase';

export function useStorage() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const uploadAvatar = async (base64Image: string, path: string): Promise<string | null> => {
    try {
      setUploading(true);
      setError(null);

      // Extract the base64 data (remove data:image/xyz;base64, prefix)
      const base64Data = base64Image.split(',')[1];
      
      // Convert base64 to Uint8Array
      const binaryData = decode(base64Data);

      // Create file name with timestamp to avoid conflicts
      const fileName = `${Date.now()}.jpg`;
      const filePath = `${path}/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('avatars')
        .upload(filePath, binaryData, {
          contentType: 'image/jpeg',
          upsert: true,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Clear preview URL after successful upload
      setPreviewUrl(null);

      return publicUrl;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to upload avatar';
      setError(message);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const pickImage = async (): Promise<string | null> => {
    if (Platform.OS === 'web') {
      return new Promise((resolve) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        
        input.onchange = async (e) => {
          const file = (e.target as HTMLInputElement).files?.[0];
          if (!file) {
            resolve(null);
            return;
          }

          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result as string;
            // Set preview URL immediately for local display
            setPreviewUrl(result);
            resolve(result);
          };
          reader.onerror = () => {
            setError('Failed to read file');
            resolve(null);
          };
          reader.readAsDataURL(file);
        };

        input.click();
      });
    }
    
    return null;
  };

  return {
    uploadAvatar,
    pickImage,
    uploading,
    error,
    previewUrl,
  };
}