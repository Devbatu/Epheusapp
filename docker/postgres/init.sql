-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gin";

-- Create read replica user
CREATE USER ephesus_reader WITH PASSWORD 'reader_secret';
GRANT CONNECT ON DATABASE ephesus TO ephesus_reader;
GRANT USAGE ON SCHEMA public TO ephesus_reader;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO ephesus_reader;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO ephesus_reader;
