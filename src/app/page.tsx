import type { Metadata } from 'next';
import { ImageDxClientPage } from '@/app/features/image-dx/components/image-dx-client-page';

export const metadata: Metadata = {
  title: 'ImageDx - AI Image Diagnosis',
  description: 'AI-powered image analysis for informational insights.',
};

export default function Home() {
  return <ImageDxClientPage />;
}
