
import Image from 'next/image';
import { Card, CardHeader, CardTitle } from '@/components/ui/card'; // Removed CardContent
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// Removed Badge import

export interface TeamMemberProps {
  name: string;
  role: string; // Role prop is kept for data, but not displayed
  imageUrl: string;
  dataAiHint?: string;
}

export function TeamMemberCard({ name, role, imageUrl, dataAiHint }: TeamMemberProps) {
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <Card className="shadow-lg rounded-lg overflow-hidden text-center bg-card hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="pt-6 pb-4 items-center"> {/* Adjusted padding */}
        <Avatar className="h-24 w-24 mb-3 border-2 border-primary/50">
          <AvatarImage src={imageUrl} alt={name} data-ai-hint={dataAiHint || 'person portrait'} />
          <AvatarFallback className="text-2xl bg-muted text-muted-foreground">{initials}</AvatarFallback>
        </Avatar>
        <CardTitle className="text-xl font-semibold text-primary break-words">{name}</CardTitle>
      </CardHeader>
      {/* CardContent previously holding the role Badge has been removed */}
      {/* Optional: Add CardFooter for links or more info */}
      {/* <CardFooter className="p-4 justify-center">
        <p className="text-xs text-muted-foreground">More info...</p>
      </CardFooter> */}
    </Card>
  );
}
