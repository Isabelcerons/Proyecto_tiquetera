import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PedidosService } from './pedidos.service';
import { Pedido } from './entities/pedido.entity';
import { PedidoProducto } from './entities/pedido-producto.entity';
import { NotFoundException } from '@nestjs/common';

describe('PedidosService', () => {
  let service: PedidosService;
  let pedidoRepository: Repository<Pedido>;
  let pedidoProductoRepository: Repository<PedidoProducto>;

  const mockPedido = {
    id: '1',
    ordenId: '1',
    clienteId: '1',
    metodoPago: 'efectivo' as 'efectivo',
    total: 100,
    productos: []
  };

  const mockPedidoProducto = {
    id: '1',
    pedidoId: '1',
    productoId: '1',
    cantidad: 2,
    precioUnitario: 50
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PedidosService,
        {
          provide: getRepositoryToken(Pedido),
          useValue: {
            create: jest.fn().mockReturnValue(mockPedido),
            save: jest.fn().mockResolvedValue(mockPedido),
            find: jest.fn().mockResolvedValue([mockPedido]),
            findOne: jest.fn().mockResolvedValue(mockPedido),
            merge: jest.fn(),
            remove: jest.fn().mockResolvedValue(mockPedido)
          }
        },
        {
          provide: getRepositoryToken(PedidoProducto),
          useValue: {
            save: jest.fn().mockResolvedValue([mockPedidoProducto]),
            delete: jest.fn().mockResolvedValue({ affected: 1 })
          }
        }
      ]
    }).compile();

    service = module.get<PedidosService>(PedidosService);
    pedidoRepository = module.get<Repository<Pedido>>(getRepositoryToken(Pedido));
    pedidoProductoRepository = module.get<Repository<PedidoProducto>>(getRepositoryToken(PedidoProducto));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new pedido', async () => {
      const createPedidoDto = {
        ordenId: '1',
        clienteId: '1',
        metodoPago: 'efectivo' as 'efectivo',
        total: 100,
        productos: [mockPedidoProducto]
      };

      const result = await service.create(createPedidoDto);
      expect(result).toEqual(mockPedido);
      expect(pedidoRepository.create).toHaveBeenCalledWith(createPedidoDto);
      expect(pedidoRepository.save).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return an array of pedidos', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockPedido]);
      expect(pedidoRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a pedido by id', async () => {
      const result = await service.findOne('1');
      expect(result).toEqual(mockPedido);
      expect(pedidoRepository.findOne).toHaveBeenCalled();
    });

    it('should throw NotFoundException if pedido not found', async () => {
      jest.spyOn(pedidoRepository, 'findOne').mockResolvedValue(null);
      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a pedido', async () => {
      const updatePedidoDto = {
        total: 150
      };

      const result = await service.update('1', updatePedidoDto);
      expect(result).toEqual(mockPedido);
      expect(pedidoRepository.merge).toHaveBeenCalled();
      expect(pedidoRepository.save).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove a pedido', async () => {
      const result = await service.remove('1');
      expect(result).toEqual(mockPedido);
      expect(pedidoProductoRepository.delete).toHaveBeenCalled();
      expect(pedidoRepository.remove).toHaveBeenCalled();
    });
  });
}); 