-- Insertar usuario cliente de prueba con cédula y PIN
INSERT INTO users (id, nombre, cedula, usuario, pin, contrasena, rol, activo, created_at, updated_at)
VALUES (
  uuid_generate_v4(), -- Generar un UUID v4 aleatorio
  'Cliente Test',
  '123456789', -- Cédula
  'cliente_test', -- Usuario
  '1234', -- PIN (sin hash ya que se compara directamente)
  '$2b$10$VClh9qV71F5pN0.4XIJnb.xoKpBmTNbEOdEb0RWf.Fb4uQeEWY3V.', -- "cliente123" hasheado con bcrypt
  'cliente', -- Rol
  true, -- Activo
  NOW(), -- created_at
  NOW() -- updated_at
); 