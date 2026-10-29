// Script para probar la creación de una tiquetera directamente con el backend
const axios = require('axios');

// Configuración
const API_URL = 'http://localhost:3000/api';
let authToken = '';

// Función para iniciar sesión como administrador
async function login() {
  try {
    console.log('Iniciando sesión como administrador...');
    const response = await axios.post(`${API_URL}/auth/login`, {
      username: 'admin',
      password: 'admin123'
    });
    
    authToken = response.data.access_token;
    console.log('Sesión iniciada exitosamente. Token obtenido.');
    return response.data.user;
  } catch (error) {
    console.error('Error al iniciar sesión:', error.response?.data || error.message);
    throw error;
  }
}

// Función para obtener clientes
async function getClientes() {
  try {
    console.log('Obteniendo lista de clientes...');
    const response = await axios.get(`${API_URL}/users/role/cliente`, {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });
    
    console.log(`Se encontraron ${response.data.length} clientes.`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener clientes:', error.response?.data || error.message);
    throw error;
  }
}

// Función para crear una tiquetera
async function crearTiquetera(clienteId) {
  try {
    console.log(`Creando tiquetera para cliente ID: ${clienteId}...`);
    const tiqueteraData = {
      cliente_id: clienteId,
      saldoInicial: 30,
      fechaVencimiento: new Date(new Date().getFullYear() + 1, new Date().getMonth(), new Date().getDate())
    };
    
    console.log('Datos de tiquetera a crear:', tiqueteraData);
    
    const response = await axios.post(`${API_URL}/tiqueteras`, tiqueteraData, {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });
    
    console.log('Tiquetera creada exitosamente:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al crear tiquetera:', error.response?.data || error.message);
    throw error;
  }
}

// Ejecutar prueba
async function ejecutarPrueba() {
  try {
    // Iniciar sesión
    await login();
    
    // Obtener clientes
    const clientes = await getClientes();
    
    if (clientes.length === 0) {
      console.error('No se encontraron clientes para crear una tiquetera.');
      return;
    }
    
    // Usar el primer cliente para la prueba
    const clienteId = clientes[0].id;
    console.log(`Usando cliente: ${clientes[0].nombre} (${clienteId})`);
    
    // Crear tiquetera
    await crearTiquetera(clienteId);
    
    console.log('Prueba completada exitosamente.');
  } catch (error) {
    console.error('Error durante la prueba:', error.message);
  }
}

// Ejecutar la prueba
ejecutarPrueba(); 