-- Seed users (if not already exists)
INSERT INTO users (id, full_name, email, password_hash, role, is_active)
VALUES
(
    'usr-admin-seed-0000-000000000001',
    'System Admin',
    'admin@publishflow.com',
    '$2a$12$kHwlJK7PcVzN1NXBd7bpU.1fUv7VAXrxRwCy0UfNO9LsU6WEnQyuC',
    'ADMIN',
    TRUE
),
(
    'usr-pm-seed-00000000000002',
    'Priya Sharma',
    'pm@publishflow.com',
    '$2a$12$kHwlJK7PcVzN1NXBd7bpU.1fUv7VAXrxRwCy0UfNO9LsU6WEnQyuC',
    'PROJECT_MANAGER',
    TRUE
),
(
    'usr-prod-seed-0000000000003',
    'Ravi Kumar',
    'production@publishflow.com',
    '$2a$12$kHwlJK7PcVzN1NXBd7bpU.1fUv7VAXrxRwCy0UfNO9LsU6WEnQyuC',
    'PRODUCTION_TEAM',
    TRUE
),
(
    'usr-qc-seed-00000000000004',
    'Sneha Patel',
    'qc@publishflow.com',
    '$2a$12$kHwlJK7PcVzN1NXBd7bpU.1fUv7VAXrxRwCy0UfNO9LsU6WEnQyuC',
    'QC_TEAM',
    TRUE
),
(
    'usr-prod2-seed-000000000005',
    'Vikram Nair',
    'prod2@publishflow.com',
    '$2a$12$kHwlJK7PcVzN1NXBd7bpU.1fUv7VAXrxRwCy0UfNO9LsU6WEnQyuC',
    'PRODUCTION_TEAM',
    TRUE
)
ON CONFLICT (id) DO NOTHING;

-- Seed customers (if not already exists)
INSERT INTO customers (id, name, contact_email, contact_phone, created_by)
VALUES
(
    'cust-001',
    'Oxford University Press',
    'editorial@oup.com',
    '+44 1865 353000',
    'usr-admin-seed-0000-000000000001'
),
(
    'cust-002',
    'Pearson Education',
    'production@pearson.com',
    '+1 800 922 0579',
    'usr-admin-seed-0000-000000000001'
),
(
    'cust-003',
    'Springer Nature Group',
    'publishing@springer.com',
    '+49 6221 345 0',
    'usr-admin-seed-0000-000000000001'
),
(
    'cust-004',
    'Elsevier Scientific',
    'manuscripts@elsevier.com',
    '+31 20 485 3911',
    'usr-admin-seed-0000-000000000001'
),
(
    'cust-005',
    'Cambridge University Press',
    'info@cambridge.org',
    '+44 1223 358331',
    'usr-admin-seed-0000-000000000001'
)
ON CONFLICT (id) DO NOTHING;
