
'use server';

import { classifyParticles, type ClassifyParticlesInput, type ClassifyParticlesOutput } from '@/ai/flows/classify-particles-flow';
import { diagnoseDisease, type DiagnoseDiseaseInput, type DiagnoseDiseaseOutput } from '@/ai/flows/diagnose-disease-flow';

export async function processParticleClassification(
  photoDataUri: string
): Promise<ClassifyParticlesOutput | { error: string; details?: string }> {
  if (!photoDataUri || !photoDataUri.startsWith('data:image/')) {
    return { error: 'Invalid image data. Please upload a valid image file.' };
  }

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

export async function performImageDiagnosis(
  photoDataUri: string
): Promise<DiagnoseDiseaseOutput | { error: string; details?: string }> {
  if (!photoDataUri || !photoDataUri.startsWith('data:image/')) {
    return { error: 'Invalid image data. Please provide a valid image.' };
  }
  const mimeTypeMatch = photoDataUri.match(/^data:(image\/(?:jpeg|png|gif|webp));base64,/);
  if (!mimeTypeMatch) {
    return { error: 'Unsupported image type for diagnosis. Please use JPEG, PNG, GIF, or WEBP.' };
  }

  try {
    const input: DiagnoseDiseaseInput = { photoDataUri };
    const result = await diagnoseDisease(input);

    if (!result || !Array.isArray(result.diagnoses)) {
      console.error('AI diagnosis returned invalid or missing diagnoses array:', result);
      return { error: 'AI diagnosis failed to return expected results format.' };
    }
    return result;
  } catch (e) {
    console.error('Error performing image diagnosis:', e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred during diagnosis.';
    return { error: 'Failed to perform image diagnosis.', details: errorMessage };
  }
}
