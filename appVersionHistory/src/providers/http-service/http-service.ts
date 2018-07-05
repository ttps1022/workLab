import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class HttpServiceProvider {
  loader: any;  
    
  private headers = new Headers({ 'Content-Type': 'application/json' });
  private options = new RequestOptions({ headers: this.headers });

  constructor(public http: Http) {    
    console.log('call HttpServiceProvider Provider');
  }

  public get(url: string, paramObj: any) {
            return this.http.get(url + this.toQueryString(paramObj))
                       .toPromise()
                       .then(res => this.handleSuccess(res.json()))
                       .catch(error => this.handleError(error));
   } 

  // 導致 POST 變成 options
  // 解決網址 https://laravel-china.org/topics/6321/the-problem-of-sending-post-requests-to-options-when-axios-cross-domain-is-solved 
  public  post(url: string, paramObj: any ,verify:boolean) {   
    let headers = new Headers({'Content-Type': 'application/json'});
        headers.append('Authorization', 'Basic ' +   btoa('user:sad!dl;#@dosa')); 

        if (!verify){
          return this.http.post(url, paramObj)
                          .toPromise()
                          .then(res => this.handleSuccess(res.json()))
                          .catch(error => this.handleError(error));  
        }else{
          return this.http.post(url, paramObj, new RequestOptions({headers: headers}))                
                          .toPromise()
                          .then(res => this.handleSuccess(res.json()))
                          .catch(error => this.handleError(error));
        }  
 }

 private handleSuccess(result) {//請求成功的回調  
//   if (result && result.resultCode != "0000") {
//    let params = {
//         title: "錯誤！",
//         subTitle: result.message,
//    }
//  }
 return result;
}

private handleError(error: Response | any) {//請求失败的回調
 let msg = '請求失敗';
 if (error.status == 0) {
   msg = '請求地址錯誤';
 }
 if (error.status == 400) {
   msg = '請求無效';
   console.log('請檢查參數類型是否匹配');
 }
 if (error.status == 404) {
   msg = '請求資源不存在';
   console.error(msg+'，請檢查路徑否正確');
 }
 let params = {
      title: "錯誤!",
      subTitle: msg,
 }
 return {success: false, msg: msg};
 }

 /**
* @param obj　参数对象
* @return {string}　参数字符串
* @example
*  聲明: var obj= {'name':'zhangsan',sex:1};
*  調用: toQueryString(obj);
*  返回: "?name=zhangsan&age=1"
*/
 private toQueryString(obj) {
 let ret = [];
 for (let key in obj) {
   key = encodeURIComponent(key);
   let values = obj[key];
   if (values && values.constructor == Array) {//陣列
     let queryValues = [];
     for (let i = 0, len = values.length, value; i < len; i++) {
       value = values[i];
       queryValues.push(this.toQueryPair(key, value));
     }
     ret = ret.concat(queryValues);
   } else { //字符串
     ret.push(this.toQueryPair(key, values));
   }
}
let str = obj?'?' + ret.join('&'):""
return str;

}

 private toQueryPair(key, value) {
 if (typeof value == 'undefined') {
   return key;
 }
 return key + '=' + encodeURIComponent(value === null ? '' : String(value));
 }    

}
