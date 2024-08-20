import { Test, TestingModule } from '@nestjs/testing';
import { ReservationsResolver } from './reservations.resolver';

describe('ReservationsResolver', () => {
  let resolver: ReservationsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReservationsResolver],
    }).compile();

    resolver = module.get<ReservationsResolver>(ReservationsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
