-- Create HR-Company Relationship Table
-- Run this in MySQL to create the missing table

CREATE TABLE IF NOT EXISTS `hr_company_relationships` (
  `id` varchar(36) NOT NULL,
  `hrUserId` varchar(36) NOT NULL,
  `companyId` varchar(36) NOT NULL,
  `hrRole` varchar(255) DEFAULT NULL,
  `permissions` json DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deletedAt` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_hr_company_relationships_hrUserId` (`hrUserId`),
  KEY `IDX_hr_company_relationships_companyId` (`companyId`),
  KEY `IDX_hr_company_relationships_isActive` (`isActive`),
  CONSTRAINT `FK_hr_company_relationships_hrUserId` FOREIGN KEY (`hrUserId`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_hr_company_relationships_companyId` FOREIGN KEY (`companyId`) REFERENCES `companies` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample HR-Company relationship for testing
-- Replace with actual user and company IDs from your database
INSERT IGNORE INTO `hr_company_relationships` (`id`, `hrUserId`, `companyId`, `hrRole`, `permissions`, `isActive`, `createdAt`, `updatedAt`)
SELECT
  UUID() as id,
  u.id as hrUserId,
  c.id as companyId,
  'HR Specialist' as hrRole,
  JSON_OBJECT('read', true, 'write', true, 'manage_applications', true, 'post_jobs', true) as permissions,
  1 as isActive,
  NOW() as createdAt,
  NOW() as updatedAt
FROM users u
CROSS JOIN companies c
WHERE u.email = 'hr@test.com'
  AND c.name = 'My New Company'
LIMIT 1;
