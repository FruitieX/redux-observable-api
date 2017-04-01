import { Observable } from 'rxjs/Observable';

export const fakeAjax = options =>
  Observable.of({
    id: options.url.substring(
      options.url.lastIndexOf('/') + 1,
      options.url.indexOf('?') !== -1 ? options.url.indexOf('?') : undefined
    ),
    firstName: 'Bilbo',
    lastName: 'Baggins'
  }).delay(1000);
