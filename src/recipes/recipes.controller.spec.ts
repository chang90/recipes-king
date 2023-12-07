import { Test, TestingModule } from '@nestjs/testing';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { RecipesController } from './recipes.controller';
import { RecipesService } from './recipes.service';

const createRecipeDto: CreateRecipeDto = {
  firstStep: 1,
  totalTime: 10,
};

describe('RecipesController', () => {
  let recipesController: RecipesController;
  let recipesService: RecipesService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [RecipesController],
      providers: [
        RecipesService,
        {
          provide: RecipesService,
          useValue: {
            create: jest
              .fn()
              .mockImplementation((recipe: CreateRecipeDto) =>
                Promise.resolve({ id: '1', ...recipe }),
              ),
            findAll: jest.fn().mockResolvedValue([
              {
                firstStep: 1,
                totalTime: 10,
              },
              {
                firstStep: 3,
                totalTime: 5,
              },
            ]),
            findOne: jest.fn().mockImplementation((id: string) =>
              Promise.resolve({
                firstStep: 1,
                totalTime: 10,
                id,
              }),
            ),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    recipesController = app.get<RecipesController>(RecipesController);
    recipesService = app.get<RecipesService>(RecipesService);
  });

  it('should be defined', () => {
    expect(recipesController).toBeDefined();
  });

  describe('create()', () => {
    it('should create a recipe', () => {
      recipesController.create(createRecipeDto);
      expect(recipesController.create(createRecipeDto)).resolves.toEqual({
        id: '1',
        ...createRecipeDto,
      });
      expect(recipesService.create).toHaveBeenCalledWith(createRecipeDto);
    });
  });

  describe('update()', () => {
    it('should update a recipe', () => {
      recipesController.update('1', {
        firstStep: 3,
        totalTime: 10,
        id: 1,
      });
      expect(recipesService.update).toHaveBeenCalled();
    });
  });

  describe('findAll()', () => {
    it('should find all recipes ', () => {
      recipesController.findAll();
      expect(recipesService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne()', () => {
    it('should find a recipe', () => {
      expect(recipesController.findOne(1)).resolves.toEqual({
        firstStep: 1,
        totalTime: 10,
        id: 1,
      });
      expect(recipesService.findOne).toHaveBeenCalled();
    });
  });

  describe('remove()', () => {
    it('should remove the recipe', () => {
      recipesController.remove('2');
      expect(recipesService.remove).toHaveBeenCalled();
    });
  });
});
