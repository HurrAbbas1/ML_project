
'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Smile, Meh, Frown, Annoyed, Bomb, Zap } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';


interface MoodOption {
  value: string;
  label: string;
  icon: React.ElementType;
}

const moodOptions: MoodOption[] = [
  { value: 'happy', label: 'Happy', icon: Smile },
  { value: 'okay', label: 'Okay', icon: Meh },
  { value: 'sad', label: 'Sad', icon: Frown },
  { value: 'anxious', label: 'Anxious', icon: Annoyed },
  { value: 'stressed', label: 'Stressed', icon: Bomb },
  { value: 'energetic', label: 'Energetic', icon: Zap },
];

interface MoodTrackerFormProps {
  onMoodLog: (mood: string) => void;
}

export function MoodTrackerForm({ onMoodLog }: MoodTrackerFormProps) {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date());
  const [selectedMood, setSelectedMood] = React.useState<string | undefined>(undefined);
  const [notes, setNotes] = React.useState<string>('');
  const { toast } = useToast();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedDate || !selectedMood) {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description: 'Please select a date and a mood.',
      });
      return;
    }

    const moodEntry = {
      date: format(selectedDate, 'PPP'),
      mood: selectedMood,
      notes: notes,
    };

    console.log('Mood Entry:', moodEntry); // For now, just log to console
    onMoodLog(selectedMood); // Call the callback with the selected mood

    toast({
      title: 'Mood Logged!',
      description: (
        <div className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <p className="text-sm text-white"><strong>Date:</strong> {moodEntry.date}</p>
          <p className="text-sm text-white"><strong>Mood:</strong> {moodOptions.find(m => m.value === moodEntry.mood)?.label}</p>
          {moodEntry.notes && <p className="text-sm text-white"><strong>Notes:</strong> {moodEntry.notes}</p>}
        </div>
      ),
    });

    // Optionally reset form fields - user might want to see their selection
    // setSelectedMood(undefined);
    // setNotes('');
    // setSelectedDate(new Date());
  };

  return (
    <Card className="w-full shadow-md rounded-lg border-border">
        <CardHeader>
            <CardTitle className="text-xl font-semibold text-foreground">Log Your Mood</CardTitle>
            <CardDescription className="text-sm text-foreground/70">Keep track of how you're feeling each day.</CardDescription>
        </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6 pt-4 pb-6">
          <div className="space-y-2">
            <Label htmlFor="mood-date" className="text-base font-medium">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="mood-date"
                  variant={'outline'}
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !selectedDate && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-3">
            <Label className="text-base font-medium">How are you feeling?</Label>
            <RadioGroup
              value={selectedMood}
              onValueChange={setSelectedMood}
              className="grid grid-cols-2 sm:grid-cols-3 gap-4"
            >
              {moodOptions.map((option) => {
                const IconComponent = option.icon;
                return (
                  <Label
                    key={option.value}
                    htmlFor={`mood-${option.value}`}
                    className={cn(
                        "flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors",
                        selectedMood === option.value && "border-primary ring-2 ring-primary"
                    )}
                  >
                    <RadioGroupItem value={option.value} id={`mood-${option.value}`} className="sr-only" />
                    <IconComponent className={cn("h-8 w-8 mb-2", selectedMood === option.value ? "text-primary" : "text-muted-foreground")} />
                    <span className="text-sm font-medium">{option.label}</span>
                  </Label>
                );
              })}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mood-notes" className="text-base font-medium">Notes (Optional)</Label>
            <Textarea
              id="mood-notes"
              placeholder="Any thoughts or details about your mood today?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[100px] resize-none"
            />
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4 bg-secondary/30 rounded-b-lg">
          <Button type="submit" className="w-full sm:w-auto" disabled={!selectedMood || !selectedDate}>
            Log Mood
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
