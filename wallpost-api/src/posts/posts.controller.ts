import {
  Body,
  Controller,
  Get,
  Param,
  ParseArrayPipe,
  ParseIntPipe,
  Patch,
  Query,
  Post,
} from '@nestjs/common';
import { PostsService } from './posts.service.js';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Post('scan')
  scanPoster(@Body() body: { image: string }) {
    return this.postsService.scanPoster(body.image);
  }

  @Post()
  createPost(
    @Body()
    body: {
      title: string;
      startDate: string;
      endDate: string;
      description: string;
      image: string;
      lat: number;
      lng: number;
    },
  ) {
    return this.postsService.createPost(body);
  }

  @Patch('like/:id')
  likePost(@Param('id', ParseIntPipe) id: bigint) {
    return this.postsService.likePost(id);
  }

  @Patch('unlike/:id')
  unlikePost(@Param('id', ParseIntPipe) id: bigint) {
    return this.postsService.unlikePost(id);
  }

  @Patch('slop/:id')
  slopPost(@Param('id', ParseIntPipe) id: bigint) {
    return this.postsService.slopPost(id);
  }

  @Get('saved')
  getSaved(
    @Query('ids', new ParseArrayPipe({ items: Number, separator: ',' }))
    ids: bigint[],
  ) {
    return this.postsService.getSelected(ids);
  }
}
