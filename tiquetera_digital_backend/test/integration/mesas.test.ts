import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { MesasModule } from '../../src/mesas/mesas.module';
import { MesasService } from '../../src/mesas/mesas.service';
import { CreateMesaDto } from '../../src/mesas/dto/create-mesa.dto';
import { UpdateMesaDto } from '../../src/mesas/dto/update-mesa.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Mesa } from '../../src/mesas/entities/mesa.entity';

describe('Mesas - Integración', () => {
  let app: INestApplication;
  let mesasService: MesasService;
  
  // Mock del repositorio
  const mockMesasRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    merge: jest.fn(),
    remove: jest.fn(),
  };
  
  // Datos de prueba
  const mockMesas = [
    {
      id: '1',
      numero: 1,
      nombre: 'Mesa 1',
      estado: 'cerrada',
      posicion_x: 100,
      posicion_y: 100,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: '2',
      numero: 2,
      nombre: 'Mesa 2',
      estado: 'abierta',
      posicion_x: 200,
      posicion_y: 100,
      created_at: new Date(),
      updated_at: new Date()
    }
  ];
  
  beforeAll(async () => {
    // Configuración del módulo de prueba con mocks
    const moduleRef = await Test.createTestingModule({
      imports: [MesasModule],
    })
    .overrideProvider(getRepositoryToken(Mesa))
    .useValue(mockMesasRepository)
    .compile();
    
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();
    
    mesasService = moduleRef.get<MesasService>(MesasService);
    
    // Mock de las implementaciones
    mockMesasRepository.find.mockImplementation(() => Promise.resolve(mockMesas));
    mockMesasRepository.findOne.mockImplementation(({ where: { id } }) => {
      const mesa = mockMesas.find(m => m.id === id);
      return Promise.resolve(mesa);
    });
    mockMesasRepository.create.mockImplementation((dto) => dto);
    mockMesasRepository.save.mockImplementation((mesa) => 
      Promise.resolve({ id: '3', ...mesa })
    );
  });
  
  afterAll(async () => {
    await app.close();
  });
  
  describe('GET /mesas', () => {
    it('debería devolver todas las mesas', async () => {
      const response = await request(app.getHttpServer())
        .get('/mesas')
        .expect(200);
      
      expect(response.body).toHaveLength(2);
      expect(response.body[0].numero).toBe(1);
      expect(response.body[1].numero).toBe(2);
    });
  });
  
  describe('GET /mesas/:id', () => {
    it('debería devolver una mesa por ID', async () => {
      const response = await request(app.getHttpServer())
        .get('/mesas/1')
        .expect(200);
      
      expect(response.body.id).toBe('1');
      expect(response.body.nombre).toBe('Mesa 1');
    });
    
    it('debería devolver 404 para una mesa inexistente', async () => {
      mockMesasRepository.findOne.mockImplementationOnce(() => null);
      
      await request(app.getHttpServer())
        .get('/mesas/999')
        .expect(404);
    });
  });
  
  describe('POST /mesas', () => {
    it('debería crear una nueva mesa', async () => {
      const createMesaDto: CreateMesaDto = {
        numero: 3,
        nombre: 'Mesa 3',
        posicion_x: 300,
        posicion_y: 100
      };
      
      const response = await request(app.getHttpServer())
        .post('/mesas')
        .send(createMesaDto)
        .expect(201);
      
      expect(response.body.id).toBe('3');
      expect(response.body.numero).toBe(3);
    });
    
    it('debería validar el número de mesa duplicado', async () => {
      mockMesasRepository.findOne.mockImplementationOnce(() => mockMesas[0]);
      
      const createMesaDto: CreateMesaDto = {
        numero: 1, // Número duplicado
        nombre: 'Mesa Duplicada'
      };
      
      await request(app.getHttpServer())
        .post('/mesas')
        .send(createMesaDto)
        .expect(400);
    });
  });
  
  describe('PATCH /mesas/:id', () => {
    it('debería actualizar una mesa existente', async () => {
      const updateMesaDto: UpdateMesaDto = {
        nombre: 'Mesa 1 Actualizada'
      };
      
      const response = await request(app.getHttpServer())
        .patch('/mesas/1')
        .send(updateMesaDto)
        .expect(200);
      
      expect(response.body.nombre).toBe('Mesa 1 Actualizada');
    });
  });
  
  describe('PATCH /mesas/:id/estado', () => {
    it('debería cambiar el estado de una mesa', async () => {
      const response = await request(app.getHttpServer())
        .patch('/mesas/1/estado')
        .send({ estado: 'abierta' })
        .expect(200);
      
      expect(response.body.estado).toBe('abierta');
    });
    
    it('debería rechazar un estado inválido', async () => {
      await request(app.getHttpServer())
        .patch('/mesas/1/estado')
        .send({ estado: 'estadoInvalido' })
        .expect(400);
    });
  });
}); 