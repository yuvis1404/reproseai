ALTER TABLE public.profiles ALTER COLUMN repurposes_limit SET DEFAULT 5;

UPDATE public.profiles SET repurposes_limit = 5 WHERE coalesce(subscription_tier, 'free') = 'free';
UPDATE public.profiles SET repurposes_limit = 30 WHERE subscription_tier = 'creator';
UPDATE public.profiles SET repurposes_limit = 999999 WHERE subscription_tier = 'pro';