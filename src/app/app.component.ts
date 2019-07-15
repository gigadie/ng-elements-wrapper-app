import { Component, OnInit } from '@angular/core';

import { AppLoaderService } from './services/app-loader.service';  

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'ng-elements-wrapper-app';
  apps: any;

  constructor(private appLoader: AppLoaderService) { }

  ngOnInit() {
  	this.appLoader
  		.getAppList()
  		.subscribe(
  			appList => this.apps = appList);
  }
}
