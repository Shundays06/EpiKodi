'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Home, Library, Search, Settings, Play, LogIn, LogOut, User, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Accueil', icon: Home },
  { href: '/library', label: 'Bibliothèque', icon: Library },
  { href: '/favorites', label: 'Favoris', icon: Heart, authRequired: true },
  { href: '/scan', label: 'Scanner', icon: Search },
];

export function Navigation() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

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
              
              // Skip auth-required items if not logged in
              if (item.authRequired && !session) {
                return null;
              }
              
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

            {/* Auth Buttons */}
            <div className="ml-4 flex items-center space-x-2">
              {status === 'loading' ? (
                <div className="w-8 h-8 animate-spin rounded-full border-2 border-primary-500 border-t-transparent"></div>
              ) : session ? (
                <>
                  <div className="hidden md:flex items-center space-x-2 px-3 py-2 rounded-lg bg-dark-200">
                    <User className="w-4 h-4" />
                    <span className="text-sm">{session.user.email}</span>
                  </div>
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-dark-200 hover:bg-dark-300 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="hidden md:inline">Déconnexion</span>
                  </button>
                </>
              ) : (
                <Link
                  href="/auth/signin"
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 transition-colors"
                >
                  <LogIn className="w-5 h-5" />
                  <span className="hidden md:inline">Connexion</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
