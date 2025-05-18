// diagnose-image.ts
'use server';
/**
 * @fileOverview Diagnoses diseases from an image of urine sediment.
 *
 * - diagnoseImage - A function that handles the image diagnosis process.
 * - DiagnoseImageInput - The input type for the diagnoseImage function.
 * - DiagnoseImageOutput - The return type for the diagnoseImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DiagnoseImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of urine sediment, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type DiagnoseImageInput = z.infer<typeof DiagnoseImageInputSchema>;

const DiagnosisSchema = z.object({
  condition: z.string().describe('The name of the potential condition.'),
  confidence: z.number().describe('The confidence level (0-1) of the diagnosis.'),
  explanation: z.string().describe('A brief explanation of why this condition is suspected.'),
});

const DiagnoseImageOutputSchema = z.object({
  diagnoses: z.array(DiagnosisSchema).describe('A ranked list of potential conditions with confidence levels.'),
});
export type DiagnoseImageOutput = z.infer<typeof DiagnoseImageOutputSchema>;

export async function diagnoseImage(input: DiagnoseImageInput): Promise<DiagnoseImageOutput> {
  return diagnoseImageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'diagnoseImagePrompt',
  input: {schema: DiagnoseImageInputSchema},
  output: {schema: DiagnoseImageOutputSchema},
  prompt: `You are an expert medical professional specializing in diagnosing diseases from images of urine sediment.

You will analyze the provided image and identify potential conditions.
Provide a ranked list of potential conditions with confidence levels and brief explanations.

Image: {{media url=photoDataUri}}

Format your response as a JSON object with a 'diagnoses' field, which is an array of objects. Each object in the array should have 'condition', 'confidence', and 'explanation' fields.
`,
});

const diagnoseImageFlow = ai.defineFlow(
  {
    name: 'diagnoseImageFlow',
    inputSchema: DiagnoseImageInputSchema,
    outputSchema: DiagnoseImageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
