import {
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiConsumes } from '@nestjs/swagger';
import { UploadFileService } from './upload-file.service';
@Controller('upload-file')
@UsePipes(
  new ValidationPipe({
    whitelist: true,
    transform: true,
  }),
)
export class UploadFileController {
  constructor(private uploadFileService: UploadFileService) { }
  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'file', maxCount: 5 },
    ]),
  )
  public async uploadFile(@UploadedFiles() file: any, @Body() body: any) {
    return this.uploadFileService.uploadFile(file, body);
  }
}
