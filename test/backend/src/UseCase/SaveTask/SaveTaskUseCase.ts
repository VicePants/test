import { Injectable } from '@nestjs/common';
import { Task } from '@prisma/client';
import { UseCase } from '../../index';
import SaveTaskDto from './SaveTaskDto';
import TaskRepository from '../../repositories/TaskRepository';

@Injectable()
export default class SaveTaskUseCase
  implements UseCase<Promise<Task>, [dto: SaveTaskDto]>
{
  constructor(private readonly taskRepository: TaskRepository) {}

  async handle(dto: SaveTaskDto): Promise<Task> {
    // Validate the DTO
    if (!dto.name || dto.name.trim().length === 0) {
      throw new Error('Task name is required.');
    }

    try {
      // Save the data
      const savedTask = await this.taskRepository.save({
        id: dto.id, // Optional for new tasks
        name: dto.name,
        description: dto.description, // Add additional fields as needed
      });

      return savedTask;
    } catch (error) {
      console.error('Error saving task:', error);
      throw new Error('Failed to save task. Please try again.');
    }
  }
}
