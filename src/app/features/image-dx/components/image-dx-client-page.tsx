'use client';

import { useState, type ChangeEvent, type FormEvent, useEffect } from 'react';
import Image from 'next/image';
import { UploadCloud, Loader2, AlertTriangle, FileImage, Stethoscope, Info, ShieldAlert } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import type { DiagnoseImageOutput } from '@/ai/flows/diagnose-image';
import { processImageDiagnosis } from '@/app/actions';
import { DiagnosisResultCard } from './diagnosis-result-card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


export function ImageDxClientPage() {
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnoseImageOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setDiagnosisResult(null);
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 4 * 1024 * 1024) { // Limit file size to 4MB
        setError('File size exceeds 4MB limit. Please choose a smaller file.');
        setImagePreview(null);
        setFile(null);
        event.target.value = ''; 
        return;
      }
      if (!selectedFile.type.startsWith('image/')) {
        setError('Invalid file type. Please select an image file (PNG, JPG, etc.).');
        setImagePreview(null);
        setFile(null);
        event.target.value = '';
        return;
      }
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setFile(null);
      setImagePreview(null);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file || !imagePreview) {
      setError('Please select an image file to analyze.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setDiagnosisResult(null);

    try {
      const result = await processImageDiagnosis(imagePreview);
      if ('error' in result) {
        const fullError = result.error + (result.details ? ` (Details: ${result.details})` : '');
        setError(fullError);
        toast({
          variant: 'destructive',
          title: 'Analysis Failed',
          description: fullError,
        });
      } else {
        setDiagnosisResult(result);
        if (result.diagnoses.length === 0) {
            toast({
                title: 'Analysis Complete',
                description: 'No specific conditions identified based on the image.',
            });
        } else {
            toast({
                title: 'Analysis Successful',
                description: 'Potential conditions identified. Please review the results.',
            });
        }
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unexpected error occurred.';
      setError(errorMessage);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (!file) {
      const fileInput = document.getElementById('image-upload') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
    }
  }, [file]);


  return (
    <div className="container mx-auto px-4 py-8 sm:py-12 flex flex-col items-center min-h-screen">
      <header className="mb-10 sm:mb-12 text-center">
        <div className="inline-flex items-center gap-3 mb-3">
           <Stethoscope className="h-10 w-10 sm:h-12 sm:w-12 text-primary" />
           <h1 className="text-4xl sm:text-5xl font-bold text-primary tracking-tight">ImageDx</h1>
        </div>
        <p className="text-lg sm:text-xl text-foreground/80 max-w-2xl mx-auto">
          Upload an image of urine sediment for AI-powered analysis. Get preliminary insights and general educational information.
        </p>
      </header>

      <Alert variant="destructive" className="mb-8 max-w-2xl w-full bg-destructive/10 border-destructive/30 text-destructive">
        <ShieldAlert className="h-6 w-6 text-destructive" />
        <AlertTitle className="font-semibold text-destructive">Important Disclaimer</AlertTitle>
        <AlertDescription className="text-destructive/90">
          This tool provides AI-generated information for educational purposes only. It is NOT a substitute for professional medical advice, diagnosis, or treatment. ALWAYS consult with a qualified healthcare professional for any health concerns or before making any decisions related to your health or treatment. Do not disregard professional medical advice or delay seeking it because of something you have read or seen from this application.
        </AlertDescription>
      </Alert>


      <Card className="w-full max-w-2xl shadow-xl rounded-xl">
        <form onSubmit={handleSubmit}>
          <CardHeader className="pt-6">
            <CardTitle className="text-2xl flex items-center gap-2 text-foreground">
              <UploadCloud className="h-7 w-7 text-accent" />
              Upload Image for Analysis
            </CardTitle>
            <CardDescription className="text-base">
              Select an image file (PNG, JPG, WEBP, GIF). Max 4MB.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-4 pb-6">
            <div className="space-y-2">
              <Label htmlFor="image-upload" className="text-base font-medium">Image File</Label>
              <Input
                id="image-upload"
                type="file"
                accept="image/png, image/jpeg, image/webp, image/gif"
                onChange={handleFileChange}
                disabled={isLoading}
                className="file:text-primary file:font-semibold file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-primary/10 hover:file:bg-primary/20 transition-colors cursor-pointer"
              />
            </div>

            {imagePreview && (
              <div className="mt-4 border border-dashed border-border p-4 rounded-lg bg-background shadow-inner">
                <p className="text-sm font-medium mb-2 text-foreground/90">Image Preview:</p>
                <div className="flex justify-center">
                <Image
                  src={imagePreview}
                  alt="Uploaded image preview"
                  width={500}
                  height={300}
                  className="rounded-md object-contain max-h-[300px] w-auto border border-muted"
                  data-ai-hint="medical sample"
                />
                </div>
              </div>
            )}
             {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertTriangle className="h-5 w-5" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter className="flex flex-col items-stretch gap-4 p-6 bg-secondary/30 rounded-b-xl">
            <Button type="submit" disabled={isLoading || !file} className="w-full text-lg py-3 h-auto rounded-md">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Analyzing... Please Wait
                </>
              ) : (
                <>
                  <FileImage className="mr-2 h-5 w-5" />
                  Analyze Image
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {diagnosisResult && diagnosisResult.diagnoses.length > 0 && (
        <section className="mt-12 w-full max-w-2xl">
          <h2 className="text-3xl font-semibold mb-8 text-center text-primary">Analysis Results</h2>
          <div className="space-y-6">
            {diagnosisResult.diagnoses
                .sort((a, b) => b.confidence - a.confidence)
                .map((diag, index) => (
                    <DiagnosisResultCard key={index} diagnosis={diag} />
            ))}
          </div>
        </section>
      )}

      {diagnosisResult && diagnosisResult.diagnoses.length === 0 && !isLoading && !error && (
        <section className="mt-12 w-full max-w-2xl text-center">
             <Alert className="p-6 shadow-md rounded-lg">
                <Info className="h-5 w-5" />
                <AlertTitle className="text-2xl text-foreground/80">No Conditions Identified</AlertTitle>
                <AlertDescription className="mt-2 text-base">
                    The AI analysis did not identify any specific conditions based on the provided image.
                    This does not guarantee the absence of issues. Remember, this tool is for educational purposes only and not a substitute for professional medical advice. Consult a qualified medical professional for a comprehensive evaluation if you have concerns.
                </AlertDescription>
             </Alert>
        </section>
      )}
    </div>
  );
}
