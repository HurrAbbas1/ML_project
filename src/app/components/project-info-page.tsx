
'use client'; // For Link and Button interactions

import Link from 'next/link';
import Image from 'next/image';
import { Users, BookOpen, Microscope, ArrowRight, University } from 'lucide-react'; // Removed Building
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { TeamMemberCard, type TeamMemberProps } from './team-member-card';

const coreResearchTeam: TeamMemberProps[] = [
  { name: 'Sania Akhtar', role: 'Principal Investigator', imageUrl: 'https://placehold.co/100x100.png', dataAiHint: 'person scientist' },
  { name: 'Muhammad Hanif', role: 'Co-Principal Investigator', imageUrl: 'https://placehold.co/100x100.png', dataAiHint: 'person researcher' },
  { name: 'Ahmar Rashid', role: 'Lead Researcher', imageUrl: 'https://placehold.co/100x100.png', dataAiHint: 'person academic' },
  { name: 'Khursheed Aurangzeb', role: 'Researcher', imageUrl: 'https://placehold.co/100x100.png', dataAiHint: 'person professional' },
  { name: 'Ejaz Ahmad Khan', role: 'Researcher', imageUrl: 'https://placehold.co/100x100.png', dataAiHint: 'person expert' },
  { name: 'Hamdi Melih Saraoglu', role: 'Researcher', imageUrl: 'https://placehold.co/100x100.png', dataAiHint: 'person student' },
];

const developerTeam: TeamMemberProps[] = [
  { name: 'Hurr Abbas', role: 'Lead Developer', imageUrl: 'https://placehold.co/100x100.png', dataAiHint: 'person developer' },
];


export function ProjectInfoPage() {
  return (
    <div className="container mx-auto px-4 py-8 sm:py-12 flex flex-col items-center min-h-screen bg-background">
      <header className="mb-10 sm:mb-16 text-center w-full max-w-4xl">
        <div className="inline-flex items-center gap-3 mb-4">
          <Microscope className="h-12 w-12 sm:h-16 sm:w-16 text-primary" />
          <h1 className="text-4xl sm:text-5xl font-bold text-primary tracking-tight">
            AI-Powered Urine Sediment Analysis
          </h1>
        </div>
        <p className="text-lg sm:text-xl text-foreground/80 max-w-3xl mx-auto">
          This project aims to develop an advanced system for the automated detection and classification of particles in urine sediment images using cutting-edge artificial intelligence techniques. Our goal is to provide a supportive tool for preliminary diagnostic insights.
        </p>
        <div className="mt-8">
          <Button size="lg" asChild className="rounded-full shadow-md hover:shadow-lg transition-shadow text-lg py-3 px-8 h-auto">
            <Link href="/image-analysis" className="flex items-center gap-2">
              Go to Particle Classification Tool 
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </header>

      <Separator className="my-8 sm:my-12 w-full max-w-3xl" />

      <section className="w-full max-w-4xl mb-12 sm:mb-16">
        <Card className="shadow-xl rounded-xl border-border overflow-hidden">
          <CardHeader className="bg-card pb-4">
            <CardTitle className="text-2xl sm:text-3xl flex items-center gap-3 text-primary">
              <Users className="h-7 w-7 sm:h-8 sm:w-8" />
              Meet the Team
            </CardTitle>
            <CardDescription className="text-base text-foreground/70">
              The dedicated individuals driving this research forward.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 pb-8">
            <h3 className="text-xl font-semibold mb-4 text-foreground">Core Research Team</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {coreResearchTeam.map((member) => (
                <TeamMemberCard key={member.name} {...member} />
              ))}
            </div>
            <Separator className="my-6"/>
            <h3 className="text-xl font-semibold mb-4 text-foreground">Development Team</h3>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"> {/* Ensures dev team also uses grid */}
              {developerTeam.map((member) => (
                <TeamMemberCard key={member.name} {...member} />
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
      
      <Separator className="my-8 sm:my-12 w-full max-w-3xl" />

      <section className="w-full max-w-4xl mb-12 sm:mb-16">
        <Card className="shadow-xl rounded-xl border-border overflow-hidden">
          <CardHeader className="bg-card pb-4">
            <CardTitle className="text-2xl sm:text-3xl flex items-center gap-3 text-primary">
              <BookOpen className="h-7 w-7 sm:h-8 sm:w-8" />
              Project Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 pb-8 space-y-4 text-base text-foreground/90 leading-relaxed">
            <p>
              Analyzing urine sediment is a critical step in diagnosing various renal and urinary tract diseases. Traditional methods involve manual microscopy, which can be time-consuming and subject to inter-observer variability. This project leverages deep learning models to automate the identification and quantification of elements like red blood cells, white blood cells, epithelial cells, casts, crystals, and bacteria.
            </p>
            <p>
              Our objectives include:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-4">
              <li>Developing a robust AI model for accurate particle classification.</li>
              <li>Creating a user-friendly interface for image upload and analysis.</li>
              <li>Providing preliminary diagnostic suggestions based on classified particle data.</li>
              <li>Offering comprehensive morphological information for educational purposes.</li>
            </ul>
            <p>
              This tool is intended for research and educational purposes, aiming to enhance understanding and potentially assist in future diagnostic workflows, under the guidance of healthcare professionals.
            </p>
          </CardContent>
        </Card>
      </section>

      <Separator className="my-8 sm:my-12 w-full max-w-3xl" />
      
      <section className="w-full max-w-4xl text-center">
        <Card className="shadow-xl rounded-xl border-border overflow-hidden">
          <CardHeader className="bg-card pb-4">
            <CardTitle className="text-2xl sm:text-3xl flex items-center justify-center gap-3 text-primary">
              <University className="h-7 w-7 sm:h-8 sm:w-8" />
              Affiliation
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 pb-8 space-y-6">
            <div className="flex flex-col sm:flex-row justify-around items-center gap-8">
              <div className="flex flex-col items-center">
                <Image src="https://placehold.co/150x80.png" alt="Air University Logo" width={150} height={80} className="mb-2 rounded" data-ai-hint="university logo" />
                <p className="text-lg font-semibold text-foreground">Air University</p>
              </div>
              <div className="flex flex-col items-center">
                <Image src="https://placehold.co/150x80.png" alt="Department Logo" width={150} height={80} className="mb-2 rounded" data-ai-hint="department logo" />
                <p className="text-lg font-semibold text-foreground">Department of Creative Technologies</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <footer className="mt-16 text-center text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} AI Urine Sediment Analysis Project. All rights reserved.</p>
        <p className="font-semibold">This tool is for research and educational purposes only.</p>
      </footer>
    </div>
  );
}
