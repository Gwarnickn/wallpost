import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service.js';

@Injectable()
export class PostsService {
  constructor(private readonly database: DatabaseService) {}

  findAll() {
    return this.database.post.findMany();
  }
}
