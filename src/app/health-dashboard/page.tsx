
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, HeartPulse, Lightbulb, TrendingUp, Activity, Droplet, Utensils, Smile } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { MoodTrackerForm } from './components/mood-tracker-form';

export const metadata: Metadata = {
  title: 'Health Dashboard & Wellness - ImageDx',
  description: 'Track your health information, log your mood, and discover wellness tips.',
};

export default function HealthDashboardPage() {
  // Placeholder data for wellness tips
  const wellnessTips = [
    { id: 1, title: 'Stay Hydrated', description: 'Drink at least 8 glasses of water a day to keep your body functioning optimally.', icon: Droplet },
    { id: 2, title: 'Move Your Body Regularly', description: 'Aim for at least 30 minutes of moderate exercise most days of the week.', icon: Activity },
    { id: 3, title: 'Prioritize Quality Sleep', description: 'Strive for 7-9 hours of uninterrupted sleep each night for recovery and health.', icon: HeartPulse }, // Using HeartPulse as a proxy for sleep
    { id: 4, title: 'Eat a Balanced Diet', description: 'Focus on whole foods, including plenty of fruits, vegetables, lean proteins, and whole grains.', icon: Utensils },
    { id: 5, title: 'Practice Mindfulness', description: 'Take a few minutes each day for meditation or deep breathing to reduce stress.', icon: Lightbulb }, // Using Lightbulb as a proxy for mindfulness
    { id: 6, title: 'Connect with Others', description: 'Maintain strong social connections for emotional well-being.', icon: Smile },
  ];

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
        {/* Health Tracking Section */}
        <Card className="shadow-xl rounded-xl border-border overflow-hidden">
          <CardHeader className="bg-card pb-4">
            <CardTitle className="text-2xl flex items-center gap-3 text-primary">
              <TrendingUp className="h-7 w-7" />
              Health Information Tracking
            </CardTitle>
            <CardDescription className="text-base text-foreground/70">
              Log your daily mood using the form below. More tracking features coming soon!
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 pb-8">
            <MoodTrackerForm />
            <div className="mt-8 p-6 text-center text-foreground/60 bg-muted/20 rounded-lg border border-dashed border-border/50">
                <p className="text-md font-medium mb-1">More Tracking Features Coming Soon!</p>
                <p className="text-sm">
                Soon you'll be able to log sleep patterns, activity levels, water intake, and more.
                </p>
            </div>
          </CardContent>
        </Card>

        <Separator className="my-8" />

        {/* Wellness Tips Section */}
        <Card className="shadow-xl rounded-xl border-border overflow-hidden">
          <CardHeader className="bg-card pb-4">
            <CardTitle className="text-2xl flex items-center gap-3 text-primary">
              <Lightbulb className="h-7 w-7" />
              Daily Wellness Tips
            </CardTitle>
            <CardDescription className="text-base text-foreground/70">
              Inspiration and advice to help you maintain a healthy and balanced lifestyle.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 pb-8 grid md:grid-cols-2 gap-5">
            {wellnessTips.map((tip) => {
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
      </div>

      <footer className="mt-16 text-center text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} ImageDx. All rights reserved.</p>
        <p>This dashboard is for informational purposes only and not a substitute for professional medical advice.</p>
      </footer>
    </div>
  );
}
