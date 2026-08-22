-- ═══════════════════════════════════════════════════════════════
-- INSYT ACADEMY: Phase 1 Schema Extension
-- Payment Infrastructure, Course Pricing, Reviews & Settings
-- ═══════════════════════════════════════════════════════════════

-- 1. Add settings and updated_at to profiles (if not exists)
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='profiles' AND column_name='settings'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN settings JSONB DEFAULT '{"notifications": true, "haptics": false, "publicProfile": true, "dataSharing": false}'::jsonb;
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='profiles' AND column_name='updated_at'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());
    END IF;
END $$;

-- 2. ENUMs for Payment Processing
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_status') THEN
        CREATE TYPE public.payment_status AS ENUM ('PENDING', 'SUCCESS', 'FAILED', 'REFUNDED');
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_gateway') THEN
        CREATE TYPE public.payment_gateway AS ENUM ('BKASH', 'NAGAD', 'CARD_SSLCOMMERZ', 'FREE');
    END IF;
END $$;

-- 3. Course Pricing Table
CREATE TABLE IF NOT EXISTS public.course_pricing (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE UNIQUE,
    price_bdt NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    price_usd NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    discount_percentage NUMERIC(5, 2) DEFAULT 0.00,
    is_free BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Payment Transactions Log
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    course_id UUID REFERENCES public.courses(id) ON DELETE SET NULL,
    amount NUMERIC(10, 2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'BDT',
    gateway public.payment_gateway NOT NULL,
    trx_id TEXT UNIQUE NOT NULL,
    pg_tx_id TEXT,
    status public.payment_status NOT NULL DEFAULT 'PENDING',
    raw_payload JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Instructor Wallets
CREATE TABLE IF NOT EXISTS public.instructor_wallets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    instructor_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
    total_earned NUMERIC(12, 2) DEFAULT 0.00,
    current_balance NUMERIC(12, 2) DEFAULT 0.00,
    payment_number_bkash TEXT,
    payment_number_nagad TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 6. Course Reviews & Ratings
CREATE TABLE IF NOT EXISTS public.course_reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(course_id, user_id)
);

-- ═══════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY
-- ═══════════════════════════════════════════════════════════════
ALTER TABLE public.course_pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.instructor_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_reviews ENABLE ROW LEVEL SECURITY;

-- Pricing Policies
CREATE POLICY "Public pricing read" ON public.course_pricing FOR SELECT USING (true);
CREATE POLICY "Admin pricing insert" ON public.course_pricing 
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.role IN ('Admin', 'Instructor')
    )
  );
CREATE POLICY "Admin pricing update" ON public.course_pricing 
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.role IN ('Admin', 'Instructor')
    )
  );

-- Transactions Policies
CREATE POLICY "User transactions read" ON public.transactions FOR SELECT USING (auth.uid() = user_id);
-- Note: Direct client INSERT / UPDATE is disabled for transactions. All payments must be recorded securely via server-side service client.

-- Instructor Wallets Policies
CREATE POLICY "Instructor wallet read" ON public.instructor_wallets FOR SELECT USING (auth.uid() = instructor_id);
-- Note: Direct client INSERT / UPDATE is disabled for instructor wallets to prevent earnings spoofing. Balance is updated automatically via server triggers.

-- Reviews Policies
CREATE POLICY "Public reviews read" ON public.course_reviews FOR SELECT USING (true);
CREATE POLICY "User review insert" ON public.course_reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "User review update" ON public.course_reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "User review delete" ON public.course_reviews FOR DELETE USING (auth.uid() = user_id);

-- ═══════════════════════════════════════════════════════════════
-- INDEXES for Scale
-- ═══════════════════════════════════════════════════════════════
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_course_id ON public.transactions(course_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON public.transactions(status);
CREATE INDEX IF NOT EXISTS idx_course_reviews_course_id ON public.course_reviews(course_id);
CREATE INDEX IF NOT EXISTS idx_course_pricing_course_id ON public.course_pricing(course_id);
