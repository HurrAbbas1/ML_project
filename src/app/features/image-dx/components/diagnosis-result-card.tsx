import type { DiagnoseImageOutput } from '@/ai/flows/diagnose-image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { AlertCircle } from 'lucide-react';

// Extracts the type for a single diagnosis object from the DiagnoseImageOutput type.
type Diagnosis = DiagnoseImageOutput['diagnoses'][0];

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
      <CardContent className="px-5 pb-2">
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
      {diagnosis.generalTreatmentInfo && (
        <CardFooter className="px-5 pb-5 pt-2 flex-col items-start">
          <div className="mt-3 p-3 border-l-4 border-accent bg-accent/10 rounded-r-md w-full">
            <h4 className="text-sm font-semibold text-accent-foreground mb-1 flex items-center">
              <AlertCircle className="h-4 w-4 mr-2 text-accent shrink-0" />
              General Educational Information
            </h4>
            <p className="text-sm text-accent-foreground/80 leading-relaxed">
              {diagnosis.generalTreatmentInfo}
            </p>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
