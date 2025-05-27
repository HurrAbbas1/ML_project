
import type { Metadata } from 'next';
import { ImageDxClientPage } from '@/app/features/image-dx/components/image-dx-client-page';

export const metadata: Metadata = {
  title: 'Image Analysis Tool - AI Urine Sediment',
  description: 'Upload urine sediment images for AI-powered analysis and classification.',
};

export default function ImageAnalysisPage() {
  return <ImageDxClientPage />;
}
