
import type { Metadata } from 'next';
import { ImageDxClientPage } from '@/app/features/image-dx/components/image-dx-client-page';

export const metadata: Metadata = {
  title: 'ImageDx - AI Image Analysis Tool',
  description: 'Upload images for AI-powered analysis.',
};

export default function Home() {
  return <ImageDxClientPage />;
}
