const { Client } = require('pg');

// Configuración de conexión a la base de datos
const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'postgres',
  database: 'tiquetera'
});

async function showUsers() {
  try {
    // Conectar a la base de datos
    await client.connect();
    
    // Ejecutar consulta
    const result = await client.query('SELECT * FROM users');
    
    // Mostrar resultados
    console.log('Usuarios encontrados:', result.rowCount);
    console.table(result.rows);
    
  } catch (error) {
    console.error('Error al consultar usuarios:', error.message);
  } finally {
    // Cerrar la conexión
    await client.end();
  }
}

// Ejecutar la función
showUsers(); 