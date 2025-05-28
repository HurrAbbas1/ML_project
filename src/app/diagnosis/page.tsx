
import type { Metadata } from 'next';
import { DiagnosisClientPage } from '@/app/features/diagnosis/components/diagnosis-client-page';

export const metadata: Metadata = {
  title: 'Potential Diagnosis - AI Urine Sediment Analysis',
  description: 'View potential diagnoses based on AI analysis of your urine sediment image.',
};

export default function DiagnosisPage() {
  return <DiagnosisClientPage />;
}

    