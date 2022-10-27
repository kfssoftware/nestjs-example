import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { LocationService } from './location.service';
import { CreateLocationDto, LocationFilterDto, UpdateLocationDto } from "./location.dtos";
import { RoleActions } from 'src/common/roles.decorator';
import { RoleActionEnum } from 'src/common/enums';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createLocationDto: CreateLocationDto) {
    return this.locationService.create(createLocationDto);
  }

  @Post('list')
  async list(@Body() locationFilterDto: LocationFilterDto) {
    const data = await this.locationService._list('location', locationFilterDto);
    return data;
  }

  @Post('treeList')
  async treeList() {
    const data = await this.locationService._treeList('location');
    return data;
  }

  @Put('updateStatus/:id/:status')
  @UseGuards(JwtAuthGuard)
  @RoleActions(RoleActionEnum.LocationUpdate)
  updateStatus(@Param('id') id: string, @Param('status') status: number) {
    return this.locationService.updateStatus(+id, status);
  }

  @Post('dropdown')
  @UseGuards(JwtAuthGuard)
  dropdown(@Body() locationFilterDto: LocationFilterDto) {
    return this.locationService._dropdown('location', locationFilterDto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  detail(@Param('id') id: string) {
    return this.locationService.detail(+id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateLocationDto: UpdateLocationDto) {
    return this.locationService.update(+id, updateLocationDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  delete(@Param('id') id: string) {
    return this.locationService.delete(+id);
  }
}

