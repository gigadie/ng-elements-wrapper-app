import 'zone.js/dist/zone-node';
import 'reflect-metadata';
import { renderModuleFactory } from '@angular/platform-server';
import * as express from 'express';
import * as path from 'path';
import { readFileSync } from 'fs';
import { enableProdMode, ValueProvider } from '@angular/core';
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';
import 'localstorage-polyfill';
import * as cookieParser from 'cookie-parser';
import { environment } from './environments/environment';

const appPath = path.join(__dirname, '.');
const domino = require('domino');
const indexHtmlPath = path.join(appPath, '/ui-browser/index.html');
const indexHtml = readFileSync(indexHtmlPath, 'utf-8').toString();
const win = domino.createWindow(indexHtml);

global['window'] = win;
global['document'] = win.document;
global['navigator'] = win.navigator;
global['localStorage'] = localStorage;

const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require(path.join(appPath, '/ui-server/main'));

enableProdMode();
const app = express();
const https = require('https');

app.use(cookieParser());

app.get('*.*', express.static(path.join(appPath, '/ui-browser'), {
  maxAge: '1y'
}));

app.get('*', (req, res) => {
  renderModuleFactory(AppServerModuleNgFactory, {
    document: indexHtml,
    url: req.url,
    // configure DI to make lazy-loading work differently
    // (we need to instantly render the view)
    extraProviders: [
      provideModuleMap(LAZY_MODULE_MAP),
      <ValueProvider>{
        provide: 'REQUEST',
        useValue: req
      },
      <ValueProvider>{
        provide: 'RESPONSE',
        useValue: req.res
      }
    ]
  })
    .then(html => {
      res.status(res.statusCode || 200).send(html);
    })
    .catch(err => {
      console.log('' + err);
      console.log(err.message);
      res.sendStatus(500);
    });
});

app.listen(9000, () => {
  console.log(`Angular Universal Node Express server listening on http://localhost:9000`);
});

