import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { Board } from './entities/board.entity';

@Controller('boards')
export class BoardController {
  constructor(private readonly boardService: BoardService) { }

  @Post()
  create(@Body() createBoardDto: CreateBoardDto) {
    return this.boardService.create(createBoardDto);
  }

  @Get()
  findAll(): Promise<Board[]> {
    return this.boardService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.boardService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateBoardDto: UpdateBoardDto) {
    return this.boardService.update(id, updateBoardDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.boardService.remove(id);
  }
}
