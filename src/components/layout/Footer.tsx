import { Link } from 'react-router-dom';
import { TrendingUp, Mail, MessageCircle, Twitter, Linkedin } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-secondary text-secondary-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">
                Trade<span className="text-primary">Sense</span>
              </span>
            </Link>
            <p className="text-secondary-foreground/70 max-w-sm">
              {t.footer.description}
            </p>
            <div className="flex gap-4 mt-4">
              <a href="#" className="text-secondary-foreground/70 hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-secondary-foreground/70 hover:text-primary transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-secondary-foreground/70 hover:text-primary transition-colors">
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">{t.footer.legal}</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-secondary-foreground/70 hover:text-primary transition-colors text-sm">
                  {t.footer.terms}
                </a>
              </li>
              <li>
                <a href="#" className="text-secondary-foreground/70 hover:text-primary transition-colors text-sm">
                  {t.footer.privacy}
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">{t.footer.support}</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-secondary-foreground/70 hover:text-primary transition-colors text-sm flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {t.footer.contact}
                </a>
              </li>
              <li>
                <a href="#" className="text-secondary-foreground/70 hover:text-primary transition-colors text-sm">
                  {t.footer.faq}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-secondary-foreground/20 mt-8 pt-8 text-center text-sm text-secondary-foreground/50">
          © {new Date().getFullYear()} TradeSense AI. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
