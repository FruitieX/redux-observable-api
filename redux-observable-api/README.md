# redux-observable-api

Gets rid of Redux action & action creator & reducer boilerplate for simple API requests.

### Features

* Minimal configuration and boilerplate
* Cancellable requests
* Uses [redux-observable](https://github.com/redux-observable/redux-observable) under the hood

### Setup

1. `yarn add redux-observable-api` or `npm install --save redux-observable-api`
2. Create a `rest.js` file in your project with the following contents:
  ```
  import ReduxObservableApi from 'redux-observable-api';

  // Global config
  const config = {
  };

  // Route configs
  const routes = {
  };

  const rest = new ReduxObservableApi(routes, config);

  // TODO: less noise
  const actions = rest.actions;
  const reducer = rest.reducer;
  const middleware = rest.middleware;
  export { actions, reducer, middleware };
  ```

3. Configure the exported Redux middleware and reducer:
  ```
  import { reducer as api, middleware as apiMiddleware} from './rest';

  // Reducer
  const rootReducer = combineReducers({ api });

  // Middleware
  const middleware = applyMiddleware(apiMiddleware);

  // Example store
  const store = createStore(rootReducer, middleware);
  ```

### Example

After setting it up, adding a new API endpoint boils down to:

* Configuring the API endpoint
  ```
  const routes = {
    users: { url: '/users/{user}' },
  };
  ```

* Now you can dispatch actions to make HTTP requests:
  ```
  import { actions as api } from './rest';

  dispatch(api.get.users({ user: 'futurice' }));
  ```
  Or using PUT:
  ```
  dispatch(api.put.users({ user: 'futurice' }, {
    body: { foo: 'bar' }
  }));
  ```

* The response is stored in Redux:
  ```
  {
    api: {
      users: {
        data: { /* response */ },
        error: null,
        fetching: false,
        status: 200,
        cancelled: false
      }
    }
  }
  ```

### Global config options

```
// rest.js

// Global config
const config = {
  /* Options documented below can be passed here */
};
```

* `baseUrl`: Prefix all requests with this URL, defaults to `''`
* `adapter`: Adapter used for requests, defaults to `require('rxjs/observable/dom/ajax')`
* `responseMapper`: Maps adapter output to action payload, default defined in `epics.js`.
* `errorMapper`: Maps adapter errors to action payload, default defined in `epics.js`.
* `defaultOptions`: Default options passed to adapter on every request. Defaults to `{}`.
  AjaxObservable accepts [these options](https://github.com/ReactiveX/rxjs/blob/0ab1d3b4d1178a1d31c49c737832cde767da3fb1/src/observable/dom/AjaxObservable.ts#L9-L24)

### Route configs

```
// rest.js

// Route config
const routes = {
  users: {
    /* Options documented below can be passed here */
  }
};
```

Route configs override the global `defaultOptions` as documented in the previous section. Normally
you only pass `url` here, but you may wish to customize e.g. headers globally per-route here.

See the AjaxObservable link above for more options.

### Request options

```
dispatch(api.put.users({ /* Params */ }, { /* Request config */ }));
```

#### Params

Params wrapped by curly braces are placeholders in the URL (e.g. `/users/{user}`). You can replace
these by passing the params you wish to replace as first parameter to the action creator.

For example to replace `{user}` with `futurice` in the above example:

```
dispatch(api.put.users({ user: 'futurice' }));
```

#### Request config

Request configs override both the global 'defaultOptions' and the route specific config. Here it
might make sense to pass e.g. the `body` option as such to set the HTTP POST body:

```
dispatch(api.post.users({ user: 'futurice' }, {
  body: { foo: 'bar' }
}));
```

See the AjaxObservable link above for more options.

### TODO

* Clean way of handling authentication
* Better error handling?

### Special thanks

* The project was inspired by https://github.com/lexich/redux-api by @lexic
* Sponsored by Futurice's [Spice Program](https://spiceprogram.org/)
