import { Controller, Get, Post, Param, Delete, Body, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RoleActionEnum } from 'src/common/enums';
import { RoleActions } from 'src/common/roles.decorator';
import { CreateRoleDto, RoleFilterDto, UpdateRoleDto } from "./role.dtos";

import { RoleService } from './role.service';
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  @RoleActions(RoleActionEnum.RoleCreate)
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @Post('list')
  @UseGuards(JwtAuthGuard)
  async list(@Body() roleFilterDto: RoleFilterDto) {
    return await this.roleService._list('role', roleFilterDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(+id, updateRoleDto);
  }

  @Post('getEmptyActions')
  @UseGuards(JwtAuthGuard)
  async getEmptyActions() {
    return await this.roleService.getEmptyActions();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  detail(@Param('id') id: string) {
    return this.roleService._detail(+id);
  }

  @Put('updateStatus/:id/:status')
  @UseGuards(JwtAuthGuard)
  @RoleActions(RoleActionEnum.RoleUpdate)
  updateStatus(@Param('id') id: string, @Param('status') status: number) {
    return this.roleService.updateStatus(+id, status);
  }

  @Post('dropdown')
  @UseGuards(JwtAuthGuard)
  dropdown(@Body() roleFilterDto: RoleFilterDto) {
    return this.roleService._dropdown(roleFilterDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  delete(@Param('id') id: string) {
    return this.roleService.delete(+id);
  }
}
