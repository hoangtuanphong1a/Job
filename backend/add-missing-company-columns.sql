-- Add missing columns to companies table
-- These columns are defined in the Company entity but missing from the database

ALTER TABLE companies ADD COLUMN isVerified BOOLEAN DEFAULT FALSE AFTER status;
ALTER TABLE companies ADD COLUMN verifiedAt DATETIME NULL AFTER isVerified;
ALTER TABLE companies ADD COLUMN adminNotes TEXT NULL AFTER verifiedAt;

-- Verify the changes
DESCRIBE companies;
