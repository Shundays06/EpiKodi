'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Library, Search, Settings, Play } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Accueil', icon: Home },
  { href: '/library', label: 'Bibliothèque', icon: Library },
  { href: '/search', label: 'Rechercher', icon: Search },
  { href: '/player', label: 'Lecteur', icon: Play },
  { href: '/settings', label: 'Paramètres', icon: Settings },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-100/95 backdrop-blur-sm border-b border-dark-200">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
              <span className="text-2xl font-bold">E</span>
            </div>
            <span className="text-xl font-bold">EpiKodi</span>
          </Link>

          <div className="flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors',
                    isActive
                      ? 'bg-primary-600 text-white'
                      : 'text-dark-500 hover:bg-dark-200 hover:text-white'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="hidden md:inline">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
