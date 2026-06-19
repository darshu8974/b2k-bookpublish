-- Fix admin password hash (BCrypt 12 of 'password')
UPDATE users
SET password_hash = '$2a$12$8k.Ejv87rVyne/04i/km3.DtH6i/HOojM4vMKQao41Ap8treE4PXa'
WHERE email = 'admin@publishflow.com';
