import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service.js';
import { Post } from '@prisma/client';

@Injectable()
export class PostsService {
  constructor(private readonly database: DatabaseService) {}

  findAll() {
    return this.database.post.findMany();
  }

  async likePost(id: bigint) {
    const post = await this.database.post.findUnique({
      where: { id },
      select: { likes: true },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return this.database.post.update({
      where: { id },
      data: { likes: { increment: 1 } },
    });
  }

  async unlikePost(id: bigint) {
    const post = await this.database.post.findUnique({
      where: { id },
      select: { likes: true },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if(post.likes <= 0){
      return post;
    }
    
    return this.database.post.update({
      where: { id },
      data: { likes: { decrement: 1 } },
    });
  }

  async slopPost(id: bigint) {
    const post = await this.database.post.findUnique({
      where: { id },
      select: { slop: true },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return this.database.post.update({
      where: { id },
      data: { slop: { increment: 1 } },
    });
  }

  async getSelected(ids: bigint[]) {
    const posts = await this.database.post.findMany({
      where: { id: { in: ids } },
    });

    const byId = new Map(posts.map((p) => [p.id.toString(), p]));
    return ids
      .map((id) => byId.get(id.toString()))
      .filter((p): p is Post => !!p);
  }
}
