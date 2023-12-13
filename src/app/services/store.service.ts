import { Injectable, inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, map } from 'rxjs';
import { uploadRequestData } from '../layout/layout.model';
@Injectable({
  providedIn: 'root',
})
export class StoreService {
  private firestore = inject(AngularFirestore);

  getGalleryList(): Observable<any> {
    console.log('object');
    return this.firestore
      .collection('/galleryLits')
      .snapshotChanges().pipe(
        map(changes =>
          changes.map((c:any) =>
            ({ id: c.payload.doc.id, ...c.payload.doc.data() })
          )
        )
      );
  }
  addDataInStore(requestData: uploadRequestData, data: any) {
    const newItem = {
      title: requestData.title,
      tags: requestData.tags,
      uploadFile: data.Location,
      createdAt:new Date().getTime()
    };

    return this.firestore.collection('galleryLits').add(newItem);
  }

  getFilteredData(
    searchByInput: string,
    searchByTag: string,
  ): Observable<any> {

    let query = this.firestore.collection('galleryLits', (ref) => {
      let result: any = ref.orderBy('createdAt');
      if (searchByTag) {
        result = result.where('tags', 'array-contains', searchByTag);
      }
      if (searchByInput) {
        result = result
          .where('title', '>=', searchByInput)
          .where('title', '<=', searchByInput + '\uf8ff');
      }
      return result;
    });
    return query.valueChanges();
  }
  getPaginatedData(lastVisible?:any, pageSize = 5) {
    let query = this.firestore.collection('galleryLits', ref =>{
      if(lastVisible){
       return ref.orderBy('createdAt').startAfter(lastVisible?.createdAt).limit(pageSize)
      }else{
       return ref.orderBy('createdAt').limit(pageSize)
      }
    }
      
    );
    return query.valueChanges();
  }
}
