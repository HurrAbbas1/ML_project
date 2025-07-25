
import type { DiagnoseDiseaseOutput } from '@/ai/flows/diagnose-disease-flow'; // Updated import
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

// Extracts the type for a single diagnosis object from the DiagnoseDiseaseOutput type.
type Diagnosis = DiagnoseDiseaseOutput['diagnoses'][0];

interface DiagnosisResultCardProps {
  diagnosis: Diagnosis;
}

export function DiagnosisResultCard({ diagnosis }: DiagnosisResultCardProps) {
  const confidencePercentage = Math.round(diagnosis.confidence * 100);

  let confidenceBadgeVariant: "default" | "secondary" | "destructive" | "outline" = "secondary";
  let confidenceBadgeTextClass = "";

  if (confidencePercentage >= 75) {
    confidenceBadgeVariant = "default"; 
  } else if (confidencePercentage < 40) {
    confidenceBadgeVariant = "destructive";
  } else {
    confidenceBadgeVariant = "secondary"; 
  }
  
  if (confidenceBadgeVariant === "default" || confidenceBadgeVariant === "destructive") {
    confidenceBadgeTextClass = "text-primary-foreground"; 
  }


  return (
    <Card className="mb-4 shadow-lg rounded-lg overflow-hidden bg-card">
      <CardHeader className="pb-3 pt-5 px-5">
        <div className="flex justify-between items-start gap-3">
          <CardTitle className="text-xl font-semibold text-primary flex-grow break-words">
            {diagnosis.condition}
          </CardTitle>
          <Badge variant={confidenceBadgeVariant} className={`ml-2 text-sm py-1 px-3 shrink-0 ${confidenceBadgeTextClass}`}>
            {confidencePercentage}% Confidence
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="px-5 pb-4 pt-2">
        <div className="mb-4">
          <Progress 
            value={confidencePercentage} 
            aria-label={`${confidencePercentage}% confidence for ${diagnosis.condition}`} 
            className="h-3 rounded-full [&>div]:bg-primary" 
          />
        </div>
        <CardDescription className="text-base text-foreground/90 leading-relaxed">
          <span className="font-medium text-foreground">Explanation:</span> {diagnosis.explanation}
        </CardDescription>
      </CardContent>
    </Card>
  );
}
