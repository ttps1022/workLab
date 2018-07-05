import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { HttpServiceProvider } from '../../providers/http-service/http-service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  versionArray : any; 
  nowVersion   : string;
  systemType   : any = "LawMA";
  goUrl        : any;

  constructor(public navCtrl: NavController,private httpService:HttpServiceProvider) {

  }

  getPost(){    
    if (location.hostname === 'localhost'){
      this.goUrl = "http://localhost:8080/LawAP/api/chgLog/queryResult";
    }else{
      this.goUrl = location.origin + "/LawAP/api/chgLog/queryResult";
    }    
    console.log(this.goUrl);

  	this.httpService.post(this.goUrl,this.systemType,true).then(res=>{    
       this.nowVersion=res.responseObj[0].CHG_VER;
       this.versionArray=res.responseObj;
    });
  }     

  ngOnInit(){
    this.getPost();    
  }




}
