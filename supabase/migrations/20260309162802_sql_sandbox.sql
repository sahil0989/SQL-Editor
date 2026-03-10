-- 1. Create sandbox tables
CREATE TABLE IF NOT EXISTS public.users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  age INTEGER,
  city TEXT
);

CREATE TABLE IF NOT EXISTS public.orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES public.users(id) ON DELETE CASCADE,
  amount NUMERIC(10, 2) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.assignments (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  description TEXT,
  question TEXT
);

-- 2. Create query_attempts log table
CREATE TABLE IF NOT EXISTS public.query_attempts (
  id SERIAL PRIMARY KEY,
  query TEXT NOT NULL,
  assignment_id TEXT,
  success BOOLEAN NOT NULL DEFAULT false,
  error_message TEXT,
  row_count INTEGER DEFAULT 0,
  attempted_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Indexes
CREATE INDEX IF NOT EXISTS idx_query_attempts_assignment_id ON public.query_attempts(assignment_id);
CREATE INDEX IF NOT EXISTS idx_query_attempts_attempted_at ON public.query_attempts(attempted_at);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);

-- 4. RLS: open access for sandbox (no auth required for learning sandbox)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.query_attempts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "sandbox_open_users" ON public.users;
CREATE POLICY "sandbox_open_users" ON public.users FOR ALL TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "sandbox_open_orders" ON public.orders;
CREATE POLICY "sandbox_open_orders" ON public.orders FOR ALL TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "sandbox_open_assignments" ON public.assignments;
CREATE POLICY "sandbox_open_assignments" ON public.assignments FOR ALL TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "sandbox_open_query_attempts" ON public.query_attempts;
CREATE POLICY "sandbox_open_query_attempts" ON public.query_attempts FOR ALL TO public USING (true) WITH CHECK (true);

-- 5. RPC function: execute_sandbox_query
-- Executes a SELECT-only query against the sandbox schema and returns rows as JSON
CREATE OR REPLACE FUNCTION public.execute_sandbox_query(sql_query TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSONB;
  lower_query TEXT;
BEGIN
  lower_query := lower(trim(sql_query));

  -- Safety: only allow SELECT
  IF NOT (lower_query LIKE 'select%') THEN
    RAISE EXCEPTION 'Only SELECT queries are allowed';
  END IF;

  -- Safety: block dangerous keywords
  IF lower_query ~ '\m(drop|delete|update|insert|alter|truncate|create|grant|revoke|exec|execute)\M' THEN
    RAISE EXCEPTION 'Only SELECT queries are allowed';
  END IF;

  -- Execute and return as JSON array
  EXECUTE format('SELECT jsonb_agg(row_to_json(t)) FROM (%s) t', sql_query) INTO result;

  RETURN COALESCE(result, '[]'::jsonb);
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION '%', SQLERRM;
END;
$$;

-- 6. Seed data (idempotent)
DO $$
BEGIN
  -- Seed users if empty
  IF NOT EXISTS (SELECT 1 FROM public.users LIMIT 1) THEN
    INSERT INTO public.users (name, age, city) VALUES
      ('Alice',   28, 'NYC'),
      ('Bob',     34, 'LA'),
      ('Carol',   22, 'Chicago'),
      ('David',   45, 'NYC'),
      ('Eva',     31, 'Houston'),
      ('Frank',   27, 'LA'),
      ('Grace',   38, 'Chicago'),
      ('Henry',   52, 'NYC'),
      ('Iris',    29, 'Seattle'),
      ('James',   41, 'Houston');
  END IF;

  -- Seed orders if empty
  IF NOT EXISTS (SELECT 1 FROM public.orders LIMIT 1) THEN
    INSERT INTO public.orders (user_id, amount) VALUES
      (1,  120.50),
      (1,  340.00),
      (2,   89.99),
      (2,  450.75),
      (3,  200.00),
      (3,   55.25),
      (4,  999.00),
      (4,  150.00),
      (5,   75.50),
      (5,  620.00),
      (6,  310.00),
      (7,   44.99),
      (8,  800.00),
      (9,  130.00),
      (10, 270.50);
  END IF;

  -- Seed assignments if empty
  IF NOT EXISTS (SELECT 1 FROM public.assignments LIMIT 1) THEN
    INSERT INTO public.assignments (title, difficulty, description, question) VALUES
      ('Select All Users',           'easy',   'Retrieve all records from the users table.',                                          'Write a query to select all columns from the users table.'),
      ('Filter by City',             'easy',   'Use WHERE to filter users by city.',                                                  'Select all users who live in NYC.'),
      ('Sort Users by Age',          'easy',   'Use ORDER BY to sort results.',                                                       'Select all users ordered by age in ascending order.'),
      ('Count Users',                'easy',   'Use COUNT to count rows.',                                                            'Count the total number of users in the table.'),
      ('Select Specific Columns',    'easy',   'Retrieve only name and city columns.',                                                'Select only the name and city columns from the users table.'),
      ('Orders Above Threshold',     'medium', 'Filter orders by amount.',                                                           'Select all orders where the amount is greater than 200.'),
      ('Users with Orders',          'medium', 'Join users and orders tables.',                                                       'Select user names and their order amounts using a JOIN.'),
      ('Total Orders per User',      'medium', 'Use GROUP BY and SUM.',                                                              'Find the total order amount for each user.'),
      ('Average Order Amount',       'medium', 'Use AVG aggregate function.',                                                        'Calculate the average order amount across all orders.'),
      ('Top Spenders',               'medium', 'Combine JOIN, GROUP BY, and ORDER BY.',                                              'Find the top 3 users by total order amount.'),
      ('Users Without Orders',       'hard',   'Use LEFT JOIN to find users with no orders.',                                        'Find all users who have not placed any orders.'),
      ('Orders Above User Average',  'hard',   'Use subqueries to compare against aggregates.',                                      'Find all orders where the amount is above the average order amount.');
  END IF;
END $$;
