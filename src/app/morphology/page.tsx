
import type { Metadata } from 'next';
import { MorphologyClientPage } from '@/app/features/morphology/components/morphology-client-page';

export const metadata: Metadata = {
  title: 'Urine Particle Morphology - AI Urine Analysis',
  description: 'Learn about the morphological features, AI distinction, and diagnostic significance of various urine sediment particles.',
};

export default function MorphologyPage() {
  return <MorphologyClientPage />;
}
