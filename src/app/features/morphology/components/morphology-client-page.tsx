
'use client';

import Image from 'next/image';
import { BookOpen, Shapes, TestTube2, Dna, Microscope } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface ParticleMorphology {
  id: string;
  name: string;
  icon: React.ElementType;
  imageUrl: string;
  imageAlt: string;
  dataAiHint?: string;
  features: string[];
  aiDistinction: string[];
  significance: string[];
}

const particleData: ParticleMorphology[] = [
  {
    id: 'rbc',
    name: 'Red Blood Cells (RBCs)',
    icon: Dna, // Placeholder, consider a more specific icon if available
    imageUrl: 'https://placehold.co/400x300.png',
    imageAlt: 'Microscopic view of Red Blood Cells',
    dataAiHint: 'microscopy rbc',
    features: [
      'Typically appear as biconcave discs, non-nucleated.',
      'Smooth, regular outline.',
      'About 7-8 µm in diameter.',
      'May appear crenated (shrunken with spiked edges) in hypertonic urine or swollen (ghost cells) in hypotonic urine.',
    ],
    aiDistinction: [
      'AI models often identify RBCs by their characteristic circular shape, lack of a nucleus, and uniform size.',
      'Texture analysis and opacity are key differentiators from other circular elements like yeast or oil droplets.',
      'The biconcave shape, if visible, provides a strong distinguishing feature.'
    ],
    significance: [
      'Presence of >3-5 RBCs/HPF (High Power Field) is termed hematuria.',
      'Significant hematuria can indicate glomerular damage (e.g., glomerulonephritis), kidney stones, urinary tract infections, tumors, or contamination.',
      'Dysmorphic RBCs (irregular shapes) often suggest glomerular origin.'
    ],
  },
  {
    id: 'wbc',
    name: 'White Blood Cells (WBCs)',
    icon: TestTube2, // Placeholder
    imageUrl: 'https://placehold.co/400x300.png',
    imageAlt: 'Microscopic view of White Blood Cells',
    dataAiHint: 'microscopy wbc',
    features: [
      'Larger than RBCs, about 10-14 µm in diameter.',
      'Granular cytoplasm and segmented or lobed nucleus (typically neutrophils).',
      'May appear as "glitter cells" (sparkling granules due to Brownian motion) in hypotonic urine.',
    ],
    aiDistinction: [
      'AI differentiates WBCs based on their larger size compared to RBCs, the presence of a multi-lobed nucleus, and granular cytoplasm.',
      'Nuclear morphology is a critical feature for AI classification.'
    ],
    significance: [
      'Presence of >5 WBCs/HPF is termed pyuria and usually indicates inflammation or infection in the urinary tract (e.g., UTI, pyelonephritis).',
      'Increased WBCs can also be seen in non-infectious conditions like interstitial nephritis.'
    ],
  },
  {
    id: 'epithelial',
    name: 'Epithelial Cells',
    icon: Shapes, // Placeholder
    imageUrl: 'https://placehold.co/400x300.png',
    imageAlt: 'Microscopic view of Epithelial Cells',
    dataAiHint: 'microscopy cell',
    features: [
      'Squamous: Large, flat, irregular cells with a small central nucleus. Often from lower urinary tract or contamination.',
      'Transitional (Urothelial): Variable in shape (round, pear-shaped, caudate) with a distinct nucleus. From renal pelvis, ureters, bladder, upper urethra.',
      'Renal Tubular: Round to oval, slightly larger than WBCs, with a large, round, centrally or eccentrically located nucleus. From kidney tubules.',
    ],
    aiDistinction: [
      'AI distinguishes squamous cells by their large size and irregular shape.',
      'Transitional cells are identified by their variable shapes and distinct nuclei.',
      'Renal tubular cells are recognized by their round shape and relatively large nucleus-to-cytoplasm ratio; harder for AI to definitively identify without clear features.'
    ],
    significance: [
      'Squamous: Usually contaminants, not clinically significant unless in large numbers with other signs of infection.',
      'Transitional: A few are normal. Increased numbers can suggest UTI or catheterization. Atypical forms require further investigation.',
      'Renal Tubular: Presence of >2 RTE cells/HPF is significant and indicates tubular damage (e.g., acute tubular necrosis, pyelonephritis, viral infections).',
    ],
  },
  {
    id: 'casts',
    name: 'Casts',
    icon: Microscope, // Placeholder
    imageUrl: 'https://placehold.co/400x300.png',
    imageAlt: 'Microscopic view of Urine Casts',
    dataAiHint: 'microscopy cast',
    features: [
      'Cylindrical structures formed in the renal tubules.',
      'Matrix is Tamm-Horsfall protein.',
      'Types include: Hyaline (clear, colorless), RBC casts, WBC casts, Granular casts (coarse or fine granules), Waxy casts (brittle, sharp edges), Fatty casts (lipid droplets).',
    ],
    aiDistinction: [
      'AI identifies casts by their cylindrical shape and parallel sides.',
      'The type of cast is determined by inclusions (cells, granules, fat) within the matrix, which AI can attempt to classify.'
    ],
    significance: [
      'Hyaline: Few are normal, especially after exercise or dehydration. Increased numbers can indicate renal disease.',
      'RBC casts: Indicate glomerular bleeding (glomerulonephritis). Always pathological.',
      'WBC casts: Indicate renal inflammation or infection (pyelonephritis, interstitial nephritis).',
      'Granular casts: Can indicate renal disease; non-specific but suggest tubular stasis and degeneration.',
      'Waxy casts: Suggest severe, chronic renal disease and tubular stasis.',
      'Fatty casts: Associated with nephrotic syndrome.'
    ],
  },
  {
    id: 'crystals',
    name: 'Crystals',
    icon: Shapes, // Placeholder
    imageUrl: 'https://placehold.co/400x300.png',
    imageAlt: 'Microscopic view of Urine Crystals',
    dataAiHint: 'crystal formation',
    features: [
      'Common in normal urine: Calcium Oxalate (envelope or dumbbell shape), Uric Acid (pleomorphic: rhombic, rosettes, needles), Amorphous phosphates/urates (granular).',
      'Abnormal/Pathological: Cystine (hexagonal plates - cystinuria), Tyrosine (fine needles in sheaves - liver disease), Leucine (oily, spherules with radial striations - liver disease), Cholesterol (notched plates - nephrotic syndrome), Bilirubin (golden-brown needles/granules - liver disease).',
    ],
    aiDistinction: [
      'AI distinguishes crystals based on their distinct geometric shapes, color, and birefringence under polarized light (if that information is part of image metadata or inferred).',
      'Shape recognition is paramount for crystal classification by AI.'
    ],
    significance: [
      'Most common crystals (calcium oxalate, uric acid in acidic urine; amorphous phosphates in alkaline urine) are often not clinically significant but can contribute to stone formation.',
      'Pathological crystals (cystine, tyrosine, leucine, cholesterol, bilirubin) indicate underlying metabolic disorders or disease states.'
    ],
  },
   {
    id: 'bacteria',
    name: 'Bacteria',
    icon: Dna, // Placeholder
    imageUrl: 'https://placehold.co/400x300.png',
    imageAlt: 'Microscopic view of Bacteria',
    dataAiHint: 'microscopy bacteria',
    features: [
      'Small rod-shaped (bacilli) or spherical (cocci) organisms.',
      'May appear individually, in pairs, chains, or clumps.',
      'Motile bacteria may show movement if the sample is fresh.',
    ],
    aiDistinction: [
      'AI detects bacteria by their small size, characteristic shapes (rods/cocci), and often their clustering behavior or high numbers.',
      'Distinguishing from amorphous debris can be challenging for AI and often relies on consistent morphology and distribution patterns.'
    ],
    significance: [
      'Presence of bacteria, especially with WBCs, strongly suggests a Urinary Tract Infection (UTI).',
      'Contamination from collection can also introduce bacteria; clinical correlation is essential.',
    ],
  },
];

