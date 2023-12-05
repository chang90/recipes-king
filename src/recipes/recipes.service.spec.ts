import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Recipe } from './recipe.entity';
import { RecipesService } from './recipes.service';
import { Repository } from 'typeorm';

const recipeArray = [
  {
    firstStep: 1,
    totalTime: 10,
  },
  {
    firstStep: 3,
    totalTime: 5,
  },
];

const oneRecipe = {
  firstStep: 1,
  totalTime: 10,
};

describe('RecipeService', () => {
  let service: RecipesService;
  let repository: Repository<Recipe>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecipesService,
        {
          provide: getRepositoryToken(Recipe),
          useValue: {
            find: jest.fn().mockResolvedValue(recipeArray),
            findOneBy: jest.fn().mockResolvedValue(oneRecipe),
            save: jest.fn().mockResolvedValue(oneRecipe),
            remove: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RecipesService>(RecipesService);
    repository = module.get<Repository<Recipe>>(getRepositoryToken(Recipe));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create()', () => {
    it('should successfully insert a recipe', () => {
      const oneRecipe = {
        firstStep: 1,
        totalTime: 10,
      };

      expect(
        service.create({
          firstStep: 1,
          totalTime: 10,
        }),
      ).resolves.toEqual(oneRecipe);
    });
  });

  describe('findAll()', () => {
    it('should return an array of recipes', async () => {
      const recipes = await service.findAll();
      expect(recipes).toEqual(recipeArray);
    });
  });

  describe('findOne()', () => {
    it('should get a single recipe', () => {
      const repoSpy = jest.spyOn(repository, 'findOneBy');
      expect(service.findOne(1)).resolves.toEqual(oneRecipe);
      expect(repoSpy).toBeCalledWith({ id: 1 });
    });
  });

  describe('remove()', () => {
    it('should call remove with the passed value', async () => {
      const removeSpy = jest.spyOn(repository, 'delete');
      const retVal = await service.remove('2');
      expect(removeSpy).toBeCalledWith('2');
      expect(retVal).toBeUndefined();
    });
  });
});
