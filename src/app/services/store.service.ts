import { Injectable, inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, debounceTime, map } from 'rxjs';
import { uploadRequestData } from '../layout/layout.model';
@Injectable({
  providedIn: 'root',
})
export class StoreService {
  private firestore = inject(AngularFirestore);

  getTagList(): Observable<any> {
    console.log('object');
    return this.firestore
      .collection('/galleryLits')
      .snapshotChanges()
      .pipe(
        debounceTime(500),
        map((changes) =>
          changes.map((c: any) => ({
            id: c.payload.doc.id,
            ...c.payload.doc.data(),
          }))
        )
      );
  }

  checkTitleExists(requestData: uploadRequestData){
    return this.firestore
    .collection('galleryLits') 
    .valueChanges({ idField: 'id' })
    .pipe(
      map((items) => {
        const foundItem = items.find((item: any) => item.title.toLowerCase() === requestData.title.toLowerCase());
        return !!foundItem;
      })
    );

  }
  addDataInStore(requestData: uploadRequestData, data: any) {
    const newItem = {
      title: requestData.title,
      tags: requestData.tags,
      uploadFile: data.Location,
      createdAt: new Date().getTime(),
    };
    
    return this.firestore.collection('galleryLits').add(newItem);
  }

  getFilteredData(searchByInput: string, searchByTag: string): Observable<any> {
    return this.firestore
      .collection('/galleryLits', (ref) => {
        let filteredQuery: any = ref;
        if (searchByInput && searchByTag) {
          filteredQuery = filteredQuery
            .where('tags', 'array-contains', searchByTag)
            .where('title', '>=', searchByInput)
            .where('title', '<=', searchByInput + '\uf8ff').orderBy('title','desc').orderBy('createdAt','desc');
        } else {
          if (searchByTag) {
            filteredQuery = filteredQuery.where(
              'tags',
              'array-contains',
              searchByTag
            ).orderBy('createdAt','desc');
          }
          if (searchByInput) {
            filteredQuery = filteredQuery
              .where('title', '>=', searchByInput)
              .where('title', '<=', searchByInput + '\uf8ff').orderBy('title','desc').orderBy('createdAt','desc'); // For case-insensitive search
          }
        }

        if (searchByInput == '' && searchByTag == '') {
          filteredQuery = filteredQuery.orderBy('createdAt','desc');
        }

        return filteredQuery;
      })
      .snapshotChanges()
      .pipe(
        debounceTime(500),
        map((changes) =>
          changes.map((c: any) => ({
            id: c.payload.doc.id,
            ...c.payload.doc.data(),
          }))
        )
      );
  }
  getPaginatedData(lastVisible?: any, pageSize = 10): Observable<any> {
    let query = this.firestore.collection('galleryLits', (ref) => {
      if (lastVisible) {
        return ref
          .orderBy('createdAt','desc')
          .startAfter(lastVisible?.createdAt)
          .limit(pageSize);
      } else {
        return ref.orderBy('createdAt','desc').limit(pageSize);
      }
    });
    return query.valueChanges();
  }
}
