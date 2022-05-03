import { Test, TestingModule } from '@nestjs/testing';
import { NotifyMeController } from './notify-me.controller';

describe('NotifyMeController', () => {
  let controller: NotifyMeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotifyMeController],
    }).compile();

    controller = module.get<NotifyMeController>(NotifyMeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
