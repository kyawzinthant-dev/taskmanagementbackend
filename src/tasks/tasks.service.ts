import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';
@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {}

  // getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
  //   const { status, search } = filterDto;

  //   let tasks = this.getAllTasks();

  //   if (status) {
  //     tasks = tasks.filter((task) => task.status === status);
  //   }

  //   if (search) {
  //     tasks = tasks.filter((task) => task.title.includes(search) || task.description.includes(search));
  //   }
  //   return tasks;
  // }

  // getAllTasks(): Task[] {
  //   return this.tasks;
  // }
  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    return this.taskRepository.getTasks(filterDto, user);
  }
  async getTaskById(id: number, user: User): Promise<Task> {
    const found = await this.taskRepository.findOne({
      where: {
        id,
        userId: user.id,
      },
    });
    if (!found) {
      throw new NotFoundException(`task with id ${id} not found!`);
    }
    return found;
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto, user);
  }

  async deleteTask(id: number, user: User): Promise<void> {
    const result = await this.taskRepository.delete({
      id,
      userId: user.id,
    });
    if (!result.affected) {
      throw new NotFoundException(`task with id ${id} not found!`);
    }
  }
  // getTaskById(id: string): Task {
  //   const found = this.tasks.find((task) => task.id === id);
  //   if (!found) {
  //     throw new NotFoundException(`task with id ${id} not found!`);
  //   }
  //   return found;
  // }

  // deleteTask(id: string): Task[] {
  //   const found = this.getTaskById(id);
  //   this.tasks = this.tasks.filter((task) => task.id !== found.id);
  //   return this.tasks;
  // }

  // updateTask(id: string, status: TaskStatus): Task {
  //   const task = this.getTaskById(id);
  //   if (task) {
  //     task.status = status;
  //   }
  //   return task;
  // }
  async updateTask(id: number, status: TaskStatus, user: User): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.status = status;
    await task.save();
    return task;
  }
}
