-- Create orders table
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  amount INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'usd',
  stripe_session_id TEXT,
  customer_email TEXT,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create briefs table
CREATE TABLE briefs (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id),
  token TEXT UNIQUE NOT NULL,
  day_schedule JSONB,
  medications JSONB,
  warning_signs JSONB,
  normal_things JSONB,
  follow_up JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create rate_limits table
CREATE TABLE rate_limits (
  id SERIAL PRIMARY KEY,
  ip TEXT NOT NULL,
  window_start TEXT NOT NULL,
  count INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(ip, window_start)
);

-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE briefs ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

-- Policies (adjust as needed for your app)
CREATE POLICY "Allow all operations for authenticated users" ON orders FOR ALL USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON briefs FOR ALL USING (true);
CREATE POLICY "Allow all operations for authenticated users" ON rate_limits FOR ALL USING (true);
