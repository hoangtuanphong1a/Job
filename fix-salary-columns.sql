-- Fix salary columns to handle large values
-- Run this if you get "Out of range value" errors for salary columns

-- Modify salary columns to use larger DECIMAL type
ALTER TABLE jobs MODIFY COLUMN minSalary DECIMAL(15,2) NULL;
ALTER TABLE jobs MODIFY COLUMN maxSalary DECIMAL(15,2) NULL;

-- Verify the changes
DESCRIBE jobs;
