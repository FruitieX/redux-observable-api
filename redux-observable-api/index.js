import createRouteActions from './actions';
import createRouteReducers from './reducer';
import createRouteEpics from './epics';

export default class ReduxObservableApi {
  constructor(routes, config = {}) {
    // Actions
    const {
      actions,
      actionTypes,
    } = createRouteActions(routes, config);

    this.actions = actions;
    this.actionTypes = actionTypes;

    // Reducers
    this.reducer = createRouteReducers(routes, this.actionTypes);

    // Epics
    const {
      epics,
      epicMiddleware,
    } = createRouteEpics(routes, this.actions, this.actionTypes, config);

    this.epics = epics;
    this.middleware = epicMiddleware;
  }
}
