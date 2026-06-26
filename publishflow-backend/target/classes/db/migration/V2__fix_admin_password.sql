-- Fix admin password hash (BCrypt 12 of 'Admin@1234')
UPDATE users
SET password_hash = '$2a$12$kHwlJK7PcVzN1NXBd7bpU.1fUv7VAXrxRwCy0UfNO9LsU6WEnQyuC'
WHERE email = 'admin@publishflow.com';
