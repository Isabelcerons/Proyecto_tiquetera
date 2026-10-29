import { Test, TestingModule } from '@nestjs/testing';
import { PagosController } from './pagos.controller';
import { PagosService } from './pagos.service';
import { CreatePagoDto } from './dto/create-pago.dto';

describe('PagosController', () => {
  let controller: PagosController;
  let service: PagosService;

  const mockPagosService = {
    procesarPago: jest.fn(),
    cancelarPago: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PagosController],
      providers: [
        {
          provide: PagosService,
          useValue: mockPagosService,
        },
      ],
    }).compile();

    controller = module.get<PagosController>(PagosController);
    service = module.get<PagosService>(PagosService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('procesarPago', () => {
    it('should process payment successfully', async () => {
      const createPagoDto: CreatePagoDto = {
        pedido_id: 'some-uuid',
        metodo_pago: 'efectivo',
        monto: 50000,
      };

      const mockResult = {
        id: 'some-uuid',
        estado_pago: 'pagado',
      };

      mockPagosService.procesarPago.mockResolvedValue(mockResult);

      const result = await controller.procesarPago(createPagoDto);

      expect(result).toBe(mockResult);
      expect(service.procesarPago).toHaveBeenCalledWith(createPagoDto);
    });
  });

  describe('cancelarPago', () => {
    it('should cancel payment successfully', async () => {
      const pedidoId = 'some-uuid';
      const mockResult = {
        id: pedidoId,
        estado_pago: 'pendiente',
      };

      mockPagosService.cancelarPago.mockResolvedValue(mockResult);

      const result = await controller.cancelarPago(pedidoId);

      expect(result).toBe(mockResult);
      expect(service.cancelarPago).toHaveBeenCalledWith(pedidoId);
    });
  });
}); 