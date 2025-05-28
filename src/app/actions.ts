
'use server';

import { classifyParticles, type ClassifyParticlesInput, type ClassifyParticlesOutput } from '@/ai/flows/classify-particles-flow';

export async function processParticleClassification(
  photoDataUri: string
): Promise<ClassifyParticlesOutput | { error: string; details?: string }> {
  if (!photoDataUri || !photoDataUri.startsWith('data:image/')) {
    return { error: 'Invalid image data. Please upload a valid image file.' };
  }

  // Basic check for common image MIME types, Genkit might handle more specific validation
  const mimeTypeMatch = photoDataUri.match(/^data:(image\/(?:jpeg|png|gif|webp));base64,/);
  if (!mimeTypeMatch) {
    return { error: 'Unsupported image type. Please use JPEG, PNG, GIF, or WEBP.' };
  }

  try {
    const input: ClassifyParticlesInput = { photoDataUri };
    const result = await classifyParticles(input);
    
    if (!result || !Array.isArray(result.classifiedParticles)) {
        console.error('AI classification returned invalid or missing classifiedParticles array:', result);
        return { error: 'AI classification failed to return expected results format.' };
    }
    return result;
  } catch (e) {
    console.error('Error processing particle classification:', e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred during classification.';
    return { error: 'Failed to classify particles in image.', details: errorMessage };
  }
}
