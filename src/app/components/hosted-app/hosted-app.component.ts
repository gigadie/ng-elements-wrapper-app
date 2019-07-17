import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';

import { AppLoaderService } from '../../services/app-loader.service';  

@Component({
  selector: 'app-hosted-app',
  templateUrl: './hosted-app.component.html',
  styleUrls: ['./hosted-app.component.scss']
})
export class HostedAppComponent implements OnInit {
  
  injecting: boolean;
  state = {
    id: 'asdsdas',
    aa: 3
  };

  constructor(
    private elementRef: ElementRef,
  	private route: ActivatedRoute,
    private router: Router,
  	private appLoader: AppLoaderService,
    private renderer: Renderer2
  ) { }

  ngOnInit() {
  	this.route.paramMap
  		.subscribe(
  			params => {
  				this.init(params.get('appRoute'));
  			});
  }

  private init(appRoute: string) {
    this.appLoader
        .loadApp(appRoute/*, this.renderer*/)
        .then(_ => this.injectApp(appRoute))
        .catch(_ => this.router.navigate(['/error']));
  }

  private injectApp(appRoute: string) {

    const htmlEl = this.elementRef.nativeElement.querySelector(`[app-id]`);
    if (htmlEl) {
      this.renderer.removeChild(this.elementRef.nativeElement, htmlEl);
    }

    this.injecting = true;
    this.appLoader
      .getApp(appRoute)
      .subscribe(
        app => {
          const appHTML = this.renderer.createElement(app.tag);
          appHTML.setAttribute('app-id', app.id);
          appHTML.setAttribute('state', JSON.stringify(this.state));
          appHTML.addEventListener('message', msg => this.handleMessage(msg));
          this.renderer.appendChild(this.elementRef.nativeElement, appHTML);
          this.injecting = false;
          console.log(`${app.id} Injected`);
        });
  }

  private handleMessage(msg) {
    console.log(msg);
  }

}
