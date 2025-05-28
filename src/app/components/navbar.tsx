
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Microscope, Home, FlaskConical, Brain, HeartPulse, BarChart, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface NavLink {
  href: string;
  label: string;
  icon: React.ElementType;
}

const navLinks: NavLink[] = [
  { href: '/', label: 'Project Info', icon: Home },
  { href: '/image-analysis', label: 'Classification', icon: FlaskConical },
  { href: '/diagnosis', label: 'Diagnosis', icon: Brain },
  { href: '/morphology', label: 'Morphology', icon: BookOpen },
  { href: '/health-dashboard', label: 'Dashboard', icon: BarChart },
  // Future links can be added here:
  // { href: '/model-info', label: 'Model Info', icon: Info },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Microscope className="h-7 w-7 text-primary" />
          <span className="hidden font-bold sm:inline-block text-lg text-primary">
            AI Urine Analysis
          </span>
        </Link>
        <nav className="flex flex-1 items-center space-x-1 sm:space-x-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            const LinkIcon = link.icon;
            return (
              <Button
                key={link.href}
                variant="ghost"
                asChild
                className={cn(
                  "h-auto px-2 py-1.5 sm:px-3 sm:py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                  isActive
                    ? "bg-primary/10 text-primary hover:text-primary"
                    : "text-muted-foreground hover:text-foreground/80",
                  "flex items-center gap-1.5 sm:gap-2"
                )}
              >
                <Link href={link.href}>
                  <LinkIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="hidden sm:inline-block">{link.label}</span>
                </Link>
              </Button>
            );
          })}
        </nav>
        {/* Placeholder for potential future elements like theme toggle or user profile */}
        {/* <div className="flex flex-1 items-center justify-end space-x-2">
          <Button variant="ghost" size="icon">
            <Sun className="h-5 w-5" /> 
          </Button>
        </div> */}
      </div>
    </header>
  );
}
