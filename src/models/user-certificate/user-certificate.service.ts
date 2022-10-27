import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseService } from "src/common/base.service";
import { UserType } from "src/common/enums";
import { ResException } from "src/common/resException";
import { Repository } from "typeorm";
import { User } from "../user/user.entity";
import { CreateUserCertificateDto, UpdateUserCertificateDto, UserCertificateDto } from "./user-certificate.dtos";
import { UserCertificate } from "./user-certificate.entity";

@Injectable()
export class UserCertificateService extends BaseService<
    UserCertificate,
    CreateUserCertificateDto,
    UpdateUserCertificateDto,
    UserCertificateDto
> {
    constructor(
        @InjectRepository(UserCertificate) public repository: Repository<UserCertificate>,
        @InjectRepository(User) public userRepository: Repository<User>) {
        super();
    }

    async confirm(id: number): Promise<{ data: UserCertificate, status: number, errorMessage: string, errorMessageTechnical: string, meta: number }> {
        try {
            await this.repository.update(id, { confirm: true });
            const resData = await this.repository.findOne(id);
            await this.userRepository.update(resData.userId, { userType: UserType.ChefUser });
            //notification start
            //notification end
            return {
                data: resData as UserCertificate,
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

    async updateStatus(id: number, status: number): Promise<{ data: UserCertificate, status: number, errorMessage: string, errorMessageTechnical: string, meta: number }> {
        try {
            await this.repository.update(id, { status: status });
            const resData = await this.repository.findOne(id);
            return {
                data: resData as UserCertificate,
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