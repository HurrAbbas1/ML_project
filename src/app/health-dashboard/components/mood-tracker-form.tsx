
'use client';

import { useState, type FormEvent } from 'react';
import { CalendarIcon, SmileIcon, MehIcon, FrownIcon, BrainIcon, ZapIcon, ThermometerIcon } from 'lucide-react';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export type Mood = "happy" | "okay" | "sad" | "anxious" | "stressed" | "energetic";

const moodOptions: { value: Mood; label: string; icon: JSX.Element }[] = [
  { value: 'happy', label: 'Happy', icon: <SmileIcon className="h-5 w-5 text-green-500" /> },
  { value: 'okay', label: 'Okay', icon: <MehIcon className="h-5 w-5 text-blue-500" /> },
  { value: 'sad', label: 'Sad', icon: <FrownIcon className="h-5 w-5 text-gray-500" /> },
  { value: 'anxious', label: 'Anxious', icon: <BrainIcon className="h-5 w-5 text-purple-500" /> },
  { value: 'stressed', label: 'Stressed', icon: <ThermometerIcon className="h-5 w-5 text-red-500" /> }, // Placeholder
  { value: 'energetic', label: 'Energetic', icon: <ZapIcon className="h-5 w-5 text-yellow-500" /> },
];

interface MoodTrackerFormProps {
  onMoodLog: (mood: Mood) => void;
}

export function MoodTrackerForm({ onMoodLog }: MoodTrackerFormProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedMood, setSelectedMood] = useState<Mood | undefined>(undefined);
  const [notes, setNotes] = useState('');
  const { toast } = useToast();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!date || !selectedMood) {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description: 'Please select a date and a mood.',
      });
      return;
    }

    // In a real app, you would send this data to a backend or state management
    console.log({
      date: format(date, 'PPP'),
      mood: selectedMood,
      notes,
    });

    onMoodLog(selectedMood); // Call the callback

    toast({
      title: 'Mood Logged!',
      description: (
        <div>
          <p>Date: {format(date, 'PPP')}</p>
          <p>Mood: {selectedMood.charAt(0).toUpperCase() + selectedMood.slice(1)}</p>
          {notes && <p>Notes: {notes}</p>}
        </div>
      ),
    });
    // Optionally reset form:
    // setSelectedMood(undefined);
    // setNotes('');
    // setDate(new Date());
  };

  return (
    <Card className="border-none shadow-none">
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6 p-0">
          <div className="space-y-2">
            <Label htmlFor="mood-date" className="text-base font-medium">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal text-base py-2.5 h-auto",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-3">
            <Label className="text-base font-medium">Select Your Mood</Label>
            <RadioGroup
              value={selectedMood}
              onValueChange={(value: string) => setSelectedMood(value as Mood)}
              className="grid grid-cols-2 sm:grid-cols-3 gap-3"
            >
              {moodOptions.map((mood) => (
                <Label
                  key={mood.value}
                  htmlFor={`mood-${mood.value}`}
                  className={cn(
                    "flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors",
                    selectedMood === mood.value && "border-primary ring-2 ring-primary"
                  )}
                >
                  {mood.icon}
                  <span className="mt-2 text-sm font-medium">{mood.label}</span>
                  <RadioGroupItem value={mood.value} id={`mood-${mood.value}`} className="sr-only" />
                </Label>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mood-notes" className="text-base font-medium">Notes (Optional)</Label>
            <Textarea
              id="mood-notes"
              placeholder="Any thoughts or details about your mood..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="text-base"
            />
          </div>
        </CardContent>
        <CardFooter className="mt-6 p-0">
          <Button type="submit" className="w-full text-base py-2.5 h-auto rounded-md" disabled={!date || !selectedMood}>
            Log Mood & Get Tips
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
