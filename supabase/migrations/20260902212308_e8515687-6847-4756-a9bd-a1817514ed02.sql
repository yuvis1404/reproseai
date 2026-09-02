CREATE POLICY "Users can delete own profile" ON public.profiles FOR DELETE TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can delete own voice profile" ON public.voice_profiles FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own subscription" ON public.subscriptions FOR DELETE TO authenticated USING (auth.uid() = user_id);
GRANT DELETE ON public.profiles TO authenticated;
GRANT DELETE ON public.voice_profiles TO authenticated;
GRANT DELETE ON public.subscriptions TO authenticated;