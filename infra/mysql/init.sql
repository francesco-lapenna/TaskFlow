-- Runs once on first MySQL container start.
-- Database and user are created from MYSQL_DATABASE / MYSQL_USER env vars.
-- This file is the place to add schema or seed data once the backend is
-- pointed at MySQL (DB_CONNECTOR=mysql) instead of the in-memory store.

CREATE DATABASE IF NOT EXISTS taskflow
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE taskflow;

-- LoopBack will auto-create tables when migrations are run
-- (`npm run migrate` in backend/). Schema lives in code, not here.
