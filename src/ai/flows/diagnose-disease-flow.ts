
'use server';
/**
 * @fileOverview Diagnoses potential diseases from an image of urine sediment.
 *
 * - diagnoseDisease - A function that handles the disease diagnosis process.
 * - DiagnoseDiseaseInput - The input type for the diagnoseDisease function.
 * - DiagnoseDiseaseOutput - The return type for the diagnoseDisease function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DiagnoseDiseaseInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of urine sediment, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type DiagnoseDiseaseInput = z.infer<typeof DiagnoseDiseaseInputSchema>;

const DiagnosisSchema = z.object({
  condition: z.string().describe('The name of the potential condition (e.g., Urinary Tract Infection, Hematuria, Glomerulonephritis).'),
  confidence: z.number().min(0).max(1).describe('The confidence level (0-1) of this diagnosis.'),
  explanation: z.string().describe('A brief explanation supporting this diagnosis, based on visual cues from the image.'),
});

const DiagnoseDiseaseOutputSchema = z.object({
  diagnoses: z.array(DiagnosisSchema).describe('A list of potential conditions with confidence levels and explanations.'),
});
export type DiagnoseDiseaseOutput = z.infer<typeof DiagnoseDiseaseOutputSchema>;

export async function diagnoseDisease(input: DiagnoseDiseaseInput): Promise<DiagnoseDiseaseOutput> {
  return diagnoseDiseaseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'diagnoseDiseasePrompt',
  input: {schema: DiagnoseDiseaseInputSchema},
  output: {schema: DiagnoseDiseaseOutputSchema},
  prompt: `You are an expert medical diagnostic AI specializing in analyzing microscopy images of urine sediment to identify potential diseases.
Based on the provided image, suggest potential conditions such as Urinary Tract Infection (UTI), Hematuria, Glomerulonephritis, Pyelonephritis, or others relevant to urine sediment analysis.
For each suggested condition, provide:
1. The name of the condition.
2. A confidence score (between 0 and 1) for your diagnosis.
3. A brief explanation supporting the diagnosis, highlighting visual cues in the image that point to this condition (e.g., presence of many white blood cells and bacteria for UTI, significant red blood cells for Hematuria).

Image: {{media url=photoDataUri}}

Format your response as a JSON object with a 'diagnoses' field, which is an array of objects. Each object in the array should have 'condition', 'confidence', and 'explanation' fields.
If no specific diseases can be confidently suggested, return an empty 'diagnoses' array.
`,
});

const diagnoseDiseaseFlow = ai.defineFlow(
  {
    name: 'diagnoseDiseaseFlow',
    inputSchema: DiagnoseDiseaseInputSchema,
    outputSchema: DiagnoseDiseaseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output || !Array.isArray(output.diagnoses)) {
      console.error('AI diagnosis returned invalid or missing diagnoses array:', output);
      return { diagnoses: [] }; 
    }
    return output;
  }
);
