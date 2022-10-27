import { HttpStatus, Injectable } from '@nestjs/common';
import { BaseService } from '../../common/base.service';
import { DataTranslate } from './data-translate.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDataTranslateDto, DataTranslateDto, DataTranslateFilterDto, UpdateDataTranslateDto } from './data-translate.dtos';
import { ResException } from 'src/common/resException';
import { DataTranslateMapper } from './data-translate.mapper';
import { Language } from '../language/language.entity';
import { Status } from 'src/common/enums';

@Injectable()
export class DataTranslateService extends BaseService<
DataTranslate,
CreateDataTranslateDto,
UpdateDataTranslateDto,
DataTranslateDto
> {
    constructor(@InjectRepository(DataTranslate) public repository: Repository<DataTranslate>,
        @InjectRepository(Language) public languageRepository: Repository<Language>) {
        super();
    }

    async _create(alias: string, createDataTranslateDto: CreateDataTranslateDto): Promise<{ data: DataTranslate[], status: number, errorMessage: string, errorMessageTechnical: string, meta: number }> {
        try {
            const keywordControl = await this.repository.findOne(undefined, {
                where: { keyword: createDataTranslateDto.keyword.toLowerCase() }
            });
            if (keywordControl) {
                throw new ResException(
                    HttpStatus.FOUND,
                    "general.translate_found"
                );
            }
            let insertedData = [];
            if (createDataTranslateDto.keyword && createDataTranslateDto.translateList) {
                await Promise.all(
                    createDataTranslateDto.translateList.map(async (item: DataTranslate) => {
                        if (item.value) {
                            item.languageId = item.id;
                            item.keyword = createDataTranslateDto.keyword;
                            item.status = 1;
                            const res = await this.repository.insert(item);
                            const resData = await this.repository.findOne(res.identifiers[0].id);
                            insertedData.push(resData);
                        }
                    }));
            }
            return {
                data: insertedData,
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

    async _update(id: number, updateDto: UpdateDataTranslateDto): Promise<{ data: DataTranslate[], status: number, errorMessage: string, errorMessageTechnical: string, meta: number }> {
        try {
            let updatedData = [];
            if (updateDto.keyword && updateDto.translateList) {
                await Promise.all(
                    updateDto.translateList.map(async (item: DataTranslate) => {
                        if (item.value) {
                            const getLanguage = await this.repository.find({ where: { id: id, languageId: item.languageId, status: Status.Active } });
                            item.keyword = updateDto.keyword;
                            if (getLanguage && getLanguage.length > 0) {
                                await this.repository.update(id, item);
                                const resData = await this.repository.findOne(item.id);
                                updatedData.push(resData);
                            }
                            else {
                                await this.repository.insert(item);
                                const resData = await this.repository.findOne(item.id);
                                updatedData.push(resData);
                            }
                        }
                    }));
            }
            return {
                data: updatedData,
                status: 1,
                errorMessage: null,
                errorMessageTechnical: null,
                meta: null
            };
        } catch (error) {
            console.log(error);
            throw new ResException(
                HttpStatus.BAD_REQUEST,
                error.message,
            );
        }
    }

    async _detail(id: number) {
        let getDetail = await this.repository.findOne(id) as any;
        const getLanguage = await this.languageRepository.find({ where: { status: Status.Active } });
        let translateList = [];
        await Promise.all(
            getLanguage.map(async (item: Language) => {
                const getTranslateList = await this.repository.findOne({ where: { languageId: item.id, keyword: getDetail.keyword }, relations: ["language"] });
                if (getTranslateList)
                    translateList.push(getTranslateList);
                else
                    translateList.push({
                        languageId: item.id,
                        value: "",
                        language: item,
                        keyword: getDetail.keyword
                    });

            }));
        getDetail.translateList = translateList;
        return {
            data: getDetail,
            status: 1,
            errorMessage: null,
            errorMessageTechnical: null
        };
    }

    async _list(alias: string, dataTranslateFilterDto: DataTranslateFilterDto) {
        const builder = await this.repository.createQueryBuilder(alias);
        if (dataTranslateFilterDto.id)
            builder.where("data_translate.id = :s", { s: `${dataTranslateFilterDto.id}` })
        else {
            if (dataTranslateFilterDto.search)
                builder.where("data_translate.keyword LIKE :s OR data_translate.value LIKE :s", { s: `%${dataTranslateFilterDto.search}%` })

            if (dataTranslateFilterDto.languageId)
                builder.where("data_translate.languageId = :s", { s: `${dataTranslateFilterDto.languageId}` })

            if (dataTranslateFilterDto.keyword)
                builder.where("data_translate.keyword LIKE :s", { s: `%${dataTranslateFilterDto.keyword}%` })

            if (dataTranslateFilterDto.value)
                builder.where("data_translate.value LIKE :s", { s: `%${dataTranslateFilterDto.value}%` })

            if (dataTranslateFilterDto.status)
                builder.where("data_translate.status = :s", { s: `${dataTranslateFilterDto.status}` })
        }

        builder.relation("language");

        builder.leftJoinAndSelect(alias + ".language", "language")

        const sort: any = dataTranslateFilterDto.sortby;

        if (sort)
            builder.orderBy('data_translate.id', sort.order.toUpperCase());
        else
            builder.orderBy(alias + '.id', "DESC");

        const page: number = parseInt(dataTranslateFilterDto.page as any) || 1;
        const perPage: number = parseInt(dataTranslateFilterDto.limit as any) || 10;
        const total = await builder.getCount();

        builder.offset((page - 1) * perPage).limit(perPage);

        const data = await builder.getMany();
        const responseData = [];
        data.forEach(item => {
            responseData.push(DataTranslateMapper.ModelToDto(item));
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

    async missingList(alias: string, dataTranslateFilterDto: DataTranslateFilterDto) {
        const builder = await this.repository.createQueryBuilder(alias);
        let turkishLanguage = await this.languageRepository.findOne(undefined, {
            where: { name: 'Türkçe' },
        });
        let englishLanguage = await this.languageRepository.findOne(undefined, {
            where: { name: 'English' },
        });
        const firstLanguage = turkishLanguage?.id == dataTranslateFilterDto.languageId ? turkishLanguage?.id : englishLanguage?.id;
        const secondLanguage = turkishLanguage?.id == dataTranslateFilterDto.languageId ? englishLanguage?.id : turkishLanguage?.id;

        builder.leftJoinAndSelect('data_translate', 'tr', 'tr.keyword = ' + alias + '.keyword and tr.languageId=' + firstLanguage + ' and tr.status=' + Status.Active);
        builder.where(alias + '.status = :status AND ' + alias + '.languageId = :languageId AND (tr.value is null or tr.keyword=tr.value)', {
            status: Status.Active,
            languageId: secondLanguage
        })
        if (dataTranslateFilterDto.id)
            builder.andWhere("data_translate.id = :s", { s: `${dataTranslateFilterDto.id}` })

        builder.relation("language");

        builder.leftJoinAndSelect(alias + ".language", "language")
        const sort: any = dataTranslateFilterDto.sortby;

        if (sort)
            builder.orderBy('data_translate.id', sort.order.toUpperCase());
        else
            builder.orderBy(alias + '.id', "DESC");

        const page: number = parseInt(dataTranslateFilterDto.page as any) || 1;
        const perPage: number = parseInt(dataTranslateFilterDto.limit as any) || 10;
        const total = await builder.getCount();

        builder.offset((page - 1) * perPage).limit(perPage);

        const data = await builder.getMany();
        const responseData = [];
        await Promise.all(data.map(async item => {
            responseData.push(DataTranslateMapper.ModelToDto(item));
        }));
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

    async _dropdown(languageId: number) {
        const builder = await this.repository.createQueryBuilder('data_translate');
        if (languageId)
            builder.where("data_translate.languageId = :s", { s: `${languageId}` })
        builder.orderBy('data_translate.id', "DESC");
        const total = await builder.getCount();
        return {
            data: await builder.getMany(),
            status: 1,
            errorMessage: null,
            errorMessageTechnical: null,
            total,
            page: 1,
            pageCount: Math.ceil(total / 99999999999)
        };
    }
}
