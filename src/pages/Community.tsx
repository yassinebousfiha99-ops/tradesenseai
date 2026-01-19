import { useEffect, useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Users, MessageSquare, Plus } from 'lucide-react';

type Message = { author: string; text: string; ts: number };

const groups = [
  { id: 'general', name: 'Général' },
  { id: 'strategies', name: 'Stratégies' },
  { id: 'morocco', name: 'Marché Maroc' },
  { id: 'international', name: 'Marché International' },
  { id: 'education', name: 'MasterClass' },
];

export default function Community() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [selected, setSelected] = useState<string>(groups[0].id);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Record<string, Message[]>>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem('ts_community_messages');
      if (raw) {
        const parsed = JSON.parse(raw) as Record<string, Message[]>;
        setMessages(parsed);
      }
    } catch { void 0; }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('ts_community_messages', JSON.stringify(messages));
    } catch { void 0; }
  }, [messages]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    const author = user?.email || 'Anonyme';
    const msg: Message = { author, text, ts: Date.now() };
    const next = { ...(messages || {}) };
    next[selected] = [...(next[selected] || []), msg];
    setMessages(next);
    setInput('');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Users className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-primary">{t.nav.community}</span>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">{t.community.title}</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">{t.community.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                {t.community.groupsTitle}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {groups.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setSelected(g.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                      selected === g.id ? 'bg-primary/10 border border-primary/20' : 'bg-muted/30 hover:bg-muted/50 border border-transparent'
                    }`}
                  >
                    <span className="text-sm font-medium text-foreground">{g.name}</span>
                    <Badge variant="outline">{(messages[g.id] || []).length}</Badge>
                  </button>
                ))}
              </div>
              <Separator className="my-4" />
              <Button className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                {t.community.createGroup}
              </Button>
            </CardContent>
          </Card>

          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{t.community.chatTitle}</span>
                  <Badge variant="secondary">{groups.find((g) => g.id === selected)?.name}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96 rounded-lg border border-border bg-muted/20">
                  <ScrollArea className="h-80 p-4">
                    {(messages[selected] || []).length === 0 ? (
                      <p className="text-sm text-muted-foreground">{t.community.empty}</p>
                    ) : (
                      <div className="space-y-3">
                        {(messages[selected] || []).map((m, i) => (
                          <div key={`${m.ts}-${i}`} className="p-3 rounded-lg bg-card border border-border">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium text-foreground">{m.author}</span>
                              <span className="text-xs text-muted-foreground">{new Date(m.ts).toLocaleString()}</span>
                            </div>
                            <p className="text-sm text-foreground whitespace-pre-wrap">{m.text}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                  <div className="p-3 border-t border-border">
                    <div className="flex items-center gap-2">
                      <Textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={t.community.inputPlaceholder}
                      />
                      <Button onClick={send}>{t.community.send}</Button>
                    </div>
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
