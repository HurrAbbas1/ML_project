
'use client';

import { useState, type ChangeEvent, type FormEvent, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { UploadCloud, Loader2, AlertTriangle, FileImage, Microscope, Info, Brain, ArrowRight, HeartPulse } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import type { ClassifyParticlesOutput } from '@/ai/flows/classify-particles-flow';
import { processParticleClassification } from '@/app/actions';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from '@/components/ui/separator';


type Particle = ClassifyParticlesOutput['classifiedParticles'][0];

interface ClassifiedParticleDisplayProps {
  particle: Particle;
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
        {particle.boundingBox && (
            <p className="text-xs text-muted-foreground mt-2">
                BB: x: {particle.boundingBox.x.toFixed(2)}, y: {particle.boundingBox.y.toFixed(2)}, w: {particle.boundingBox.width.toFixed(2)}, h: {particle.boundingBox.height.toFixed(2)}
            </p>
        )}
      </CardContent>
    </Card>
  );
}


export function ImageDxClientPage() {
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [classificationResult, setClassificationResult] = useState<ClassifyParticlesOutput | null>(null);
  const [isClassifying, setIsClassifying] = useState(false);
  const [classificationError, setClassificationError] = useState<string | null>(null);

  const [imageNaturalDimensions, setImageNaturalDimensions] = useState<{ width: number; height: number } | null>(null);
  const [imageRenderConfig, setImageRenderConfig] = useState<{
    offsetX: number;
    offsetY: number;
    renderedWidth: number;
    renderedHeight: number;
  } | null>(null);

  const { toast } = useToast();
  const router = useRouter(); 
  const imageRef = useRef<HTMLImageElement>(null);

  const PREVIEW_CONTAINER_WIDTH = 500;
  const PREVIEW_CONTAINER_HEIGHT = 300;

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setClassificationError(null);
    setClassificationResult(null);
    setImageNaturalDimensions(null); 
    setImageRenderConfig(null); 

    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 4 * 1024 * 1024) { 
        setClassificationError('File size exceeds 4MB limit. Please choose a smaller file.');
        setImagePreview(null);
        setFile(null);
        event.target.value = ''; 
        return;
      }
      if (!selectedFile.type.startsWith('image/')) {
        setClassificationError('Invalid file type. Please select an image file (PNG, JPG, etc.).');
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

  const handleImageLoad = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = event.currentTarget;
    const naturalWidth = img.naturalWidth;
    const naturalHeight = img.naturalHeight;

    if (naturalWidth === 0 || naturalHeight === 0) {
        console.error("Image natural dimensions are zero.");
        setImageNaturalDimensions(null);
        setImageRenderConfig(null);
        return;
    }
    setImageNaturalDimensions({ width: naturalWidth, height: naturalHeight });

    const containerWidth = PREVIEW_CONTAINER_WIDTH;
    const containerHeight = PREVIEW_CONTAINER_HEIGHT;

    const scaleX = containerWidth / naturalWidth;
    const scaleY = containerHeight / naturalHeight;
    const scale = Math.min(scaleX, scaleY);

    const renderedWidth = naturalWidth * scale;
    const renderedHeight = naturalHeight * scale;

    const offsetX = (containerWidth - renderedWidth) / 2;
    const offsetY = (containerHeight - renderedHeight) / 2;
    
    setImageRenderConfig({
      offsetX,
      offsetY,
      renderedWidth,
      renderedHeight,
    });
  };

  const handleClassificationSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file || !imagePreview) {
      setClassificationError('Please select an image file to classify.');
      return;
    }

    setIsClassifying(true);
    setClassificationError(null);
    setClassificationResult(null);

    try {
      const result = await processParticleClassification(imagePreview);
      if ('error' in result) {
        const fullError = result.error + (result.details ? ` (Details: ${result.details})` : '');
        setClassificationError(fullError);
        toast({
          variant: 'destructive',
          title: 'Classification Failed',
          description: fullError,
        });
      } else {
        setClassificationResult(result);
        if (result.classifiedParticles.length === 0) {
            toast({
                title: 'Classification Complete',
                description: 'No specific particles identified based on the image.',
            });
        } else {
            toast({
                title: 'Classification Successful',
                description: 'Particles identified. Review results and proceed to diagnosis if desired.',
            });
        }
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unexpected error occurred.';
      setClassificationError(errorMessage);
      toast({
        variant: 'destructive',
        title: 'Classification Error',
        description: errorMessage,
      });
    } finally {
      setIsClassifying(false);
    }
  };

  const handleProceedToDiagnosis = () => {
    if (imagePreview) {
      localStorage.setItem('imageForDiagnosis', imagePreview);
      router.push('/diagnosis');
    } else {
      toast({
        variant: 'destructive',
        title: 'Image Not Found',
        description: 'Please upload and classify an image before proceeding to diagnosis.',
      });
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
          Upload a urine sediment image for AI-powered particle classification.
        </p>
        <div>
          <Button variant="secondary" size="lg" asChild className="rounded-full shadow-md hover:shadow-lg transition-shadow">
            <Link href="/health-dashboard" className="flex items-center gap-2">
              <HeartPulse className="h-5 w-5" />
              Go to Health Dashboard
            </Link>
          </Button>
        </div>
      </header>

      <Card className="w-full max-w-2xl shadow-xl rounded-xl">
        <form onSubmit={handleClassificationSubmit}>
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
                disabled={isClassifying}
                className="file:text-primary file:font-semibold file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-primary/10 hover:file:bg-primary/20 transition-colors cursor-pointer"
              />
            </div>

            {imagePreview && (
              <div className="mt-4 border border-dashed border-border p-4 rounded-lg bg-background shadow-inner">
                <p className="text-sm font-medium mb-2 text-foreground/90">Annotated Image Preview:</p>
                <div className="flex justify-center">
                  <div 
                    className="relative bg-muted/30" 
                    style={{
                      width: PREVIEW_CONTAINER_WIDTH,
                      height: PREVIEW_CONTAINER_HEIGHT,
                      overflow: 'hidden',
                    }}
                  >
                    <Image
                      ref={imageRef}
                      src={imagePreview}
                      alt="Uploaded image preview"
                      fill
                      className="object-contain"
                      data-ai-hint="microscopy sample"
                      onLoad={handleImageLoad}
                    />
                    {classificationResult && classificationResult.classifiedParticles && imageRenderConfig && (
                      <>
                        {classificationResult.classifiedParticles.map((particle, index) =>
                          particle.boundingBox ? (
                            <div
                              key={`bbox-${index}`}
                              className="absolute border-2 border-red-500 pointer-events-none"
                              style={{
                                left: `${particle.boundingBox.x * imageRenderConfig.renderedWidth + imageRenderConfig.offsetX}px`,
                                top: `${particle.boundingBox.y * imageRenderConfig.renderedHeight + imageRenderConfig.offsetY}px`,
                                width: `${particle.boundingBox.width * imageRenderConfig.renderedWidth}px`,
                                height: `${particle.boundingBox.height * imageRenderConfig.renderedHeight}px`,
                                boxSizing: 'border-box',
                              }}
                            >
                              <span className="absolute -top-5 left-0 text-xs bg-red-500 text-white p-0.5 rounded-sm whitespace-nowrap">
                                {particle.particleType}
                              </span>
                            </div>
                          ) : null
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
             {classificationError && (
              <Alert variant="destructive" className="mt-4">
                <AlertTriangle className="h-5 w-5" />
                <AlertTitle>Classification Error</AlertTitle>
                <AlertDescription>{classificationError}</AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter className="flex flex-col items-stretch gap-4 p-6 bg-secondary/30 rounded-b-xl">
            <Button type="submit" disabled={isClassifying || !file} className="w-full text-lg py-3 h-auto rounded-md">
              {isClassifying ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Classifying Particles...
                </>
              ) : (
                <>
                  <FileImage className="mr-2 h-5 w-5" />
                  Classify Particles
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {classificationResult && classificationResult.classifiedParticles.length > 0 && !classificationError && (
        <section className="mt-12 w-full max-w-2xl">
          <h2 className="text-3xl font-semibold mb-8 text-center text-primary">Particle Classification List</h2>
          <div className="space-y-6">
            {classificationResult.classifiedParticles
                .sort((a, b) => b.confidence - a.confidence)
                .map((particle, index) => (
                    <ClassifiedParticleDisplay key={`list-particle-${index}`} particle={particle} />
            ))}
          </div>
        </section>
      )}

      {classificationResult && classificationResult.classifiedParticles.length === 0 && !isClassifying && !classificationError && (
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

      {classificationResult && !classificationError && imagePreview && (
        <section className="mt-12 w-full max-w-2xl">
          <Separator className="my-8" />
          <Card className="w-full shadow-xl rounded-xl">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2 text-foreground">
                <Brain className="h-7 w-7 text-accent" />
                Next Step: Potential Diagnosis
              </CardTitle>
              <CardDescription>
                Proceed to the diagnosis page to get potential insights based on the image analysis.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleProceedToDiagnosis} 
                disabled={isClassifying || !imagePreview} 
                className="w-full text-lg py-3 h-auto rounded-md"
              >
                Proceed to Diagnosis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </CardContent>
          </Card>
        </section>
      )}

      <footer className="mt-16 text-center text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} AI Urine Sediment Analysis. All rights reserved.</p>
        <p className="font-semibold">This tool is for research and educational purposes only and is NOT a substitute for professional medical advice.</p>
      </footer>
    </div>
  );
}