export function MorphologyClientPage() {
  return (
    <div className="container mx-auto px-4 py-8 sm:py-12 flex flex-col items-center min-h-screen">
      <header className="mb-10 sm:mb-12 text-center w-full max-w-3xl">
        <div className="inline-flex items-center gap-3 mb-3">
          <BookOpen className="h-10 w-10 sm:h-12 sm:w-12 text-primary" />
          <h1 className="text-4xl sm:text-5xl font-bold text-primary tracking-tight">
            Urine Particle Morphology
          </h1>
        </div>
        <p className="text-lg sm:text-xl text-foreground/80">
          Explore detailed information about various particles found in urine sediment.
        </p>
      </header>

      <Tabs defaultValue={particleData[0]?.id || 'rbc'} className="w-full max-w-4xl">
        <ScrollArea className="w-full pb-2">
            <TabsList className="mb-6 flex-nowrap justify-start">
            {particleData.map((particle) => {
                const ParticleIcon = particle.icon;
                return (
                <TabsTrigger key={particle.id} value={particle.id} className="px-3 py-2 text-sm sm:text-base h-auto whitespace-nowrap">
                    <ParticleIcon className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    {particle.name}
                </TabsTrigger>
                );
            })}
            </TabsList>
            <ScrollBar orientation="horizontal" />
        </ScrollArea>

        {particleData.map((particle) => (
          <TabsContent key={particle.id} value={particle.id}>
            <Card className="shadow-xl rounded-xl border-border overflow-hidden">
              <CardHeader className="bg-card pb-4">
                <div className="flex items-center gap-3 mb-2">
                    <particle.icon className="h-7 w-7 sm:h-8 sm:w-8 text-accent" />
                    <CardTitle className="text-2xl sm:text-3xl text-primary">{particle.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-4 pb-6 space-y-8">
                <div className="grid md:grid-cols-2 gap-6 items-start">
                    <div>
                        <h3 className="text-xl font-semibold mb-3 text-foreground">Sample Image</h3>
                        <div className="rounded-lg overflow-hidden border border-muted shadow-md">
                        <Image
                            src={particle.imageUrl}
                            alt={particle.imageAlt}
                            width={400}
                            height={300}
                            className="object-cover w-full"
                            data-ai-hint={particle.dataAiHint || 'microscopy image'}
                        />
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-xl font-semibold mb-2 text-foreground">Morphological Features</h3>
                            <ul className="list-disc list-inside space-y-1.5 text-base text-foreground/90 pl-1">
                            {particle.features.map((feature, index) => (
                                <li key={`feat-${particle.id}-${index}`}>{feature}</li>
                            ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <h3 className="text-xl font-semibold text-foreground">AI Distinction Overview</h3>
                    <div className="space-y-1.5 text-base text-foreground/90 bg-secondary/30 p-4 rounded-lg shadow-sm">
                        {particle.aiDistinction.map((distinction, index) => (
                            <p key={`ai-${particle.id}-${index}`}>{distinction}</p>
                        ))}
                    </div>
                </div>

                <div className="space-y-3">
                    <h3 className="text-xl font-semibold text-foreground">Diagnostic Significance</h3>
                     <div className="space-y-1.5 text-base text-foreground/90 bg-secondary/30 p-4 rounded-lg shadow-sm">
                        {particle.significance.map((sig, index) => (
                            <p key={`sig-${particle.id}-${index}`}>{sig}</p>
                        ))}
                    </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
       <footer className="mt-16 text-center text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} AI Urine Sediment Analysis. All rights reserved.</p>
        <p className="font-semibold">This information is for educational purposes only and not a substitute for professional medical advice.</p>
      </footer>
    </div>
  );
}
