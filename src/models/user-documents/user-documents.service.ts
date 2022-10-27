import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseService } from "src/common/base.service";
import { ResException } from "src/common/resException";
import { Repository } from "typeorm";
import {CreateUserDocumentsDto,UpdateUserDocumentsDto, UserDocumentsDto} from "./user-documents.dtos";

import { UserDocuments } from "./user-documents.entity";

@Injectable()
export class UserDocumentsService extends BaseService<
UserDocuments,
CreateUserDocumentsDto,
UpdateUserDocumentsDto,
UserDocumentsDto
> {
    constructor(@InjectRepository(UserDocuments) public repository: Repository<UserDocuments>) {
        super();
    }

    async updateStatus(id: number, status: number): Promise<{ data: UserDocuments, status: number, errorMessage: string, errorMessageTechnical: string, meta: number }> {
        try {
            await this.repository.update(id, { status: status });
            const resData = await this.repository.findOne(id);
            return {
                data: resData as UserDocuments,
                status: 1,
                errorMessage: null,
                errorMessageTechnical: null,
                meta: null,
            };
        } catch (error) {
            throw new ResException(
                HttpStatus.BAD_REQUEST,
                error.message,
            );
        }
    }
}