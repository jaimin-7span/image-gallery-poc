import { Injectable } from "@angular/core";
import * as AWS from 'aws-sdk';
import { Observable } from "rxjs";
import { uploadRequestData } from "../layout/layout.model";

@Injectable({
  providedIn: 'root',
})

export class UploadService {
    setAWSConfig(){
        AWS.config.update({
            accessKeyId: 'AKIAWN5TGMRYADSPVLEQ',
            secretAccessKey: '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',
            region: 'ap-south-1',
          });
         return new AWS.S3();
    }

    uploadFileToBucket(requestData:uploadRequestData){
        const bucket = this.setAWSConfig()
        const params = {
            Bucket: 'poc-image-gallery',
            Key: requestData.uploadFile.name,
            Body: requestData.uploadFile,
            ACL: 'public-read',
            ContentType: requestData.uploadFile.type
          };
          
          return new Observable<{ progress: number, data?: any }>((observer) => {
            bucket.upload(params, { partSize: 5 * 1024 * 1024 })
            .on('httpUploadProgress', (progress:{ loaded: number; total: number }) => {
              const percentage:number = (progress.loaded / progress.total) * 100;
              observer.next({ progress: percentage });
            })
            .send((err:any, data:any) => {
              if (err) {
                observer.error(err);
              } else {
                observer.next({ progress: 100, data });
              }
            });
        })   
    }
}
