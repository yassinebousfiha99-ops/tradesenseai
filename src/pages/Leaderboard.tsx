import { Trophy, Medal, TrendingUp, Crown } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

const mockLeaderboard = [
  { rank: 1, name: 'Ahmed K.', profit: 28.5, trades: 145, winRate: 72, avatar: '🏆' },
  { rank: 2, name: 'Fatima M.', profit: 24.2, trades: 98, winRate: 68, avatar: '🥈' },
  { rank: 3, name: 'Youssef B.', profit: 21.8, trades: 112, winRate: 65, avatar: '🥉' },
  { rank: 4, name: 'Sara L.', profit: 19.3, trades: 87, winRate: 71, avatar: '👤' },
  { rank: 5, name: 'Omar T.', profit: 17.6, trades: 134, winRate: 63, avatar: '👤' },
  { rank: 6, name: 'Amina R.', profit: 15.9, trades: 76, winRate: 69, avatar: '👤' },
  { rank: 7, name: 'Karim H.', profit: 14.2, trades: 92, winRate: 62, avatar: '👤' },
  { rank: 8, name: 'Nadia S.', profit: 12.8, trades: 68, winRate: 70, avatar: '👤' },
  { rank: 9, name: 'Hassan Z.', profit: 11.4, trades: 105, winRate: 58, avatar: '👤' },
  { rank: 10, name: 'Leila A.', profit: 10.1, trades: 54, winRate: 74, avatar: '👤' },
];

export default function Leaderboard() {
  const { t } = useLanguage();

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-muted-foreground font-bold">{rank}</span>;
    }
  };

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-500/10 to-yellow-500/5 border-yellow-500/30';
      case 2:
        return 'bg-gradient-to-r from-gray-400/10 to-gray-400/5 border-gray-400/30';
      case 3:
        return 'bg-gradient-to-r from-amber-600/10 to-amber-600/5 border-amber-600/30';
      default:
        return 'bg-card border-border';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Trophy className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-primary">Monthly Rankings</span>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">{t.leaderboard.title}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t.leaderboard.subtitle}
          </p>
        </div>

        {/* Top 3 Podium */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
          {/* Second Place */}
          <div className="md:mt-8 order-2 md:order-1">
            <Card className={`${getRankStyle(2)} border`}>
              <CardContent className="pt-6 text-center">
                <div className="text-4xl mb-4">{mockLeaderboard[1].avatar}</div>
                <h3 className="text-lg font-bold text-foreground mb-1">{mockLeaderboard[1].name}</h3>
                <p className="text-3xl font-bold text-profit mb-2">+{mockLeaderboard[1].profit}%</p>
                <p className="text-sm text-muted-foreground">{mockLeaderboard[1].trades} trades</p>
              </CardContent>
            </Card>
          </div>

          {/* First Place */}
          <div className="order-1 md:order-2">
            <Card className={`${getRankStyle(1)} border-2`}>
              <CardContent className="pt-8 pb-8 text-center">
                <div className="text-5xl mb-4">{mockLeaderboard[0].avatar}</div>
                <h3 className="text-xl font-bold text-foreground mb-1">{mockLeaderboard[0].name}</h3>
                <p className="text-4xl font-bold text-profit mb-2">+{mockLeaderboard[0].profit}%</p>
                <p className="text-sm text-muted-foreground">{mockLeaderboard[0].trades} trades</p>
              </CardContent>
            </Card>
          </div>

          {/* Third Place */}
          <div className="md:mt-8 order-3">
            <Card className={`${getRankStyle(3)} border`}>
              <CardContent className="pt-6 text-center">
                <div className="text-4xl mb-4">{mockLeaderboard[2].avatar}</div>
                <h3 className="text-lg font-bold text-foreground mb-1">{mockLeaderboard[2].name}</h3>
                <p className="text-3xl font-bold text-profit mb-2">+{mockLeaderboard[2].profit}%</p>
                <p className="text-sm text-muted-foreground">{mockLeaderboard[2].trades} trades</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Full Leaderboard Table */}
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Full Rankings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">{t.leaderboard.rank}</th>
                    <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">{t.leaderboard.trader}</th>
                    <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">{t.leaderboard.profit}</th>
                    <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">{t.leaderboard.trades}</th>
                    <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">{t.leaderboard.winRate}</th>
                  </tr>
                </thead>
                <tbody>
                  {mockLeaderboard.map((trader) => (
                    <tr
                      key={trader.rank}
                      className={`border-b border-border/50 hover:bg-muted/30 transition-colors ${getRankStyle(trader.rank)}`}
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          {getRankBadge(trader.rank)}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                            <span className="text-lg">{trader.avatar}</span>
                          </div>
                          <span className="font-medium text-foreground">{trader.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className="font-bold text-profit flex items-center justify-end gap-1">
                          <TrendingUp className="w-4 h-4" />
                          +{trader.profit}%
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className="text-muted-foreground">{trader.trades}</span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className="text-foreground font-medium">{trader.winRate}%</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
