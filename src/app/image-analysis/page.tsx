
import type { Metadata } from 'next';
import { ImageDxClientPage } from '@/app/features/image-dx/components/image-dx-client-page';

export const metadata: Metadata = {
  title: 'Particle Classification Tool - AI Urine Sediment',
  description: 'Upload urine sediment images for AI-powered particle classification.',
};

export default function ParticleClassificationPage() { // Renamed component for clarity
  return <ImageDxClientPage />;
}
