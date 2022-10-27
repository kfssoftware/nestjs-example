import { HttpStatus, Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { BucketType, DocumentType } from 'src/common/enums';
import { ResException } from 'src/common/resException';
import { v4 as uuid } from 'uuid';
@Injectable()
export class UploadFileService {
  public async uploadFile(file: any, body: any) {
    const buckets = process.env.BUCKET_NAMES.split(',');
    let bucketName = buckets[BucketType.Category];
    const response: any = [];
    const data: any = [];
    const fileType = body.fileType as DocumentType;

    if (fileType == DocumentType.Category) {
      bucketName = buckets[BucketType.Category];
    } else if (fileType == DocumentType.Certificates) {
      bucketName = buckets[BucketType.Certificates];
    } else if (fileType == DocumentType.ProfilePhotos) {
      bucketName = buckets[BucketType.ProfilePhotos];
    } else if (fileType == DocumentType.Recipe) {
      bucketName = buckets[BucketType.Recipe];
    } else if (fileType == DocumentType.Product) {
      bucketName = buckets[BucketType.Product];
    } else if (fileType == DocumentType.Activity) {
      bucketName = buckets[BucketType.Activity];
    }
    else {
      bucketName = buckets[BucketType.Category];
    };
    file.file.map((file: any) => response.push(file));
    for (const res of response) {
      const fileName = `${uuid()}.${res.originalname.split('.').pop()}`;
      const fileBuffer = res.buffer;
      try {
        const s3 = new S3({
          endpoint: "s3.fr-par.scw.cloud",
          credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
          }
        });
        const upload = await s3.upload({
          Bucket: bucketName,
          Body: fileBuffer,
          Key: fileName,
          ACL: 'public-read'
        }).promise();
        data.push({ downloadUrl: upload.Location.toString(), fileKey: upload.Key, fileName: fileName });
      } catch (e) {
        console.log(e);
        throw new ResException(
          HttpStatus.BAD_REQUEST,
          "general.not_upload_file"
        );
      }
    }
    return {
      data: data,
      status: 1,
      errorMessage: null,
      errorMessageTechnical: null,
      meta: null,
    };
  }
}
