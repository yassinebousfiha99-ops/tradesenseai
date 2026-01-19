import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLanguage } from '@/contexts/LanguageContext';
import { BookOpen, LineChart, ShieldCheck, Video, Sparkles, GraduationCap } from 'lucide-react';

const featureItems = [
  { icon: BookOpen, key: 'lessons' },
  { icon: LineChart, key: 'analysis' },
  { icon: ShieldCheck, key: 'riskWorkshops' },
  { icon: Video, key: 'liveWebinars' },
  { icon: Sparkles, key: 'aiPaths' },
  { icon: GraduationCap, key: 'challengesQuizzes' },
];

const courses = [
  { id: 'c1', level: 'beginner', title: 'Bases du Trading', duration: '3h', tags: ['Price Action', 'Gestion'] },
  { id: 'c2', level: 'beginner', title: 'Lecture du Marché', duration: '2h', tags: ['Tendance', 'Volume'] },
  { id: 'c3', level: 'intermediate', title: 'Analyse Technique Avancée', duration: '5h', tags: ['RSI', 'VWAP', 'Ichimoku'] },
  { id: 'c4', level: 'intermediate', title: 'Gestion des Risques', duration: '4h', tags: ['Position sizing', 'Drawdown'] },
  { id: 'c5', level: 'advanced', title: 'Stratégies de Momentum', duration: '6h', tags: ['Breakouts', 'Volatilité'] },
  { id: 'c6', level: 'advanced', title: 'Arbitrage & Macro', duration: '6h', tags: ['Macro', 'Intermarché'] },
];

const webinars = [
  { id: 'w1', title: 'Plan de Trade IA en Direct', date: '2026-02-05', host: 'Expert TS' },
  { id: 'w2', title: 'Gestion du Risque Pro', date: '2026-02-12', host: 'Risk Coach' },
];

export default function MasterClass() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <GraduationCap className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-primary">{t.masterclass.badge}</span>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">{t.masterclass.title}</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">{t.masterclass.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {featureItems.map((f, idx) => {
            const Icon = f.icon;
            return (
              <Card key={`${f.key}-${idx}`} className="border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon className="w-5 h-5 text-primary" />
                    {t.masterclass.features[f.key].title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{t.masterclass.features[f.key].description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{t.masterclass.catalog.title}</span>
                <Badge variant="secondary">{t.masterclass.catalog.total.replace('{n}', String(courses.length))}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[28rem] pr-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {courses.map((c) => (
                    <div key={c.id} className="p-4 rounded-lg bg-card border border-border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-foreground">{c.title}</span>
                        <Badge variant="outline">{c.duration}</Badge>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <Badge className={c.level === 'beginner' ? 'bg-chart-4/20 text-chart-4' : c.level === 'intermediate' ? 'bg-primary/10 text-primary' : 'bg-loss/10 text-loss'}>
                          {t.masterclass.level[c.level]}
                        </Badge>
                        {c.tags.map((tag, i) => (
                          <Badge key={`${c.id}-tag-${i}`} variant="outline">{tag}</Badge>
                        ))}
                      </div>
                      <Button size="sm">{t.masterclass.catalog.cta}</Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>{t.masterclass.webinars.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {webinars.map((w) => (
                    <div key={w.id} className="p-3 rounded-lg bg-muted/30 border border-border">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">{w.title}</span>
                        <Badge variant="outline">{w.date}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{t.masterclass.webinars.host.replace('{name}', w.host)}</p>
                      <Button size="sm" className="mt-2">{t.masterclass.webinars.cta}</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t.masterclass.paths.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-muted/30 border border-border">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">{t.masterclass.paths.beginner.title}</span>
                      <Badge variant="outline">0%</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{t.masterclass.paths.beginner.desc}</p>
                    <Button size="sm" className="mt-2">{t.masterclass.paths.cta}</Button>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/30 border border-border">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">{t.masterclass.paths.advanced.title}</span>
                      <Badge variant="outline">0%</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{t.masterclass.paths.advanced.desc}</p>
                    <Button size="sm" className="mt-2">{t.masterclass.paths.cta}</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
