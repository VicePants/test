import { Injectable } from '@nestjs/common';
import { PrismaService } from '../PrismaService';
import { Prisma } from '@prisma/client';

@Injectable()
export default class TaskRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.task.findMany();
  }

  async delete(id: number) {
    return this.prisma.task.delete({
      where: {
        id,
      },
    });
  }

  async save(
    data:
      | Prisma.XOR<Prisma.TaskCreateInput, Prisma.TaskUncheckedCreateInput>
      | Prisma.XOR<Prisma.TaskUpdateInput, Prisma.TaskUncheckedUpdateInput>,
  ) {
    if (!data.id) {
      // Create a new task if no `id` is provided
      return this.prisma.task.create({
        data: data as Prisma.TaskCreateInput, // Ensure the data matches `TaskCreateInput`
      });
    }

    // Update an existing task if `id` is provided
    return this.prisma.task.update({
      where: {
        id: data.id as number, // Ensure `id` is a number
      },
      data: data as Prisma.TaskUpdateInput, // Ensure the data matches `TaskUpdateInput`
    });
  }
}
