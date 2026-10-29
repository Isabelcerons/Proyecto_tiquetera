const fetch = require('node-fetch');

async function testAuth() {
  try {
    // Intento de inicio de sesión
    console.log('Intentando iniciar sesión...');
    const loginResponse = await fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'isa',
        password: '1234',
        role: 'mesera'
      }),
    });

    const loginData = await loginResponse.json();
    
    if (loginResponse.status === 201) {
      console.log('Inicio de sesión exitoso!');
      console.log('Token JWT:', loginData.access_token);
      
      // Consultar usuarios usando el token
      const usersResponse = await fetch('http://localhost:3000/users', {
        headers: {
          'Authorization': `Bearer ${loginData.access_token}`
        }
      });
      
      const usersData = await usersResponse.json();
      console.log('\nUsuarios encontrados:');
      console.table(usersData);
    } else {
      console.error('Error al iniciar sesión:', loginData.message || 'Error desconocido');
    }
  } catch (error) {
    console.error('Error en la solicitud:', error.message);
  }
}

// Ejecutar la prueba
testAuth(); 