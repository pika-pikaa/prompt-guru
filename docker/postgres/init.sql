-- =============================================================================
-- PostgreSQL Initialization Script
-- Prompt Guru Database Setup
-- =============================================================================
-- This script runs automatically when the PostgreSQL container starts for the
-- first time. It creates the database and sets up initial configuration.
-- =============================================================================

-- Create database if it doesn't exist (handled by POSTGRES_DB env var, but keeping for reference)
-- The database is already created by the POSTGRES_DB environment variable

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create application user with limited privileges (optional - for enhanced security)
-- Uncomment and configure if you want a separate application user
-- DO $$
-- BEGIN
--     IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'promptguru_app') THEN
--         CREATE ROLE promptguru_app WITH LOGIN PASSWORD 'app_password_here';
--     END IF;
-- END
-- $$;

-- Grant privileges (if using separate app user)
-- GRANT CONNECT ON DATABASE promptguru TO promptguru_app;
-- GRANT USAGE ON SCHEMA public TO promptguru_app;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO promptguru_app;
-- ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO promptguru_app;

-- Log initialization
DO $$
BEGIN
    RAISE NOTICE 'Prompt Guru database initialized successfully at %', NOW();
END
$$;
