import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PagosService } from './pagos.service';
import { Pago } from './entities/pago.entity';
import { Pedido } from '../pedidos/entities/pedido.entity';
import { Tiquetera } from '../tiqueteras/entities/tiquetera.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { CreatePagoDto } from './dto/create-pago.dto';

describe('PagosService', () => {
  let service: PagosService;
  let pagoRepository: Repository<Pago>;
  let pedidoRepository: Repository<Pedido>;
  let tiqueteraRepository: Repository<Tiquetera>;
  let dataSource: DataSource;

  const mockQueryRunner = {
    connect: jest.fn(),
    startTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    rollbackTransaction: jest.fn(),
    release: jest.fn(),
    manager: {
      save: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PagosService,
        {
          provide: getRepositoryToken(Pago),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Pedido),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Tiquetera),
          useClass: Repository,
        },
        {
          provide: DataSource,
          useValue: {
            createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner),
          },
        },
      ],
    }).compile();

    service = module.get<PagosService>(PagosService);
    pagoRepository = module.get<Repository<Pago>>(getRepositoryToken(Pago));
    pedidoRepository = module.get<Repository<Pedido>>(getRepositoryToken(Pedido));
    tiqueteraRepository = module.get<Repository<Tiquetera>>(getRepositoryToken(Tiquetera));
    dataSource = module.get<DataSource>(DataSource);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('procesarPago', () => {
    it('should process payment successfully', async () => {
      const createPagoDto: CreatePagoDto = {
        pedido_id: 'some-uuid',
        metodo_pago: 'efectivo',
        monto: 50000,
        monto_efectivo: 60000,
        vuelto: 10000
      };

      const mockPedido = {
        id: 'some-uuid',
        estado_pago: 'pendiente',
      };

      const mockPago = {
        id: 'pago-uuid',
        ...createPagoDto,
        estado: 'completado',
        estado_pago: 'pagado',
        pedido: mockPedido,
      };

      jest.spyOn(pedidoRepository, 'findOne').mockResolvedValue(mockPedido as any);
      mockQueryRunner.manager.save.mockResolvedValueOnce(mockPago);

      const result = await service.procesarPago(createPagoDto);
      expect(result.estado_pago).toBe('pagado');
    });

    it('should throw error if pedido not found', async () => {
      const createPagoDto: CreatePagoDto = {
        pedido_id: 'non-existent-uuid',
        metodo_pago: 'efectivo',
        monto: 50000
      };

      jest.spyOn(pedidoRepository, 'findOne').mockResolvedValue(null);
      await expect(service.procesarPago(createPagoDto)).rejects.toThrow(BadRequestException);
    });

    it('should process tiquetera payment successfully', async () => {
      const createPagoDto: CreatePagoDto = {
        pedido_id: 'some-uuid',
        metodo_pago: 'tiquetera',
        monto: 50000,
        tiquetera_id: 'tiquetera-uuid'
      };

      const mockPedido = {
        id: 'some-uuid',
        estado_pago: 'pendiente',
      };

      const mockTiquetera = {
        id: 'tiquetera-uuid',
      };

      const mockPago = {
        id: 'pago-uuid',
        ...createPagoDto,
        estado: 'completado',
        estado_pago: 'pagado',
        pedido: mockPedido,
        tiquetera: mockTiquetera,
      };

      jest.spyOn(pedidoRepository, 'findOne').mockResolvedValue(mockPedido as any);
      jest.spyOn(tiqueteraRepository, 'findOne').mockResolvedValue(mockTiquetera as any);
      mockQueryRunner.manager.save.mockResolvedValueOnce(mockPago);

      const result = await service.procesarPago(createPagoDto);
      expect(result.estado_pago).toBe('pagado');
    });
  });

  describe('cancelarPago', () => {
    it('should cancel payment successfully', async () => {
      const pagoId = 'some-uuid';
      const mockPago = {
        id: pagoId,
        estado: 'completado',
        pedido: {
          id: 'pedido-uuid',
          estado_pago: 'pagado'
        }
      };

      jest.spyOn(pagoRepository, 'findOne').mockResolvedValue(mockPago as any);
      mockQueryRunner.manager.save.mockResolvedValueOnce({
        ...mockPago,
        estado: 'cancelado',
        pedido: {
          ...mockPago.pedido,
          estado_pago: 'pendiente'
        }
      });

      const result = await service.cancelarPago(pagoId);
      expect(result.estado).toBe('cancelado');
      expect(result.pedido.estado_pago).toBe('pendiente');
    });

    it('should throw error if payment not found', async () => {
      const pagoId = 'non-existent-uuid';
      jest.spyOn(pagoRepository, 'findOne').mockResolvedValue(null);
      await expect(service.cancelarPago(pagoId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('obtenerPagosPorFecha', () => {
    it('debería retornar los pagos de una fecha específica', async () => {
      const fecha = new Date();
      const mockPagos = [
        { id: 'pago-1', fecha_creacion: fecha },
        { id: 'pago-2', fecha_creacion: fecha },
      ];

      jest.spyOn(pagoRepository, 'find').mockResolvedValue(mockPagos as any);

      const resultado = await service.obtenerPagosPorFecha(fecha);
      expect(resultado).toEqual(mockPagos);
    });
  });

  describe('obtenerPagosPorPedido', () => {
    it('debería retornar los pagos de un pedido específico', async () => {
      const pedidoId = 'pedido-uuid';
      const mockPagos = [
        { id: 'pago-1', pedido: { id: pedidoId } },
        { id: 'pago-2', pedido: { id: pedidoId } },
      ];

      jest.spyOn(pagoRepository, 'find').mockResolvedValue(mockPagos as any);

      const resultado = await service.obtenerPagosPorPedido(pedidoId);
      expect(resultado).toEqual(mockPagos);
    });
  });
}); 