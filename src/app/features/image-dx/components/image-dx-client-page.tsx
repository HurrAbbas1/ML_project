
'use client';

import { useState, type ChangeEvent, type FormEvent, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { UploadCloud, Loader2, AlertTriangle, FileImage, Microscope, Info, HeartPulse } from 'lucide-react'; // Changed Stethoscope to Microscope

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import type { ClassifyParticlesOutput } from '@/ai/flows/classify-particles-flow'; // Updated import
import { processParticleClassification } from '@/app/actions'; // Updated import
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Simplified display for a single classified particle
interface ClassifiedParticleDisplayProps {
  particle: ClassifyParticlesOutput['classifiedParticles'][0];
}

function ClassifiedParticleDisplay({ particle }: ClassifiedParticleDisplayProps) {
  const confidencePercentage = Math.round(particle.confidence * 100);
  let confidenceBadgeVariant: "default" | "secondary" | "destructive" | "outline" = "secondary";
  
  if (confidencePercentage >= 75) {
    confidenceBadgeVariant = "default"; 
  } else if (confidencePercentage < 40) {
    confidenceBadgeVariant = "destructive";
  }

  return (
    <Card className="mb-4 shadow-lg rounded-lg overflow-hidden bg-card">
      <CardHeader className="pb-3 pt-5 px-5">
        <div className="flex justify-between items-start gap-3">
          <CardTitle className="text-xl font-semibold text-primary flex-grow break-words">
            {particle.particleType}
          </CardTitle>
          <Badge variant={confidenceBadgeVariant} className={`ml-2 text-sm py-1 px-3 shrink-0 ${confidenceBadgeVariant === "default" || confidenceBadgeVariant === "destructive" ? "text-primary-foreground": ""}`}>
            {confidencePercentage}% Confidence
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="px-5 pb-4 pt-2">
        <Progress 
          value={confidencePercentage} 
          aria-label={`${confidencePercentage}% confidence for ${particle.particleType}`} 
          className="h-3 rounded-full [&>div]:bg-primary" 
        />
      </CardContent>
    </Card>
  );
}


export function ImageDxClientPage() {
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [classificationResult, setClassificationResult] = useState<ClassifyParticlesOutput | null>(null); // Renamed
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setClassificationResult(null); // Reset previous results
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
      setError('Please select an image file to classify.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setClassificationResult(null);

    try {
      const result = await processParticleClassification(imagePreview); // Updated function call
      if ('error' in result) {
        const fullError = result.error + (result.details ? ` (Details: ${result.details})` : '');
        setError(fullError);
        toast({
          variant: 'destructive',
          title: 'Classification Failed', // Updated toast title
          description: fullError,
        });
      } else {
        setClassificationResult(result);
        if (result.classifiedParticles.length === 0) { // Updated check
            toast({
                title: 'Classification Complete', // Updated toast title
                description: 'No specific particles identified based on the image.', // Updated message
            });
        } else {
            toast({
                title: 'Classification Successful', // Updated toast title
                description: 'Particles identified. Please review the results.', // Updated message
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
           <Microscope className="h-10 w-10 sm:h-12 sm:w-12 text-primary" />
           <h1 className="text-4xl sm:text-5xl font-bold text-primary tracking-tight">Particle Classification</h1>
        </div>
        <p className="text-lg sm:text-xl text-foreground/80 max-w-2xl mx-auto mb-6">
          Upload an image of urine sediment for AI-powered particle classification.
        </p>
        <div>
          <Button variant="secondary" size="lg" asChild className="rounded-full shadow-md hover:shadow-lg transition-shadow">
            <Link href="/health-dashboard" className="flex items-center gap-2">
              <HeartPulse className="h-5 w-5" />
              Go to Health Dashboard & Wellness
            </Link>
          </Button>
        </div>
      </header>

      <Card className="w-full max-w-2xl shadow-xl rounded-xl">
        <form onSubmit={handleSubmit}>
          <CardHeader className="pt-6">
            <CardTitle className="text-2xl flex items-center gap-2 text-foreground">
              <UploadCloud className="h-7 w-7 text-accent" />
              Upload Image for Classification
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
                  data-ai-hint="microscopy sample"
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
                  Classifying... Please Wait
                </>
              ) : (
                <>
                  <FileImage className="mr-2 h-5 w-5" />
                  Classify Image
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {classificationResult && classificationResult.classifiedParticles.length > 0 && (
        <section className="mt-12 w-full max-w-2xl">
          <h2 className="text-3xl font-semibold mb-8 text-center text-primary">Classification Results</h2>
          <div className="space-y-6">
            {classificationResult.classifiedParticles
                .sort((a, b) => b.confidence - a.confidence) // Sort by confidence
                .map((particle, index) => (
                    <ClassifiedParticleDisplay key={index} particle={particle} />
            ))}
          </div>
        </section>
      )}

      {classificationResult && classificationResult.classifiedParticles.length === 0 && !isLoading && !error && (
        <section className="mt-12 w-full max-w-2xl text-center">
             <Alert className="p-6 shadow-md rounded-lg">
                <Info className="h-5 w-5" />
                <AlertTitle className="text-2xl text-foreground/80">No Particles Identified</AlertTitle>
                <AlertDescription className="mt-2 text-base">
                    The AI classification did not identify any specific particles in the provided image.
                </AlertDescription>
             </Alert>
        </section>
      )}
      <footer className="mt-16 text-center text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} Urine Sediment Particle Classification. All rights reserved.</p>
        <p className="font-semibold">This tool is for research and educational purposes only.</p>
      </footer>
    </div>
  );
}
