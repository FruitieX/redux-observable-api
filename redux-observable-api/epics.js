import { combineEpics, createEpicMiddleware } from 'redux-observable';
import { Observable } from 'rxjs/Observable';
import { ajax } from 'rxjs/observable/dom/ajax';

const defaultAdapter = options =>
  ajax(options);

// Maps responses of the rxFetch adapter into an action payload as expected by reducer
const defaultResponseMapper = response => ({
  data: response.response,
  status: response.status,
  //headers: response.xhr.responseHeaders,
});

// Maps errors of the rxFetch adapter into an action payload as expected by reducer
const defaultErrorMapper = error => ({
  error: error.xhr.response,
  status: error.status,
  //headers: error.xhr.responseHeaders,
});

const createEpic = (route, internalActions, actionTypes, config) => {
  const adapter = config.adapter || defaultAdapter;
  const responseMapper = config.responseMapper || defaultResponseMapper;
  const errorMapper = config.errorMapper || defaultErrorMapper;

  return action$ =>
    action$.ofType(actionTypes.PENDING)
      .mergeMap(action =>
        adapter(action.payload.options)
          .takeUntil(action$.ofType(actionTypes.CANCELLED))
          .map(response => internalActions.fulfilled(responseMapper(response)))
          .catch(error => Observable.of(internalActions.rejected(errorMapper(error))))
      );
};

// Create epics for each route
const createRouteEpics = (routes, actions, actionTypes, config) => {
  const epics = [];

  Object.keys(routes).forEach(route =>
    epics.push(createEpic(route, actions._internals[route], actionTypes[route], config)));

  const rootEpic = combineEpics(...epics);

  return {
    epics: epics,
    epicMiddleware: createEpicMiddleware(rootEpic)
  }
};

export default createRouteEpics;
