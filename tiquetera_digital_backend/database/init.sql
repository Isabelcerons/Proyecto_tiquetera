-- Crear extensión para UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Crear tipos ENUM
CREATE TYPE user_role AS ENUM ('admin', 'cajero', 'mesero', 'cliente');
CREATE TYPE mesa_estado AS ENUM ('abierta', 'cerrada');
CREATE TYPE orden_estado AS ENUM ('abierta', 'completa');
CREATE TYPE metodo_pago AS ENUM ('tiquetera', 'efectivo');
CREATE TYPE estado_pago AS ENUM ('pagado', 'pendiente');

-- Usuarios
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(100) NOT NULL,
    cedula VARCHAR(20) UNIQUE,
    usuario VARCHAR(50) UNIQUE,
    pin VARCHAR(6),
    contrasena VARCHAR(255) NOT NULL,
    rol user_role NOT NULL,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Mesas
CREATE TABLE mesas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    numero INTEGER NOT NULL UNIQUE,
    nombre VARCHAR(50),
    estado mesa_estado DEFAULT 'cerrada',
    posicion_x INTEGER,
    posicion_y INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tiqueteras
CREATE TABLE tiqueteras (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cliente_id UUID REFERENCES users(id),
    total_asignado INTEGER NOT NULL,
    usados INTEGER DEFAULT 0,
    pendientes INTEGER DEFAULT 0,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categorías de Productos
CREATE TABLE categorias (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Productos
CREATE TABLE productos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL,
    categoria_id UUID REFERENCES categorias(id),
    disponible BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Órdenes
CREATE TABLE ordenes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mesa_id UUID REFERENCES mesas(id),
    mesero_id UUID REFERENCES users(id),
    estado orden_estado DEFAULT 'abierta',
    total DECIMAL(10,2) DEFAULT 0,
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pedidos
CREATE TABLE pedidos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    orden_id UUID REFERENCES ordenes(id),
    cliente_id UUID REFERENCES users(id),
    metodo_pago metodo_pago,
    estado_pago estado_pago DEFAULT 'pendiente',
    total DECIMAL(10,2) NOT NULL,
    fecha_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Detalles de Pedidos
CREATE TABLE pedido_productos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pedido_id UUID REFERENCES pedidos(id),
    producto_id UUID REFERENCES productos(id),
    cantidad INTEGER NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cierres de Caja
CREATE TABLE cierres_caja (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cajero_id UUID REFERENCES users(id),
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    total_efectivo DECIMAL(10,2) NOT NULL,
    total_tickets INTEGER NOT NULL,
    ordenes_cerradas INTEGER NOT NULL,
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX idx_users_cedula ON users(cedula);
CREATE INDEX idx_users_usuario ON users(usuario);
CREATE INDEX idx_mesas_numero ON mesas(numero);
CREATE INDEX idx_tiqueteras_cliente ON tiqueteras(cliente_id);
CREATE INDEX idx_productos_categoria ON productos(categoria_id);
CREATE INDEX idx_ordenes_mesa ON ordenes(mesa_id);
CREATE INDEX idx_ordenes_mesero ON ordenes(mesero_id);
CREATE INDEX idx_pedidos_orden ON pedidos(orden_id);
CREATE INDEX idx_pedidos_cliente ON pedidos(cliente_id);
CREATE INDEX idx_pedido_productos_pedido ON pedido_productos(pedido_id);
CREATE INDEX idx_pedido_productos_producto ON pedido_productos(producto_id);
CREATE INDEX idx_cierres_caja_fecha ON cierres_caja(fecha); 