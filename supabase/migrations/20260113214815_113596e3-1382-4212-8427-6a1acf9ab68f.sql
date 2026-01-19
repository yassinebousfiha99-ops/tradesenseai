
-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create enum for challenge status
CREATE TYPE public.challenge_status AS ENUM ('pending', 'active', 'passed', 'failed', 'cancelled');

-- Create enum for challenge phase
CREATE TYPE public.challenge_phase AS ENUM ('phase1', 'phase2', 'funded');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  country TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Create challenge_plans table (the products)
CREATE TABLE public.challenge_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  account_size DECIMAL(12,2) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  daily_loss_limit DECIMAL(5,2) NOT NULL DEFAULT 5.00,
  max_loss_limit DECIMAL(5,2) NOT NULL DEFAULT 10.00,
  profit_target_phase1 DECIMAL(5,2) NOT NULL DEFAULT 10.00,
  profit_target_phase2 DECIMAL(5,2) NOT NULL DEFAULT 5.00,
  min_trading_days INTEGER NOT NULL DEFAULT 5,
  leverage TEXT NOT NULL DEFAULT '1:100',
  profit_split DECIMAL(5,2) NOT NULL DEFAULT 80.00,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create user_challenges table (user's purchased challenges)
CREATE TABLE public.user_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  plan_id UUID REFERENCES public.challenge_plans(id) NOT NULL,
  status challenge_status NOT NULL DEFAULT 'pending',
  phase challenge_phase NOT NULL DEFAULT 'phase1',
  starting_balance DECIMAL(12,2) NOT NULL,
  current_balance DECIMAL(12,2) NOT NULL,
  highest_balance DECIMAL(12,2) NOT NULL,
  daily_loss DECIMAL(12,2) NOT NULL DEFAULT 0,
  total_loss DECIMAL(12,2) NOT NULL DEFAULT 0,
  total_profit DECIMAL(12,2) NOT NULL DEFAULT 0,
  trading_days INTEGER NOT NULL DEFAULT 0,
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create trades table
CREATE TABLE public.trades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID REFERENCES public.user_challenges(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  symbol TEXT NOT NULL,
  side TEXT NOT NULL CHECK (side IN ('buy', 'sell')),
  entry_price DECIMAL(18,8) NOT NULL,
  exit_price DECIMAL(18,8),
  quantity DECIMAL(18,8) NOT NULL,
  profit_loss DECIMAL(12,2),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed')),
  opened_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  closed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create transactions table (payments)
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  challenge_id UUID REFERENCES public.user_challenges(id),
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'MAD',
  type TEXT NOT NULL CHECK (type IN ('purchase', 'payout', 'refund')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  payment_method TEXT,
  payment_reference TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- User roles policies
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Challenge plans policies (public read, admin write)
CREATE POLICY "Anyone can view active challenge plans"
  ON public.challenge_plans FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage challenge plans"
  ON public.challenge_plans FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- User challenges policies
CREATE POLICY "Users can view their own challenges"
  ON public.user_challenges FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own challenges"
  ON public.user_challenges FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all challenges"
  ON public.user_challenges FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all challenges"
  ON public.user_challenges FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- Trades policies
CREATE POLICY "Users can view their own trades"
  ON public.trades FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own trades"
  ON public.trades FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own open trades"
  ON public.trades FOR UPDATE
  USING (auth.uid() = user_id AND status = 'open');

CREATE POLICY "Admins can view all trades"
  ON public.trades FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Transactions policies
CREATE POLICY "Users can view their own transactions"
  ON public.transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all transactions"
  ON public.transactions FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Create trigger for updating timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_challenge_plans_updated_at
  BEFORE UPDATE ON public.challenge_plans
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_challenges_updated_at
  BEFORE UPDATE ON public.user_challenges
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at
  BEFORE UPDATE ON public.transactions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name')
  );
  
  -- Assign default user role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert default challenge plans
INSERT INTO public.challenge_plans (name, account_size, price, daily_loss_limit, max_loss_limit, profit_target_phase1, profit_target_phase2, min_trading_days, leverage, profit_split) VALUES
  ('Starter', 10000, 1500, 5, 10, 10, 5, 5, '1:100', 80),
  ('Standard', 25000, 3000, 5, 10, 10, 5, 5, '1:100', 80),
  ('Professional', 50000, 5000, 5, 10, 10, 5, 5, '1:100', 85),
  ('Expert', 100000, 8000, 5, 10, 10, 5, 5, '1:100', 90);
