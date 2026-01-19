-- Ensure RLS policies for user_challenges and trades
-- Allow users to SELECT and UPDATE their own user_challenges
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'user_challenges' AND policyname = 'Users can select their own challenges'
  ) THEN
    CREATE POLICY "Users can select their own challenges"
    ON public.user_challenges
    FOR SELECT
    USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'user_challenges' AND policyname = 'Users can update their own challenges'
  ) THEN
    CREATE POLICY "Users can update their own challenges"
    ON public.user_challenges
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- Allow users to SELECT, INSERT and UPDATE their own trades
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'trades' AND policyname = 'Users can select their own trades'
  ) THEN
    CREATE POLICY "Users can select their own trades"
    ON public.trades
    FOR SELECT
    USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'trades' AND policyname = 'Users can insert their own trades'
  ) THEN
    CREATE POLICY "Users can insert their own trades"
    ON public.trades
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'trades' AND policyname = 'Users can update their own trades'
  ) THEN
    CREATE POLICY "Users can update their own trades"
    ON public.trades
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;
