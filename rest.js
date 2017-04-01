import ReduxObservableApi from './redux-observable-api';

//import { fakeAjax } from './redux-observable-api/ajax';
//const rxFetch = require('rxjs-fetch');

// Global config
const config = {
  baseUrl: '',
  //adapter: fakeAjax,
  //adapter: options => rxFetch(options).failOnHttpError(),
  defaultOptions: {
    /*
    headers: {
      Authorization: 'Bearer blahblah',
    }
    */
  }
};

const routes = {
  // Route configs
  users: {
    url: 'https://api.github.com/users/{user}',
  },
  users2: {
    url: 'http://localhost:3888/users/{user}',
  },
};

// API endpoint configuration
const rest = new ReduxObservableApi(routes, config);

// TODO: less noise
const actions = rest.actions;
const reducer = rest.reducer;
const middleware = rest.middleware;
export { actions, reducer, middleware };
