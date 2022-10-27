import { HttpStatus, Injectable } from '@nestjs/common';
import { BaseService } from '../../common/base.service';
import { Language } from './language.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLanguageDto, LanguageDto, LanguageFilterDto, UpdateLanguageDto } from './language.dtos';
import { ResException } from 'src/common/resException';
import { LanguageMapper } from './language.mapper';
import { Status } from 'src/common/enums';
import { DataTranslate } from '../data-translate/data-translate.entity';

@Injectable()
export class LanguageService extends BaseService<
Language,
CreateLanguageDto,
UpdateLanguageDto,
LanguageDto
> {
    constructor(
        @InjectRepository(Language) public repository: Repository<Language>,
        @InjectRepository(DataTranslate) public dataTranslateRepository: Repository<DataTranslate>
    ) {
        super();
    }
    async _create(createDto: CreateLanguageDto): Promise<{ data: Language, status: number, errorMessage: string, errorMessageTechnical: string, meta: number }> {
        try {
            const languageControl = await this.repository.findOne(undefined, {
                where: { name: createDto.name.toLowerCase() }
            });
            if (languageControl) {
                throw new ResException(
                    HttpStatus.FOUND,
                    "general.language_found"
                );
            }
            const res = await this.repository.insert(createDto);
            const resData = await this.repository.findOne(res.identifiers[0].id);
            return {
                data: resData as Language,
                status: 1,
                errorMessage: null,
                errorMessageTechnical: null,
                meta: null
            };
        } catch (error) {
            console.log(error);
            throw new ResException(
                HttpStatus.BAD_REQUEST,
                error?.response?.exceptionMessage ? error.response.exceptionMessage : error.message,
            );
        }
    }

    async updateStatus(id: number, status: number): Promise<{ data: Language, status: number, errorMessage: string, errorMessageTechnical: string, meta: number }> {
        try {
            await this.repository.update(id, { status: status });
            const resData = await this.repository.findOne(id);
            return {
                data: resData as Language,
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

    async _list(alias: string, languageFilterDto: LanguageFilterDto) {
        const builder = await this.repository.createQueryBuilder(alias);
        if (languageFilterDto.id)
            builder.where(alias + ".id = :s AND " + alias + ".status != :status", { s: `${languageFilterDto.id}`, status: Status.Deleted })
        else {
            if (languageFilterDto.status)
                builder.where(alias + ".status = :s", { s: `${languageFilterDto.status}` })
            else
                builder.where(alias + ".status != :s", { s: `${Status.Deleted}` })

            if (languageFilterDto.search)
                builder.where("LOWER(" + alias + ".name) LIKE :s OR LOWER(" + alias + ".shortName) LIKE :s", { s: `%${languageFilterDto.search.toLowerCase()}%` })

            if (languageFilterDto.name)
                builder.where("LOWER(" + alias + ".name) LIKE :s", { s: `%${languageFilterDto.name.toLowerCase()}%` })

            if (languageFilterDto.shortName)
                builder.where("LOWER(" + alias + ".shortName) LIKE :s", { s: `%${languageFilterDto.shortName.toLowerCase()}%` })
        }

        const sort: any = languageFilterDto.sortby;

        if (sort)
            builder.orderBy(alias + '.id', sort.order.toUpperCase());
        else
            builder.orderBy(alias + '.id', "DESC");

        const page: number = parseInt(languageFilterDto.page as any) || 1;
        const perPage: number = parseInt(languageFilterDto.limit as any) || 10;
        const total = await builder.getCount();

        builder.offset((page - 1) * perPage).limit(perPage);

        const data = await builder.getMany();
        const responseData = [];
        data.forEach(item => {
            responseData.push(LanguageMapper.ModelToDto(item));
        });
        return {
            data: responseData,
            status: 1,
            errorMessage: null,
            errorMessageTechnical: null,
            total,
            page,
            pageCount: Math.ceil(total / perPage)
        };
    }

    async deleteLanguage(languageId: number) {
        await this.dataTranslateRepository.createQueryBuilder('data_translate')
            .update(DataTranslate)
            .set({
                status: Status.Deleted
            })
            .where("languageId = :id", { id: languageId })
            .execute()
        await this.repository.update(languageId, { status: Status.Deleted })
        return {
            data: true,
            status: 1,
            errorMessage: null,
            errorMessageTechnical: null
        };
    }
}
