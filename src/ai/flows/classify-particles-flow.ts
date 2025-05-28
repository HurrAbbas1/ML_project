
// classify-particles-flow.ts
'use server';
/**
 * @fileOverview Classifies particles from an image of urine sediment, including bounding boxes.
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

const BoundingBoxSchema = z.object({
    x: z.number().min(0).max(1).describe('Normalized x-coordinate of the top-left corner (0-1).'),
    y: z.number().min(0).max(1).describe('Normalized y-coordinate of the top-left corner (0-1).'),
    width: z.number().min(0).max(1).describe('Normalized width of the box (0-1).'),
    height: z.number().min(0).max(1).describe('Normalized height of the box (0-1).'),
}).describe('Normalized bounding box of the detected particle.');

const ClassifiedParticleSchema = z.object({
  particleType: z.string().describe('The type of particle identified (e.g., Red Blood Cell, White Blood Cell, Epithelial Cell, Cast, Crystal, Bacteria).'),
  confidence: z.number().describe('The confidence level (0-1) of this particle classification.'),
  boundingBox: BoundingBoxSchema.optional().describe('The normalized bounding box (x,y,width,height from 0 to 1) of the particle in the image.'),
});

const ClassifyParticlesOutputSchema = z.object({
  classifiedParticles: z.array(ClassifiedParticleSchema).describe('A list of classified particles found in the image, potentially with bounding boxes.'),
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
For each individual particle instance you identify (such as Red Blood Cell, White Blood Cell, Squamous Epithelial Cell, Renal Tubular Epithelial Cell, Hyaline Cast, Granular Cast, Calcium Oxalate Crystal, Uric Acid Crystal, Bacteria, Yeast, etc.), provide its name, a confidence score for its presence, and its normalized bounding box. 
The bounding box should be an object with 'x', 'y', 'width', and 'height' fields, where 'x' and 'y' are the normalized coordinates (0 to 1) of the top-left corner, and 'width' and 'height' are the normalized dimensions (0 to 1) of the particle.

Image: {{media url=photoDataUri}}

Format your response as a JSON object with a 'classifiedParticles' field, which is an array of objects. Each object in the array should have 'particleType', 'confidence', and 'boundingBox' fields.
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

