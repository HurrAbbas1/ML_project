
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Loader2, AlertTriangle, Brain, Microscope, ArrowLeft, Info } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { performImageDiagnosis } from '@/app/actions';
import type { DiagnoseDiseaseOutput } from '@/ai/flows/diagnose-disease-flow';
import { DiagnosisResultCard } from '@/app/features/image-dx/components/diagnosis-result-card'; // Reusing this
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function DiagnosisClientPage() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnoseDiseaseOutput | null>(null);
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [diagnosisError, setDiagnosisError] = useState<string | null>(null);
  const [initialError, setInitialError] = useState<string | null>(null);

  const { toast } = useToast();
  const router = useRouter();

  const PREVIEW_WIDTH = 500;
  const PREVIEW_HEIGHT = 300;

  useEffect(() => {
    const storedImage = localStorage.getItem('imageForDiagnosis');
    if (storedImage) {
      setImagePreview(storedImage);
      // Optional: Remove the item from localStorage after retrieving it if it should only be used once
      // localStorage.removeItem('imageForDiagnosis'); 
    } else {
      setInitialError('No image data found. Please go back to the image analysis page and upload an image first.');
      toast({
        variant: 'destructive',
        title: 'Image Required',
        description: 'Please upload an image on the classification page before attempting diagnosis.',
      });
    }
  }, []);

  const handleDiagnosisSubmit = async () => {
    if (!imagePreview) {
      setDiagnosisError('No image available for diagnosis. Please upload an image first.');
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No image available for diagnosis.',
      });
      return;
    }
    setIsDiagnosing(true);
    setDiagnosisError(null);
    setDiagnosisResult(null);

    try {
      const result = await performImageDiagnosis(imagePreview);
      if ('error' in result) {
        const fullError = result.error + (result.details ? ` (Details: ${result.details})` : '');
        setDiagnosisError(fullError);
        toast({
          variant: 'destructive',
          title: 'Diagnosis Failed',
          description: fullError,
        });
      } else {
        setDiagnosisResult(result);
         if (result.diagnoses.length === 0) {
            toast({
                title: 'Diagnosis Complete',
                description: 'No specific conditions identified based on the image.',
            });
        } else {
            toast({
                title: 'Diagnosis Successful',
                description: 'Potential conditions identified. Please review the results.',
            });
        }
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unexpected error occurred.';
      setDiagnosisError(errorMessage);
      toast({
        variant: 'destructive',
        title: 'Diagnosis Error',
        description: errorMessage,
      });
    } finally {
      setIsDiagnosing(false);
    }
  };

  if (initialError) {
    return (
      <div className="container mx-auto px-4 py-8 sm:py-12 flex flex-col items-center justify-center min-h-screen">
        <Alert variant="destructive" className="w-full max-w-lg">
          <AlertTriangle className="h-5 w-5" />
          <AlertTitle>Error Loading Page</AlertTitle>
          <AlertDescription>{initialError}</AlertDescription>
        </Alert>
        <Button onClick={() => router.push('/image-analysis')} className="mt-6">
          <ArrowLeft className="mr-2 h-5 w-5" />
          Go Back to Image Analysis
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12 flex flex-col items-center min-h-screen">
      <header className="mb-10 sm:mb-12 text-center w-full max-w-2xl">
        <div className="inline-flex items-center gap-3 mb-3">
           <Brain className="h-10 w-10 sm:h-12 sm:w-12 text-primary" />
           <h1 className="text-4xl sm:text-5xl font-bold text-primary tracking-tight">Potential Diagnosis</h1>
        </div>
        <p className="text-lg sm:text-xl text-foreground/80">
          Review potential conditions based on the AI analysis of your uploaded image.
        </p>
         <div className="mt-6">
            <Button variant="outline" size="lg" asChild className="rounded-lg shadow hover:shadow-md transition-shadow">
              <Link href="/image-analysis" className="flex items-center">
                <ArrowLeft className="mr-2 h-5 w-5" />
                Back to Particle Classification
              </Link>
            </Button>
        </div>
      </header>

      {imagePreview && (
        <Card className="w-full max-w-2xl shadow-xl rounded-xl mb-10">
            <CardHeader>
                <CardTitle className="text-2xl text-center text-foreground">Image for Diagnosis</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="mt-4 border border-dashed border-border p-4 rounded-lg bg-background shadow-inner">
                    <div className="flex justify-center">
                    <div 
                        className="relative" 
                        style={{ width: PREVIEW_WIDTH, height: PREVIEW_HEIGHT }}
                    >
                        <Image
                        src={imagePreview}
                        alt="Image for diagnosis"
                        fill
                        className="rounded-md object-contain border border-muted"
                        data-ai-hint="microscopy sample"
                        />
                    </div>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex flex-col items-stretch gap-4 p-6 bg-secondary/30 rounded-b-xl">
                <Button 
                    onClick={handleDiagnosisSubmit} 
                    disabled={isDiagnosing || !imagePreview} 
                    className="w-full text-lg py-3 h-auto rounded-md"
                >
                    {isDiagnosing ? (
                    <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Diagnosing... Please Wait
                    </>
                    ) : (
                        "Perform Diagnosis"
                    )}
                </Button>
            </CardFooter>
        </Card>
      )}

      {diagnosisError && (
        <Alert variant="destructive" className="w-full max-w-2xl mb-8">
            <AlertTriangle className="h-5 w-5" />
            <AlertTitle>Diagnosis Error</AlertTitle>
            <AlertDescription>{diagnosisError}</AlertDescription>
        </Alert>
      )}

      {diagnosisResult && diagnosisResult.diagnoses.length > 0 && !diagnosisError && (
        <section className="w-full max-w-2xl">
          <h2 className="text-3xl font-semibold mb-8 text-center text-primary">Diagnostic Insights</h2>
          <div className="space-y-6">
            {diagnosisResult.diagnoses
                .sort((a, b) => b.confidence - a.confidence)
                .map((diag, index) => (
                <DiagnosisResultCard key={`diag-${index}`} diagnosis={diag} />
            ))}
          </div>
        </section>
      )}

      {diagnosisResult && diagnosisResult.diagnoses.length === 0 && !isDiagnosing && !diagnosisError && (
         <section className="w-full max-w-2xl text-center">
            <Alert className="p-6 shadow-md rounded-lg">
                <Info className="h-5 w-5" />
                <AlertTitle className="text-2xl text-foreground/80">No Specific Conditions Identified</AlertTitle>
                <AlertDescription className="mt-2 text-base">
                    The AI diagnosis did not identify any specific conditions based on the image.
                </AlertDescription>
            </Alert>
        </section>
      )}

      {!imagePreview && !initialError && (
         <section className="w-full max-w-2xl text-center">
            <Alert className="p-6 shadow-md rounded-lg">
                <Microscope className="h-5 w-5" />
                <AlertTitle className="text-2xl text-foreground/80">Ready for Diagnosis</AlertTitle>
                <AlertDescription className="mt-2 text-base">
                    If you have uploaded an image on the classification page, its preview should appear here.
                </AlertDescription>
            </Alert>
        </section>
      )}
      
      <footer className="mt-16 text-center text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} AI Urine Sediment Analysis. All rights reserved.</p>
        <p className="font-semibold">This tool is for research and educational purposes only and is NOT a substitute for professional medical advice.</p>
      </footer>
    </div>
  );
}

    