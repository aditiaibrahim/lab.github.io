-- Fix admin password - Update to use bcrypt hash
UPDATE users 
SET password = '$2a$10$QFfOxY7xBQD0Y/eCCVdSfODV8UTi6shrM9UI0t5w0Th63bja6etl6'
WHERE email = 'admin@nusaputra.ac.id';

-- Verify the update
SELECT id, nama, email, role, status, 
       CASE WHEN password = '$2a$10$QFfOxY7xBQD0Y/eCCVdSfODV8UTi6shrM9UI0t5w0Th63bja6etl6' 
            THEN 'Password hash updated ✓' 
            ELSE 'Password not updated ✗' 
       END as password_status
FROM users 
WHERE email = 'admin@nusaputra.ac.id';
