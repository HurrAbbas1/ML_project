
'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { ArrowLeft, HeartPulse, Lightbulb, MessageSquare, Droplet, Activity, Utensils, Smile, type LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

// Define an interface for the wellness tip
interface WellnessTip {
  id: number;
  title: string;
  description: string;
  icon: LucideIcon; // Use LucideIcon type
}

// Wellness tips array
const allWellnessTips: WellnessTip[] = [
  { id: 1, title: 'Stay Hydrated', description: 'Drink at least 8 glasses of water a day to keep your body functioning optimally.', icon: Droplet },
  { id: 2, title: 'Move Your Body Regularly', description: 'Aim for at least 30 minutes of moderate exercise most days of the week.', icon: Activity },
  { id: 3, title: 'Prioritize Quality Sleep', description: 'Strive for 7-9 hours of uninterrupted sleep each night for recovery and health.', icon: HeartPulse },
  { id: 4, title: 'Eat a Balanced Diet', description: 'Focus on whole foods, including plenty of fruits, vegetables, lean proteins, and whole grains.', icon: Utensils },
  { id: 5, title: 'Practice Mindfulness', description: 'Take a few minutes each day for meditation or deep breathing to reduce stress.', icon: Lightbulb },
  { id: 6, title: 'Connect with Others', description: 'Maintain strong social connections for emotional well-being.', icon: Smile },
];


export default function HealthDashboardPage() {
  const [healthDescription, setHealthDescription] = useState('');
  const [showWellnessTips, setShowWellnessTips] = useState(false);
  const { toast } = useToast();

  const handleDescriptionSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!healthDescription.trim()) {
      toast({
        variant: 'destructive',
        title: 'Empty Description',
        description: "Please write something about your health before submitting.",
      });
      return;
    }
    setShowWellnessTips(true);
    toast({
      title: 'Noted!',
      description: "Thanks for sharing. Here are some general wellness tips for you.",
    });
  };

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
          Your personal space to reflect on your health and find daily wellness inspiration.
        </p>
      </header>

      <div className="w-full max-w-4xl space-y-10">
        <Card className="shadow-xl rounded-xl border-border overflow-hidden">
          <CardHeader className="bg-card pb-4">
            <CardTitle className="text-2xl flex items-center gap-3 text-primary">
              <MessageSquare className="h-7 w-7" />
              Share How You're Feeling
            </CardTitle>
            <CardDescription className="text-base text-foreground/70">
              Write a few sentences about how you're feeling physically and mentally. We'll then show you some general wellness tips.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleDescriptionSubmit}>
            <CardContent className="pt-6 pb-8 space-y-4">
              <Textarea
                placeholder="For example: Feeling a bit tired today, but overall positive..."
                value={healthDescription}
                onChange={(e) => setHealthDescription(e.target.value)}
                rows={5}
                className="resize-none text-base"
              />
              <Button type="submit" className="w-full sm:w-auto text-base py-2.5 px-6 rounded-md" disabled={!healthDescription.trim()}>
                Get Wellness Tips
              </Button>
            </CardContent>
          </form>
        </Card>

        {showWellnessTips && (
          <>
            <Separator className="my-8" />
            <Card className="shadow-xl rounded-xl border-border overflow-hidden">
              <CardHeader className="bg-card pb-4">
                <CardTitle className="text-2xl flex items-center gap-3 text-primary">
                  <Lightbulb className="h-7 w-7" />
                  Daily Wellness Tips
                </CardTitle>
                <CardDescription className="text-base text-foreground/70">
                  Here's some inspiration and advice to help you maintain a healthy and balanced lifestyle.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 pb-8 grid md:grid-cols-2 gap-5">
                {allWellnessTips.map((tip) => {
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
        )}
      </div>

      <footer className="mt-16 text-center text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} ImageDx. All rights reserved.</p>
        <p>This dashboard is for informational purposes only and not a substitute for professional medical advice.</p>
      </footer>
    </div>
  );
}
