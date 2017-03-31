import { combineEpics, createEpicMiddleware } from 'redux-observable';

import { fakeAjax } from './ajax';

const createEpic = (route, internalActions, actionTypes) => action$ =>
  action$.ofType(actionTypes.PENDING)
    .mergeMap(action =>
      fakeAjax(action.payload.options)
        .takeUntil(action$.ofType(actionTypes.CANCELLED))
        .map(response => internalActions.fulfilled(response))
        .catch(error => internalActions.rejected(error.xhr.response))
    );

const createRouteEpics = (routes, actions, actionTypes) => {
  const epics = [];

  Object.keys(routes).forEach(route => epics.push(createEpic(route, actions._internals[route], actionTypes[route])));

  const rootEpic = combineEpics(...epics);

  return {
    epics: epics,
    epicMiddleware: createEpicMiddleware(rootEpic)
  }
};

export default createRouteEpics;
