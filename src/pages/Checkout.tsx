import { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { CreditCard, Wallet, CheckCircle, ArrowLeft, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type PaymentMethod = 'cmi' | 'paypal' | 'crypto';

export default function Checkout() {
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const planId = location.state?.planId;
  const plan = location.state?.plan || 'Pro';
  const price = location.state?.price || '500';
  const accountSize = location.state?.accountSize || 50000;

  const paymentMethods = [
    { id: 'cmi' as const, name: 'CMI', icon: CreditCard, description: 'Carte bancaire marocaine' },
    { id: 'paypal' as const, name: 'PayPal', icon: Wallet, description: 'Paiement sécurisé' },
    { id: 'crypto' as const, name: 'Crypto', icon: Wallet, description: 'Bitcoin, Ethereum, USDT' },
  ];

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    if (token && user && planId && !isSuccess) {
      (async () => {
        try {
          setIsProcessing(true);
          const captureResp = await fetch('http://localhost:5000/api/paypal/capture-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ order_id: token }),
          });
          const captureData = await captureResp.json();
          if (!captureData.success) {
            throw new Error(captureData.error || 'Capture PayPal échouée');
          }
          const { data: challenge, error: challengeError } = await supabase
            .from('user_challenges')
            .insert({
              user_id: user.id,
              plan_id: planId,
              status: 'active',
              phase: 'phase1',
              starting_balance: accountSize,
              current_balance: accountSize,
              highest_balance: accountSize,
              daily_loss: 0,
              total_loss: 0,
              total_profit: 0,
              trading_days: 0,
              started_at: new Date().toISOString(),
            })
            .select()
            .single();

          if (challengeError) throw challengeError;

          const { error: transactionError } = await supabase
            .from('transactions')
            .insert({
              user_id: user.id,
              challenge_id: challenge.id,
              type: 'purchase',
              amount: parseInt(price) * 1.2,
              currency: 'USD',
              status: 'completed',
              payment_method: 'paypal',
              payment_reference: token,
            });
          if (transactionError) throw transactionError;

          setIsSuccess(true);
          toast.success('Paiement PayPal capturé et challenge activé');
          setTimeout(() => navigate('/dashboard'), 2000);
        } catch (e: unknown) {
          console.error(e);
          const message = e instanceof Error ? e.message : 'Erreur lors du traitement PayPal';
          toast.error(message);
        } finally {
          setIsProcessing(false);
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search, user, planId]);

  const handlePayment = async () => {
    if (!selectedMethod || !user || !planId) {
      toast.error('Veuillez vous connecter et sélectionner un plan');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      if (selectedMethod === 'paypal') {
        const resp = await fetch('http://localhost:5000/api/paypal/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: (parseInt(price) * 1.2).toFixed(2),
            currency: 'USD',
            return_url: `${window.location.origin}/checkout`,
            cancel_url: `${window.location.origin}/checkout`,
          }),
        });
        const data = await resp.json();
        if (!data.success || !data.approve_url) {
          throw new Error(data.error || 'Création de commande PayPal échouée');
        }
        window.location.href = data.approve_url;
        return;
      }

      const { data: challenge, error: challengeError } = await supabase
        .from('user_challenges')
        .insert({
          user_id: user.id,
          plan_id: planId,
          status: 'active',
          phase: 'phase1',
          starting_balance: accountSize,
          current_balance: accountSize,
          highest_balance: accountSize,
          daily_loss: 0,
          total_loss: 0,
          total_profit: 0,
          trading_days: 0,
          started_at: new Date().toISOString(),
        })
        .select()
        .single();
      if (challengeError) throw challengeError;

      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          challenge_id: challenge.id,
          type: 'purchase',
          amount: parseInt(price) * 1.2,
          currency: 'MAD',
          status: 'completed',
          payment_method: selectedMethod,
          payment_reference: `TXN-${Date.now()}`,
        });
      if (transactionError) throw transactionError;

      setIsSuccess(true);
      toast.success('Challenge créé avec succès!');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (error: unknown) {
      console.error('Payment error:', error);
      const message = error instanceof Error ? error.message : 'Erreur lors du paiement';
      toast.error(message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-gradient-glow opacity-30" />
        <Card className="w-full max-w-md relative z-10 bg-card/95 backdrop-blur-xl border-primary">
          <CardContent className="pt-12 pb-12 text-center">
            <div className="w-20 h-20 rounded-full bg-profit/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-profit" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Paiement Réussi!</h2>
            <p className="text-muted-foreground mb-6">
              Votre challenge {plan} a été activé avec succès.
            </p>
            <p className="text-sm text-muted-foreground">
              Redirection vers le dashboard...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero p-4">
      <div className="absolute inset-0 bg-gradient-glow opacity-30" />
      
      <div className="container mx-auto max-w-4xl relative z-10 pt-8">
        {/* Back Button */}
        <Link to="/#pricing" className="inline-flex items-center gap-2 text-secondary-foreground/70 hover:text-primary transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          Retour aux tarifs
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Order Summary */}
          <Card className="bg-card/95 backdrop-blur-xl border-border h-fit">
            <CardHeader>
              <CardTitle>Résumé de la commande</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-4 border-b border-border">
                  <div>
                    <h3 className="font-semibold text-foreground">Challenge {plan}</h3>
                    <p className="text-sm text-muted-foreground">Accès à la plateforme TradeSense</p>
                  </div>
                  <span className="text-xl font-bold text-foreground">{price} DH</span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Sous-total</span>
                    <span className="text-foreground">{price} DH</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">TVA (20%)</span>
                    <span className="text-foreground">{(parseInt(price) * 0.2).toFixed(0)} DH</span>
                  </div>
                </div>

                <div className="flex justify-between py-4 border-t border-border">
                  <span className="font-semibold text-foreground">Total</span>
                  <span className="text-2xl font-bold text-primary">{(parseInt(price) * 1.2).toFixed(0)} DH</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
                  <Shield className="w-4 h-4 text-primary" />
                  <span>Paiement 100% sécurisé</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Methods */}
          <Card className="bg-card/95 backdrop-blur-xl border-border">
            <CardHeader>
              <CardTitle>Méthode de paiement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${
                      selectedMethod === method.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      selectedMethod === method.id ? 'bg-primary/10' : 'bg-muted'
                    }`}>
                      <method.icon className={`w-6 h-6 ${
                        selectedMethod === method.id ? 'text-primary' : 'text-muted-foreground'
                      }`} />
                    </div>
                    <div className="text-left">
                      <h4 className="font-semibold text-foreground">{method.name}</h4>
                      <p className="text-sm text-muted-foreground">{method.description}</p>
                    </div>
                    {selectedMethod === method.id && (
                      <CheckCircle className="w-5 h-5 text-primary ml-auto" />
                    )}
                  </button>
                ))}

                <Button
                  className="w-full mt-6"
                  size="lg"
                  disabled={!selectedMethod || isProcessing}
                  onClick={handlePayment}
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Traitement en cours...
                    </div>
                  ) : (
                    `Payer ${(parseInt(price) * 1.2).toFixed(0)} DH`
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground mt-4">
                  En cliquant sur "Payer", vous acceptez nos conditions générales de vente.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
