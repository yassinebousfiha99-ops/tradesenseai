import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Sun, Moon, Globe, TrendingUp, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { Language } from '@/lib/i18n';
import { toast } from 'sonner';

const languages: { code: Language; label: string; flag: string }[] = [
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'ar', label: 'العربية', flag: '🇲🇦' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { t, language, setLanguage } = useLanguage();
  const { toggleTheme, isDark } = useTheme();
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    toast.success('Déconnexion réussie');
    navigate('/');
  };

  const navLinks = [
    { href: '/#features', label: t.nav.features },
    { href: '/#pricing', label: t.nav.pricing },
    { href: '/dashboard', label: t.nav.dashboard },
    { href: '/leaderboard', label: t.nav.leaderboard },
    { href: '/community', label: t.nav.community },
    { href: '/masterclass', label: t.nav.masterclass },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">
              Trade<span className="text-primary">Sense</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive(link.href) ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Globe className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={language === lang.code ? 'bg-accent' : ''}
                  >
                    <span className="mr-2">{lang.flag}</span>
                    {lang.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Theme Toggle */}
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem disabled className="text-muted-foreground">
                    {user.email}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      <User className="w-4 h-4 mr-2" />
                      Mon Profil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                    <LogOut className="w-4 h-4 mr-2" />
                    Déconnexion
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost">{t.nav.login}</Button>
                </Link>
                <Link to="/register">
                  <Button>{t.nav.startChallenge}</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border animate-slide-up">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-sm font-medium text-muted-foreground hover:text-primary"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex items-center gap-2 pt-4 border-t border-border">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Globe className="w-4 h-4 mr-2" />
                      {languages.find(l => l.code === language)?.flag}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {languages.map((lang) => (
                      <DropdownMenuItem
                        key={lang.code}
                        onClick={() => setLanguage(lang.code)}
                      >
                        <span className="mr-2">{lang.flag}</span>
                        {lang.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button variant="ghost" size="sm" onClick={toggleTheme}>
                  {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </Button>
              </div>
              <div className="flex flex-col gap-2 pt-2">
                {user ? (
                  <>
                    <div className="text-sm text-muted-foreground px-2">{user.email}</div>
                    <Link to="/profile" onClick={() => setIsOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start">
                        <User className="w-4 h-4 mr-2" />
                        Mon Profil
                      </Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      className="w-full text-destructive justify-start" 
                      onClick={() => { handleSignOut(); setIsOpen(false); }}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Déconnexion
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setIsOpen(false)}>
                      <Button variant="ghost" className="w-full">{t.nav.login}</Button>
                    </Link>
                    <Link to="/register" onClick={() => setIsOpen(false)}>
                      <Button className="w-full">{t.nav.startChallenge}</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
