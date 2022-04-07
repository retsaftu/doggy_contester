// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  host: "localhost",
  port: 3000,

  getApiUrl: function() {
    return `http://${this.host}:${this.port}`
  },

  googleClientID: "355861108791-ch399vu1qttgpom13tbc1avk58onp888.apps.googleusercontent.com",
  tokenHeader: "Authorization",
  themeField: 'theme',
  USER_INFO_FIELDS: {
    USERNAME: "USER_INFO_USERNAME",
    ID: "USER_INFO_EMAIL_ID"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
