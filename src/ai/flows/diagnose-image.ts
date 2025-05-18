// diagnose-image.ts
'use server';
/**
 * @fileOverview Diagnoses diseases from an image of urine sediment and provides general educational information about potential treatment approaches.
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
  generalTreatmentInfo: z.string().optional().describe(
    'General, high-level information about common treatment approaches or medication classes relevant to this condition, for educational purposes only. This IS NOT medical advice or a prescription. ALWAYS consult a qualified healthcare professional.'
  ),
});

const DiagnoseImageOutputSchema = z.object({
  diagnoses: z.array(DiagnosisSchema).describe('A ranked list of potential conditions with confidence levels and general educational treatment information.'),
});
export type DiagnoseImageOutput = z.infer<typeof DiagnoseImageOutputSchema>;

export async function diagnoseImage(input: DiagnoseImageInput): Promise<DiagnoseImageOutput> {
  return diagnoseImageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'diagnoseImagePrompt',
  input: {schema: DiagnoseImageInputSchema},
  output: {schema: DiagnoseImageOutputSchema},
  prompt: `You are an expert medical professional specializing in analyzing images of urine sediment for educational purposes.

You will analyze the provided image and identify potential conditions.
Provide a ranked list of potential conditions with confidence levels and brief explanations.

For each potential condition identified, if appropriate, include a 'generalTreatmentInfo' field. This field should contain *only* general, high-level information about common treatment approaches or medication classes that a medical professional *might* consider for such a condition. This information is for educational purposes ONLY and to illustrate what a doctor *might* discuss. It MUST NOT include specific drug dosage, brand names (unless a very common example illustrating a class, e.g., "penicillin-class antibiotics"), or any language that could be interpreted as a direct prescription or medical advice. 
Start this information with: 'General Educational Information: For [Condition Name], common approaches a healthcare professional might discuss include...'. 
ALWAYS conclude this 'generalTreatmentInfo' field with: 'This is not medical advice, a diagnosis, or a prescription. A qualified healthcare professional must be consulted for any medical concerns, diagnosis, and treatment decisions.' 
If no general treatment information is appropriate or safe to provide for a condition, omit the 'generalTreatmentInfo' field for that diagnosis.

Image: {{media url=photoDataUri}}

Format your response as a JSON object with a 'diagnoses' field, which is an array of objects. Each object in the array should have 'condition', 'confidence', 'explanation', and optionally 'generalTreatmentInfo' fields.
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
    // Ensure output is not null and diagnoses is an array, even if empty
    if (!output || !Array.isArray(output.diagnoses)) {
      console.error('AI diagnosis returned invalid or missing diagnoses array:', output);
      return { diagnoses: [] }; // Return empty diagnoses to prevent downstream errors
    }
    return output;
  }
);

