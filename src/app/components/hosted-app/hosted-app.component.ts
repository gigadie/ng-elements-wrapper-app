import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { AppLoaderService } from '../../services/app-loader.service';  

@Component({
  selector: 'app-hosted-app',
  templateUrl: './hosted-app.component.html',
  styleUrls: ['./hosted-app.component.scss']
})
export class HostedAppComponent implements OnInit {

  state = {
    id: 'asdsdas',
    aa: 3
  };

  constructor(
    private elementRef: ElementRef,
  	private route: ActivatedRoute,
  	private appLoader: AppLoaderService,
    private renderer: Renderer2
  ) { }

  ngOnInit() {
  	this.route.paramMap
  		.subscribe(
  			params => {
  				this.init(params.get('appId'));
  			});
  }

  private init(appId: string) {
    this.appLoader.loadApp(appId);
    this.injectApp(appId);
  }

  private injectApp(appId: string) {

    const htmlEl = this.elementRef.nativeElement.querySelector(`[app-id]`);
    if (htmlEl) {
      this.renderer.removeChild(this.elementRef.nativeElement, htmlEl);
    }

    this.appLoader
      .getApp(appId)
      .subscribe(
        app => {
          const appHTML = this.renderer.createElement(app.tag);
          appHTML.setAttribute('app-id', app.id);
          appHTML.setAttribute('state', JSON.stringify(this.state));
          appHTML.addEventListener('message', msg => this.handleMessage(msg));
          this.renderer.appendChild(this.elementRef.nativeElement, appHTML);
          // this.apps[appId].injected = true;
          // this.apps[appId].injecting = false;
          console.log(`${appId} Injected`);
        });
  }

  private handleMessage(msg) {
    console.log(msg);
  }

}
