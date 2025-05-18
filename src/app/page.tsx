import type { Metadata } from 'next';
import { ImageDxClientPage } from '@/app/features/image-dx/components/image-dx-client-page';

export const metadata: Metadata = {
  title: 'ImageDx - AI Image Diagnosis',
  description: 'Upload an image of urine sediment for AI-powered disease diagnosis.',
};

export default function Home() {
  return <ImageDxClientPage />;
}
