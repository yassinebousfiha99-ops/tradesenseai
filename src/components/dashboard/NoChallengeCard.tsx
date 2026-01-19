import { Link } from 'react-router-dom';
import { Rocket, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export function NoChallengeCard() {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
          <Rocket className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Aucun challenge actif
        </h2>
        <p className="text-muted-foreground mb-6 max-w-md">
          Vous n'avez pas encore de challenge en cours. Commencez votre parcours de trader financé dès maintenant !
        </p>
        <Link to="/checkout">
          <Button size="lg" className="group">
            Démarrer un challenge
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
