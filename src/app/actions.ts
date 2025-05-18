'use server';

import { diagnoseImage, type DiagnoseImageInput, type DiagnoseImageOutput } from '@/ai/flows/diagnose-image';

export async function processImageDiagnosis(
  photoDataUri: string
): Promise<DiagnoseImageOutput | { error: string; details?: string }> {
  if (!photoDataUri || !photoDataUri.startsWith('data:image/')) {
    return { error: 'Invalid image data. Please upload a valid image file.' };
  }

  // Basic check for common image MIME types, Genkit might handle more specific validation
  const mimeTypeMatch = photoDataUri.match(/^data:(image\/(?:jpeg|png|gif|webp));base64,/);
  if (!mimeTypeMatch) {
    return { error: 'Unsupported image type. Please use JPEG, PNG, GIF, or WEBP.' };
  }

  try {
    const input: DiagnoseImageInput = { photoDataUri };
    const result = await diagnoseImage(input);
    
    if (!result || !Array.isArray(result.diagnoses)) {
        console.error('AI diagnosis returned invalid or missing diagnoses array:', result);
        return { error: 'AI diagnosis failed to return expected results format.' };
    }
    return result;
  } catch (e) {
    console.error('Error processing image diagnosis:', e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred during diagnosis.';
    return { error: 'Failed to diagnose image.', details: errorMessage };
  }
}
