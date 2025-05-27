
import type { Metadata } from 'next';
import { ProjectInfoPage } from '@/app/components/project-info-page';

export const metadata: Metadata = {
  title: 'Project Information - AI Urine Sediment Analysis',
  description: 'Overview of the AI-Powered Urine Sediment Analysis Project, team members, and goals.',
};

export default function Home() {
  return <ProjectInfoPage />;
}
