import { combineReducers } from 'redux';

const getInitialState = route => ({
  data: null,
  fetching: false,
  error: null,
  cancelled: false,
});

const createReducer = (route, actionTypes) => (state = getInitialState(route), action) => {
  switch (action.type) {
    case actionTypes.PENDING:
      return {
        ...state,
        fetching: true,
        error: null,
        cancelled: false,
      };

    case actionTypes.FULFILLED:
      return {
        ...state,
        data: action.payload,
        fetching: false,
        error: null,
        cancelled: false,
      };

    case actionTypes.REJECTED:
      return {
        ...state,
        data: null,
        fetching: false,
        error: action.payload,
        cancelled: false,
      };

    case actionTypes.CANCELLED:
      // Don't do anything if we're not fetching
      if (!state.fetching) {
        return state;
      }

      return {
        ...state,
        fetching: false,
        error: null,
        cancelled: true,
      };

    default:
      return state;
  }
};

const createRouteReducers = (routes, actionTypes) => {
  const reducers = {};
  Object.keys(routes).forEach(route => reducers[route] = createReducer(route, actionTypes[route]));

  return combineReducers(reducers);
};

export default createRouteReducers;
