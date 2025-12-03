import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Books, BorrowHistory, BorrowInput, Users, vwAvailableBook } from '../model/model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApicallService {
  _baseUrl :  string = "/api/BookLibrary/";
  _headers = new HttpHeaders({
    'Content-Type': 'application/json',
    Accept: 'application/json, text/plain, */*'
  });
  private http = inject(HttpClient);

  constructor() { }


  GetBooksByKeyWords(keywords:string):Observable<Books[]> {
    let httpParams = new HttpParams()
      .set('keyword',  keywords)
    const sUrl = this._baseUrl + `book/search`;
    return this.http.get<Books[]>(sUrl, { params: httpParams, headers:this._headers });
  }

  GetAllUsers():Observable<Users[]> {
    const sUrl = this._baseUrl + `users`;
    return this.http.get<Users[]>(sUrl, { headers:this._headers });
  }

  GetAllBorrowedInventory():Observable<vwAvailableBook[]> {
    const sUrl = this._baseUrl + `book/all`;
    return this.http.get<vwAvailableBook[]>(sUrl, { headers:this._headers });
  }

  GetAvailableInventoryByISBN(isbn:string):Observable<vwAvailableBook[]> {
    const sUrl = this._baseUrl + `book/${isbn}`;
    return this.http.get<vwAvailableBook[]>(sUrl, { headers:this._headers });
  }

  BorrowAvailableBook(borrow:BorrowInput):Observable<BorrowHistory> {
    var formData: any = new FormData();
    formData.append('UserId', borrow.userId);
    formData.append('BookInventoryId', borrow.bookInventoryId);    
    const sUrl = this._baseUrl + `book`;
    let headersWithoutContentType = this._headers.delete('Content-Type');
    return this.http.post<BorrowHistory>(sUrl, formData, { headers: headersWithoutContentType});
  }

  BorrowBookReturn(bookInventoryId:number):Observable<BorrowHistory> {
    const sUrl = this._baseUrl + `book/${bookInventoryId}`;
    let headersWithoutContentType = this._headers.delete('Content-Type');
    return this.http.put<BorrowHistory>(sUrl, { headers: headersWithoutContentType});
  }
}
