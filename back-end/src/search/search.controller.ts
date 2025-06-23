import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async search(@Query('q') query: string) {
    if (!query) {
      return { users: [], groups: [] };
    }
    return this.searchService.searchAll(query);
  }
}