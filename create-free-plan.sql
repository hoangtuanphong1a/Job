INSERT INTO subscription_plans (id, name, description, planType, price, billingCycle, maxJobs, maxApplications, featured, prioritySupport, analyticsAccess, features, isActive, sortOrder, createdAt, updatedAt)
VALUES (
  'free-plan-001',
  'Free Plan',
  'Basic features for getting started',
  'FREE',
  0,
  'MONTHLY',
  1,
  10,
  0,
  0,
  0,
  '["Basic job posting", "Application tracking"]',
  1,
  1,
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  description = VALUES(description),
  planType = VALUES(planType),
  price = VALUES(price),
  billingCycle = VALUES(billingCycle),
  maxJobs = VALUES(maxJobs),
  maxApplications = VALUES(maxApplications),
  featured = VALUES(featured),
  prioritySupport = VALUES(prioritySupport),
  analyticsAccess = VALUES(analyticsAccess),
  features = VALUES(features),
  isActive = VALUES(isActive),
  sortOrder = VALUES(sortOrder),
  updatedAt = NOW();
