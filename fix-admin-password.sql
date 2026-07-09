-- Fix admin password - Update to use bcrypt hash
UPDATE users 
SET password = '$2a$10$gawEHvO645XbtYAhtyuKZOCMvVWxI1er71ZO7eOkTzaL6VbMZkSQO'
WHERE email = 'admin@nusaputra.ac.id';

-- Verify the update
SELECT id, nama, email, role, status, 
       CASE WHEN password = '$2a$10$gawEHvO645XbtYAhtyuKZOCMvVWxI1er71ZO7eOkTzaL6VbMZkSQO' 
            THEN 'Password hash updated ✓' 
            ELSE 'Password not updated ✗' 
       END as password_status
FROM users 
WHERE email = 'admin@nusaputra.ac.id';