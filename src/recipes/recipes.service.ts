import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { Recipe } from './recipe.entity';

@Injectable()
export class RecipesService {
  constructor(
    @InjectRepository(Recipe)
    private readonly recipesRepository: Repository<Recipe>,
  ) {}

  create(createRecipeDto: CreateRecipeDto): Promise<Recipe> {
    const recipe = new Recipe();
    console.log(createRecipeDto);
    recipe.firstStep = createRecipeDto.firstStep;
    recipe.totalTime = createRecipeDto.totalTime;
    return this.recipesRepository.save(recipe);
  }

  async findAll(): Promise<Recipe[]> {
    return this.recipesRepository.find();
  }

  async findOne(id: number): Promise<Recipe | null> {
    return this.recipesRepository.findOneBy({ id: id });
  }

  async update(id: number, recipe: Recipe): Promise<Recipe | null> {
    await this.recipesRepository.update(id, recipe);
    return this.recipesRepository.findOneBy({ id: id });
  }

  async remove(id: string): Promise<void> {
    await this.recipesRepository.delete(id);
  }
}
