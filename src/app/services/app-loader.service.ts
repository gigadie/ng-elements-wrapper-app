import { Injectable } from '@angular/core';

import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppLoaderService {

	private apps = {
		app1: {
			id: 'app1',
			tag: 'ng-elements-app',
			title: 'App 1',
			loaded: null,
			injected: false,
			active: false
		},
		app2: {
			id: 'app2',
			tag: 'ng-elements-app-routing',
			title: 'App 2',
			loaded: null,
			injected: false,
			active: false
		}
	};

	constructor() { }

	getAppList() {
		return of(this.apps);
	}

	getApp(appId: string) {
		return of(this.apps[appId]);
	}

	loadApp(app: string) {
		if (!this.apps[app].loaded) {
			this.apps[app].loaded = this.loadScript(app);
		}

		this.apps[app].loading = true;
		this.apps[app]
			.loaded
			.then(_ => {
				console.log(`${app} Activated`);
				this.activateApp(app);
				this.apps[app].injected = false;
				this.apps[app].injecting = true;
				// setTimeout(_ => this.injectApp(app), 0);
			})
			.finally(_ => this.apps[app].loading = false);
	}

	private activateApp(app: string) {
		Object.keys(this.apps).forEach(appKey => this.apps[appKey].active = false);
		this.apps[app].active = true;
	}

	private loadScript(app: string) {
		// const url = `https://qa3.chambers.com/elements/${this.apps[app].id}.js`;
		const url = `/assets/elements/${this.apps[app].id}.js`;

		return new Promise(resolve => {
			const script = document.createElement('script');
			script.setAttribute('src', url);
			script.onload = () => {
				console.log(`${app} Loaded`);
				resolve();
			};
			document.body.appendChild(script);
		});
	}
	
}
