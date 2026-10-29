import { Test, TestingModule } from '@nestjs/testing';
import { PedidosController } from './pedidos.controller';
import { PedidosService } from './pedidos.service';

describe('PedidosController', () => {
  let controller: PedidosController;
  let service: PedidosService;

  const mockPedido = {
    id: '1',
    ordenId: '1',
    clienteId: '1',
    metodoPago: 'efectivo' as 'efectivo',
    total: 100,
    productos: []
  };

  const mockPedidoService = {
    create: jest.fn().mockResolvedValue(mockPedido),
    findAll: jest.fn().mockResolvedValue([mockPedido]),
    findOne: jest.fn().mockResolvedValue(mockPedido),
    findByOrden: jest.fn().mockResolvedValue([mockPedido]),
    findByCliente: jest.fn().mockResolvedValue([mockPedido]),
    update: jest.fn().mockResolvedValue(mockPedido),
    remove: jest.fn().mockResolvedValue(mockPedido)
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PedidosController],
      providers: [
        {
          provide: PedidosService,
          useValue: mockPedidoService
        }
      ]
    }).compile();

    controller = module.get<PedidosController>(PedidosController);
    service = module.get<PedidosService>(PedidosService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new pedido', async () => {
      const createPedidoDto = {
        ordenId: '1',
        clienteId: '1',
        metodoPago: 'efectivo' as 'efectivo',
        total: 100,
        productos: []
      };

      const result = await controller.create(createPedidoDto);
      expect(result).toEqual(mockPedido);
      expect(service.create).toHaveBeenCalledWith(createPedidoDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of pedidos', async () => {
      const result = await controller.findAll();
      expect(result).toEqual([mockPedido]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a pedido by id', async () => {
      const result = await controller.findOne('1');
      expect(result).toEqual(mockPedido);
      expect(service.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('findByOrden', () => {
    it('should return pedidos by orden id', async () => {
      const result = await controller.findByOrden('1');
      expect(result).toEqual([mockPedido]);
      expect(service.findByOrden).toHaveBeenCalledWith('1');
    });
  });

  describe('findByCliente', () => {
    it('should return pedidos by cliente id', async () => {
      const result = await controller.findByCliente('1');
      expect(result).toEqual([mockPedido]);
      expect(service.findByCliente).toHaveBeenCalledWith('1');
    });
  });

  describe('update', () => {
    it('should update a pedido', async () => {
      const updatePedidoDto = {
        total: 150
      };

      const result = await controller.update('1', updatePedidoDto);
      expect(result).toEqual(mockPedido);
      expect(service.update).toHaveBeenCalledWith('1', updatePedidoDto);
    });
  });

  describe('remove', () => {
    it('should remove a pedido', async () => {
      const result = await controller.remove('1');
      expect(result).toEqual(mockPedido);
      expect(service.remove).toHaveBeenCalledWith('1');
    });
  });
}); 