
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, HeartPulse, Lightbulb, MessageSquare, Droplet, Activity, Utensils, Smile, Brain, Users, Moon, Sun } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { MoodTrackerForm, type Mood } from './components/mood-tracker-form'; 

interface WellnessTip {
  id: number;
  title: string;
  description: string;
  icon: LucideIcon;
  moods: Mood[]; 
}

const allWellnessTips: WellnessTip[] = [
  { id: 1, title: 'Stay Hydrated', description: 'Drink at least 8 glasses of water a day to keep your body functioning optimally.', icon: Droplet, moods: ["happy", "okay", "sad", "anxious", "stressed", "energetic"] },
  { id: 2, title: 'Move Your Body Regularly', description: 'Aim for at least 30 minutes of moderate exercise. Even a short walk can boost your mood.', icon: Activity, moods: ["happy", "okay", "sad", "anxious", "stressed", "energetic"] },
  { id: 3, title: 'Prioritize Quality Sleep', description: 'Strive for 7-9 hours of uninterrupted sleep. Good sleep is crucial for managing stress and anxiety.', icon: Moon, moods: ["sad", "anxious", "stressed", "okay"] },
  { id: 4, title: 'Eat a Balanced Diet', description: 'Focus on whole foods, including plenty of fruits, vegetables, lean proteins, and whole grains for sustained energy.', icon: Utensils, moods: ["happy", "okay", "sad", "stressed", "energetic"] },
  { id: 5, title: 'Practice Mindfulness', description: 'Take 5-10 minutes for meditation or deep breathing to calm your mind, especially when feeling anxious or stressed.', icon: Brain, moods: ["anxious", "stressed", "okay", "sad"] },
  { id: 6, title: 'Connect with Others', description: 'Reach out to a friend or family member. Social connection is vital for emotional well-being.', icon: Users, moods: ["sad", "anxious", "okay", "happy"] },
  { id: 7, title: 'Limit Caffeine and Sugar', description: 'Especially if feeling anxious or having trouble sleeping, as they can exacerbate these feelings.', icon: Utensils, moods: ["anxious", "stressed"] },
  { id: 8, title: 'Engage in a Hobby', description: 'Doing something you enjoy can take your mind off worries and improve your mood.', icon: Lightbulb, moods: ["sad", "anxious", "okay", "happy", "stressed"]},
  { id: 9, title: 'Set Small, Achievable Goals', description: 'This can provide a sense of accomplishment, especially when feeling down or overwhelmed.', icon: Sun, moods: ["sad", "stressed", "okay"] },
  { id: 10, title: 'Get Some Sunlight', description: 'Exposure to natural light can improve mood and energy levels.', icon: Sun, moods: ["sad", "energetic", "okay", "happy"] },
  { id: 11, title: 'Channel Your Energy', description: 'When feeling energetic, use it for a productive task or a vigorous workout.', icon: Activity, moods: ["energetic", "happy"] },
];


export default function HealthDashboardPage() {
  const [currentMood, setCurrentMood] = useState<Mood | null>(null);
  const [relevantTips, setRelevantTips] = useState<WellnessTip[]>(allWellnessTips);
  const [wellnessTipsTitle, setWellnessTipsTitle] = useState<string>("Daily Wellness Tips");

  const handleMoodLog = (mood: Mood) => {
    setCurrentMood(mood);
    if (mood) {
      const filteredTips = allWellnessTips.filter(tip => tip.moods.includes(mood));
      setRelevantTips(filteredTips.length > 0 ? filteredTips : allWellnessTips.slice(0, 3)); 
      setWellnessTipsTitle(`Wellness Tips for Feeling ${mood.charAt(0).toUpperCase() + mood.slice(1)}`);
    } else {
      setRelevantTips(allWellnessTips);
      setWellnessTipsTitle("Daily Wellness Tips");
    }
  };

  useEffect(() => {
    if (!currentMood) {
      setRelevantTips(allWellnessTips);
      setWellnessTipsTitle("Daily Wellness Tips");
    }
  }, [currentMood]);


  return (
    <div className="container mx-auto px-4 py-8 sm:py-12 flex flex-col items-center min-h-screen bg-background">
      <header className="mb-10 sm:mb-12 w-full">
        <div className="relative flex justify-center items-center mb-6">
          <div className="absolute left-0">
            <Button variant="outline" size="lg" asChild className="rounded-lg shadow hover:shadow-md transition-shadow">
              <Link href="/image-analysis" className="flex items-center">
                <ArrowLeft className="mr-2 h-5 w-5" />
                Back to Classification Tool
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
          Your personal space to reflect on your health and find daily wellness inspiration.
        </p>
      </header>

      <div className="w-full max-w-4xl space-y-10">
        <Card className="shadow-xl rounded-xl border-border overflow-hidden">
          <CardHeader className="bg-card pb-4">
            <CardTitle className="text-2xl flex items-center gap-3 text-primary">
              <MessageSquare className="h-7 w-7" />
              How Are You Feeling Today?
            </CardTitle>
            <CardDescription className="text-base text-foreground/70">
              Log your mood and get personalized wellness tips. Your entries are for your eyes only.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 pb-8 space-y-4">
            <MoodTrackerForm onMoodLog={handleMoodLog} />
          </CardContent>
        </Card>

        <>
          <Separator className="my-8" />
          <Card className="shadow-xl rounded-xl border-border overflow-hidden">
            <CardHeader className="bg-card pb-4">
              <CardTitle className="text-2xl flex items-center gap-3 text-primary">
                <Lightbulb className="h-7 w-7" />
                {wellnessTipsTitle}
              </CardTitle>
              <CardDescription className="text-base text-foreground/70">
                {currentMood ? `Here's some inspiration based on how you're feeling.` : `General advice to help you maintain a healthy lifestyle.`}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 pb-8 grid md:grid-cols-2 gap-5">
              {relevantTips.map((tip) => {
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
              })}
            </CardContent>
          </Card>
        </>
      </div>

      <footer className="mt-16 text-center text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} ImageDx. All rights reserved.</p>
        <p className="font-semibold">This dashboard is for informational purposes only and not a substitute for professional medical advice.</p>
      </footer>
    </div>
  );
}
