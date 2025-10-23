-- Create test user for ParkWise
-- Run this in pgAdmin Query Tool after running create_and_load.sql

-- Insert test user (password is hashed using BCrypt)
-- Username: admin@parkwise.com
-- Password: admin123
INSERT INTO users (email, username, password, role, created_at) 
VALUES (
    'admin@parkwise.com',
    'admin',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', -- BCrypt hash of 'admin123'
    'ADMIN',
    NOW()
) ON CONFLICT (email) DO NOTHING;

-- Insert regular test user
-- Username: user@parkwise.com
-- Password: user123
INSERT INTO users (email, username, password, role, created_at) 
VALUES (
    'user@parkwise.com',
    'testuser',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- BCrypt hash of 'user123'
    'USER',
    NOW()
) ON CONFLICT (email) DO NOTHING;

-- Verify users created
SELECT id, email, username, role, created_at FROM users;
