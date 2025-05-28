// classify-particles-flow.ts
'use server';
/**
 * @fileOverview Classifies particles from an image of urine sediment.
 *
 * - classifyParticles - A function that handles the particle classification process.
 * - ClassifyParticlesInput - The input type for the classifyParticles function.
 * - ClassifyParticlesOutput - The return type for the classifyParticles function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ClassifyParticlesInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of urine sediment, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ClassifyParticlesInput = z.infer<typeof ClassifyParticlesInputSchema>;

const ClassifiedParticleSchema = z.object({
  particleType: z.string().describe('The type of particle identified (e.g., Red Blood Cell, White Blood Cell, Epithelial Cell, Cast, Crystal, Bacteria).'),
  confidence: z.number().describe('The confidence level (0-1) of this particle classification.'),
  // Bounding box can be added in a future iteration.
  // count: z.number().optional().describe('Estimated count of this particle type if applicable.')
});

const ClassifyParticlesOutputSchema = z.object({
  classifiedParticles: z.array(ClassifiedParticleSchema).describe('A list of classified particles found in the image.'),
});
export type ClassifyParticlesOutput = z.infer<typeof ClassifyParticlesOutputSchema>;

export async function classifyParticles(input: ClassifyParticlesInput): Promise<ClassifyParticlesOutput> {
  return classifyParticlesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'classifyParticlesPrompt',
  input: {schema: ClassifyParticlesInputSchema},
  output: {schema: ClassifyParticlesOutputSchema},
  prompt: `You are an expert in analyzing microscopy images of urine sediment. 
Your task is to identify and classify various particles present in the provided image. 
For each distinct type of particle you identify (such as Red Blood Cell, White Blood Cell, Squamous Epithelial Cell, Renal Tubular Epithelial Cell, Hyaline Cast, Granular Cast, Calcium Oxalate Crystal, Uric Acid Crystal, Bacteria, Yeast, etc.), provide its name and a confidence score for its presence.
If you identify multiple instances of the same particle type, list it once with an overall confidence for that type being present.

Image: {{media url=photoDataUri}}

Format your response as a JSON object with a 'classifiedParticles' field, which is an array of objects. Each object in the array should have 'particleType' and 'confidence' fields.
`,
});

const classifyParticlesFlow = ai.defineFlow(
  {
    name: 'classifyParticlesFlow',
    inputSchema: ClassifyParticlesInputSchema,
    outputSchema: ClassifyParticlesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    // Ensure output is not null and classifiedParticles is an array, even if empty
    if (!output || !Array.isArray(output.classifiedParticles)) {
      console.error('AI classification returned invalid or missing classifiedParticles array:', output);
      return { classifiedParticles: [] }; // Return empty array to prevent downstream errors
    }
    return output;
  }
);
