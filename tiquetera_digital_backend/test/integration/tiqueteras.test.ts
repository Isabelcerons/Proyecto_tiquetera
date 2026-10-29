import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TiqueterasModule } from '../../src/tiqueteras/tiqueteras.module';
import { TiqueterasService } from '../../src/tiqueteras/tiqueteras.service';
import { CreateTiqueteraDto } from '../../src/tiqueteras/dto/create-tiquetera.dto';
import { CreateMovimientoDto } from '../../src/tiqueteras/dto/create-movimiento.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Tiquetera } from '../../src/tiqueteras/entities/tiquetera.entity';
import { MovimientoTiquetera, TipoMovimiento } from '../../src/tiqueteras/entities/movimiento-tiquetera.entity';
import { UsersService } from '../../src/users/users.service';

describe('Tiqueteras - Integración', () => {
  let app: INestApplication;
  let tiqueterasService: TiqueterasService;
  
  // Mock de repositorios
  const mockTiqueterasRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    merge: jest.fn(),
    remove: jest.fn(),
  };
  
  const mockMovimientosRepository = {
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };
  
  // Mock del servicio de usuarios
  const mockUsersService = {
    findOne: jest.fn(),
  };
  
  // Datos de prueba
  const mockCliente = {
    id: 'cliente-1',
    nombre: 'Cliente Test',
    cedula: '12345678',
    rol: 'cliente',
    activo: true
  };
  
  const mockTiqueteras = [
    {
      id: 'tiquetera-1',
      cliente: mockCliente,
      saldoInicial: 100,
      saldoDisponible: 80,
      fechaCreacion: new Date(),
      fechaVencimiento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días en el futuro
      activa: true
    },
    {
      id: 'tiquetera-2',
      cliente: mockCliente,
      saldoInicial: 50,
      saldoDisponible: 50,
      fechaCreacion: new Date(),
      fechaVencimiento: null,
      activa: true
    }
  ];
  
  const mockMovimientos = [
    {
      id: 'movimiento-1',
      tiquetera_id: 'tiquetera-1',
      tiquetera: mockTiqueteras[0],
      tipo: TipoMovimiento.CARGA,
      monto: 100,
      saldoAnterior: 0,
      saldoNuevo: 100,
      descripcion: 'Carga inicial',
      fecha: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) // 10 días en el pasado
    },
    {
      id: 'movimiento-2',
      tiquetera_id: 'tiquetera-1',
      tiquetera: mockTiqueteras[0],
      tipo: TipoMovimiento.CONSUMO,
      monto: -20,
      saldoAnterior: 100,
      saldoNuevo: 80,
      pedido_id: 'pedido-1',
      descripcion: 'Consumo pedido',
      fecha: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 días en el pasado
    }
  ];
  
  beforeAll(async () => {
    // Configuración del módulo de prueba con mocks
    const moduleRef = await Test.createTestingModule({
      imports: [TiqueterasModule],
    })
    .overrideProvider(getRepositoryToken(Tiquetera))
    .useValue(mockTiqueterasRepository)
    .overrideProvider(getRepositoryToken(MovimientoTiquetera))
    .useValue(mockMovimientosRepository)
    .overrideProvider(UsersService)
    .useValue(mockUsersService)
    .compile();
    
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();
    
    tiqueterasService = moduleRef.get<TiqueterasService>(TiqueterasService);
    
    // Mock de las implementaciones
    mockTiqueterasRepository.find.mockImplementation(() => Promise.resolve(mockTiqueteras));
    mockTiqueterasRepository.findOne.mockImplementation(({ where: { id } }) => {
      const tiquetera = mockTiqueteras.find(t => t.id === id);
      return Promise.resolve(tiquetera);
    });
    mockTiqueterasRepository.create.mockImplementation((dto) => dto);
    mockTiqueterasRepository.save.mockImplementation((tiquetera) => 
      Promise.resolve({ id: 'tiquetera-nueva', ...tiquetera })
    );
    
    mockMovimientosRepository.find.mockImplementation(({ where: { tiquetera_id } }) => {
      const movimientos = mockMovimientos.filter(m => m.tiquetera_id === tiquetera_id);
      return Promise.resolve(movimientos);
    });
    mockMovimientosRepository.create.mockImplementation((dto) => dto);
    mockMovimientosRepository.save.mockImplementation((movimiento) => 
      Promise.resolve({ id: 'movimiento-nuevo', ...movimiento, fecha: new Date() })
    );
    
    mockUsersService.findOne.mockImplementation((id) => {
      if (id === mockCliente.id) {
        return Promise.resolve(mockCliente);
      }
      return Promise.resolve(null);
    });
  });
  
  afterAll(async () => {
    await app.close();
  });
  
  describe('GET /tiqueteras', () => {
    it('debería devolver todas las tiqueteras', async () => {
      const response = await request(app.getHttpServer())
        .get('/tiqueteras')
        .expect(200);
      
      expect(response.body).toHaveLength(2);
      expect(response.body[0].id).toBe('tiquetera-1');
      expect(response.body[1].id).toBe('tiquetera-2');
    });
  });
  
  describe('GET /tiqueteras/:id', () => {
    it('debería devolver una tiquetera por ID', async () => {
      const response = await request(app.getHttpServer())
        .get('/tiqueteras/tiquetera-1')
        .expect(200);
      
      expect(response.body.id).toBe('tiquetera-1');
      expect(response.body.saldoDisponible).toBe(80);
    });
    
    it('debería devolver 404 para una tiquetera inexistente', async () => {
      mockTiqueterasRepository.findOne.mockImplementationOnce(() => null);
      
      await request(app.getHttpServer())
        .get('/tiqueteras/inexistente')
        .expect(404);
    });
  });
  
  describe('GET /tiqueteras/cliente/:clienteId', () => {
    it('debería devolver las tiqueteras de un cliente', async () => {
      const response = await request(app.getHttpServer())
        .get(`/tiqueteras/cliente/${mockCliente.id}`)
        .expect(200);
      
      expect(response.body).toHaveLength(2);
      expect(response.body[0].cliente.id).toBe(mockCliente.id);
    });
  });
  
  describe('POST /tiqueteras', () => {
    it('debería crear una nueva tiquetera', async () => {
      const createTiqueteraDto: CreateTiqueteraDto = {
        cliente_id: mockCliente.id,
        saldoInicial: 200,
        fechaVencimiento: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 días en el futuro
        activa: true
      };
      
      const response = await request(app.getHttpServer())
        .post('/tiqueteras')
        .send(createTiqueteraDto)
        .expect(201);
      
      expect(response.body.id).toBe('tiquetera-nueva');
      expect(response.body.saldoInicial).toBe(200);
    });
  });
  
  describe('POST /tiqueteras/:id/cargar', () => {
    it('debería cargar saldo a una tiquetera existente', async () => {
      const createMovimientoDto: CreateMovimientoDto = {
        tiquetera_id: 'tiquetera-1',
        tipo: TipoMovimiento.CARGA,
        monto: 50,
        descripcion: 'Recarga test',
        usuario_id: 'admin-1'
      };
      
      const response = await request(app.getHttpServer())
        .post('/tiqueteras/tiquetera-1/cargar')
        .send(createMovimientoDto)
        .expect(200);
      
      expect(response.body.tiquetera.saldoDisponible).toBeGreaterThan(80);
      expect(response.body.movimiento.monto).toBe(50);
    });
    
    it('debería rechazar una carga con monto negativo', async () => {
      const createMovimientoDto: CreateMovimientoDto = {
        tiquetera_id: 'tiquetera-1',
        tipo: TipoMovimiento.CARGA,
        monto: -10, // Monto negativo
        descripcion: 'Recarga inválida'
      };
      
      await request(app.getHttpServer())
        .post('/tiqueteras/tiquetera-1/cargar')
        .send(createMovimientoDto)
        .expect(400);
    });
  });
  
  describe('GET /tiqueteras/:id/movimientos', () => {
    it('debería obtener el historial de movimientos de una tiquetera', async () => {
      const response = await request(app.getHttpServer())
        .get('/tiqueteras/tiquetera-1/movimientos')
        .expect(200);
      
      expect(response.body).toHaveLength(2);
      expect(response.body[0].tipo).toBe(TipoMovimiento.CONSUMO);
      expect(response.body[1].tipo).toBe(TipoMovimiento.CARGA);
    });
  });
  
  describe('POST /tiqueteras/:id/validar-consumo', () => {
    it('debería validar un consumo posible', async () => {
      const response = await request(app.getHttpServer())
        .post('/tiqueteras/tiquetera-1/validar-consumo')
        .send({ monto: 50 })
        .expect(200);
      
      expect(response.body.valido).toBe(true);
    });
    
    it('debería rechazar un consumo que excede el saldo', async () => {
      const response = await request(app.getHttpServer())
        .post('/tiqueteras/tiquetera-1/validar-consumo')
        .send({ monto: 100 })
        .expect(200);
      
      expect(response.body.valido).toBe(false);
      expect(response.body.mensaje).toContain('insuficiente');
    });
  });
}); 