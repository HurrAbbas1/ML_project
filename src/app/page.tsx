import type { Metadata } from 'next';
import { ImageDxClientPage } from '@/app/features/image-dx/components/image-dx-client-page';

export const metadata: Metadata = {
  title: 'ImageDx - AI Image Analysis (Educational Tool)',
  description: 'Upload images for AI-powered analysis. Provides educational insights. This tool is not a substitute for professional medical advice, diagnosis, or treatment.',
};

export default function Home() {
  return <ImageDxClientPage />;
}
