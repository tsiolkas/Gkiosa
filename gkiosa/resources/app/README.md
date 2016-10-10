## Gkiosa

*A simple business bookkeeping application*

Gkiosa is intended to run using `Electron` as desktop application.
For the purpose of development we port it as a static frontend angular application using gulp for build and development

Currentrly, the text content is in *Greek*, there is no support for other languages.

## Building

* Clone this repo
* You need ___node.js___, ___bower___, and ___gulp___ installed to proceed
* Run `npm install`
* Run `bower install`
* Run `gulp serve-dev` to build and run the development version of Gkiosa
* Run `npm start` to run the desktop application

### Distribution

```
npm install -g electron-packager
electron-packager . --platform win32 --arch ia32
```

## Details

### Database

We adopt `nedb` as the database of the application because it is lightweight and it can directly run the database server from the application's context.
