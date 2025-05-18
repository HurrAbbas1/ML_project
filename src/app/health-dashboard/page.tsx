
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, HeartPulse, Lightbulb, TrendingUp, Activity, Droplet, Utensils, Smile } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { MoodTrackerForm } from './components/mood-tracker-form';

// Note: Metadata is typically handled in Server Components or layout files.
// Since this is now a Client Component, 'export const metadata' is removed.
// If specific metadata for this page is crucial, consider adding a layout.tsx
// in the /health-dashboard directory.

// Placeholder data for wellness tips
const allWellnessTips = [
  { id: 1, title: 'Stay Hydrated', description: 'Drink at least 8 glasses of water a day to keep your body functioning optimally.', icon: Droplet, moods: ['happy', 'okay', 'sad', 'anxious', 'stressed', 'energetic'] },
  { id: 2, title: 'Move Your Body Regularly', description: 'Aim for at least 30 minutes of moderate exercise most days of the week.', icon: Activity, moods: ['happy', 'okay', 'stressed', 'energetic'] },
  { id: 3, title: 'Prioritize Quality Sleep', description: 'Strive for 7-9 hours of uninterrupted sleep each night for recovery and health.', icon: HeartPulse, moods: ['okay', 'sad', 'anxious', 'stressed'] },
  { id: 4, title: 'Eat a Balanced Diet', description: 'Focus on whole foods, including plenty of fruits, vegetables, lean proteins, and whole grains.', icon: Utensils, moods: ['happy', 'okay', 'sad', 'anxious', 'stressed', 'energetic'] },
  { id: 5, title: 'Practice Mindfulness', description: 'Take a few minutes each day for meditation or deep breathing to reduce stress.', icon: Lightbulb, moods: ['okay', 'sad', 'anxious', 'stressed'] },
  { id: 6, title: 'Connect with Others', description: 'Maintain strong social connections for emotional well-being.', icon: Smile, moods: ['happy', 'okay', 'sad', 'anxious', 'energetic'] },
];


export default function HealthDashboardPage() {
  const [currentMood, setCurrentMood] = useState<string | undefined>(undefined);

  const handleMoodLog = (moodValue: string) => {
    setCurrentMood(moodValue);
  };

  const getFilteredWellnessTips = () => {
    if (!currentMood) {
      return allWellnessTips; // Show all tips if no mood is logged yet
    }
    return allWellnessTips.filter(tip => tip.moods.includes(currentMood));
  };

  const displayedWellnessTips = getFilteredWellnessTips();

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12 flex flex-col items-center min-h-screen bg-background">
      <header className="mb-10 sm:mb-12 w-full">
        <div className="relative flex justify-center items-center mb-6">
          <div className="absolute left-0">
            <Button variant="outline" size="lg" asChild className="rounded-lg shadow hover:shadow-md transition-shadow">
              <Link href="/" className="flex items-center">
                <ArrowLeft className="mr-2 h-5 w-5" />
                Back to Analysis
              </Link>
            </Button>
          </div>
          <div className="inline-flex items-center gap-3">
            <HeartPulse className="h-10 w-10 sm:h-12 sm:w-12 text-primary" />
            <h1 className="text-3xl sm:text-4xl font-bold text-primary tracking-tight">
              Health Dashboard
            </h1>
          </div>
        </div>
        <p className="text-lg sm:text-xl text-foreground/80 max-w-2xl mx-auto text-center">
          Your personal space to track health metrics, log your mood, and find daily wellness inspiration.
        </p>
      </header>

      <div className="w-full max-w-4xl space-y-10">
        {/* Mood Logging Section */}
        <Card className="shadow-xl rounded-xl border-border overflow-hidden">
          <CardHeader className="bg-card pb-4">
            <CardTitle className="text-2xl flex items-center gap-3 text-primary">
              <TrendingUp className="h-7 w-7" /> 
              How Are You Feeling Today?
            </CardTitle>
            <CardDescription className="text-base text-foreground/70">
              Log your mood below. Based on how you're feeling, we'll suggest some wellness tips.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 pb-8">
            <MoodTrackerForm onMoodLog={handleMoodLog} />
          </CardContent>
        </Card>

        <Separator className="my-8" />

        {/* Wellness Tips Section */}
        <Card className="shadow-xl rounded-xl border-border overflow-hidden">
          <CardHeader className="bg-card pb-4">
            <CardTitle className="text-2xl flex items-center gap-3 text-primary">
              <Lightbulb className="h-7 w-7" />
              {currentMood ? "Wellness Tips For You" : "Daily Wellness Tips"}
            </CardTitle>
            <CardDescription className="text-base text-foreground/70">
              {currentMood ? `Here are some tips that might be helpful for when you're feeling ${currentMood}:` : "Inspiration and advice to help you maintain a healthy and balanced lifestyle."}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 pb-8 grid md:grid-cols-2 gap-5">
            {displayedWellnessTips.length > 0 ? displayedWellnessTips.map((tip) => {
              const TipIcon = tip.icon;
              return (
                <Card key={tip.id} className="bg-secondary/20 border-secondary shadow-sm rounded-lg hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2 pt-4 px-5">
                     <div className="flex items-center gap-3">
                        <TipIcon className="h-6 w-6 text-accent" />
                        <CardTitle className="text-lg text-accent font-semibold">{tip.title}</CardTitle>
                     </div>
                  </CardHeader>
                  <CardContent className="pb-4 px-5">
                    <p className="text-foreground/90 text-sm leading-relaxed">{tip.description}</p>
                  </CardContent>
                </Card>
              );
            }) : (
              <p className="text-foreground/70 md:col-span-2 text-center">No specific tips for this mood combination right now, but general wellness is always a good idea!</p>
            )}
          </CardContent>
        </Card>
      </div>

      <footer className="mt-16 text-center text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} ImageDx. All rights reserved.</p>
        <p>This dashboard is for informational purposes only and not a substitute for professional medical advice.</p>
      </footer>
    </div>
  );
}
