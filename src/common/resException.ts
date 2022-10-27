import { HttpException, HttpStatus } from '@nestjs/common';
export class ResException extends HttpException {
  constructor(code: HttpStatus, message: string) {
    super({ code, data: null, status: 2, exceptionMessage: message, exceptionMessageTechnical: message }, code);
  }
}
