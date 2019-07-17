import { /*Inject, */Injectable/*, Renderer2, PLATFORM_ID*/ } from '@angular/core';
// import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppLoaderService {

	private apps = [
		{
			id: 'app1',
			route: 'app1',
			file: 'app1.js',
			tag: 'ng-elements-app',
			title: 'App w/o routing',
			loading: false,
			loaded: null,
			injected: false,
			active: false
		}, {
			id: 'app2',
			route: 'app2',
			file: 'app2.js',
			tag: 'ng-elements-app-routing',
			title: 'App with routing',
			loading: false,
			loaded: null,
			injected: false,
			active: false
		}, {
			id: 'app3',
			route: 'app-kaboom',
			file: 'app3.js',
			tag: 'ng-elements-app-dynamic-routing',
			title: 'App with dynamic routing',
			loading: false,
			loaded: null,
			injected: false,
			active: false
		}
	];

	constructor(
		/*@Inject(PLATFORM_ID) private _platformId: Object,
		@Inject(DOCUMENT) private _document: any*/
	) { }

	getAppList() {
		return of(this.apps);
	}

	getApp(appRoute: string) {
		return of(this.apps.find(app => app.route === appRoute));
	}

	loadApp(appRoute: string/*, renderer: Renderer2*/) {
		let appToLoad = this.apps.find(app => app.route === appRoute);
		if (!appToLoad) {
			return new Promise((_, reject) => reject(new Error('App not found')));
		}

		if (!appToLoad.loaded) {
			appToLoad.loaded = this.loadScript(appToLoad/*, renderer*/);
		}

		appToLoad.loading = true;
		
		return appToLoad
			.loaded
			.then(_ => {
				console.log(`${appToLoad.id} Activated`);
				this.activateApp(appToLoad);
			})
			.finally(_ => appToLoad.loading = false);
	}

	private activateApp(appToLoad: any) {
		this.apps.forEach(app => app.active = false);
		appToLoad.active = true;
	}

	private loadScript(appToLoad: any/*, renderer: Renderer2*/) {
		const url = `/assets/elements/${appToLoad.file}`;

		return new Promise((resolve, reject) => {
			const script = document.createElement('script');
			// const script = this._document.createElement('script');
			// const script = renderer.createElement('script');
			script.type = 'text/javascript';

			script.setAttribute('src', url);
			script.onload = () => {
				console.log(`${appToLoad.id} Loaded`);
				resolve();
			};
			script.onerror = (err) => {
				console.error(`${appToLoad.id} Error`);
				reject(err);
			}

			document.body.appendChild(script);
			// this._document.body.appendChild(script);
			// renderer.appendChild(this._document.body, script);
		});
	}
	
}
