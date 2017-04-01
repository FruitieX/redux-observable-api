import { combineReducers } from 'redux';

const INITIAL_STATE = {
  data: null,
  error: null,
  fetching: false,
  status: null,
  cancelled: false,
  //responseHeaders: {},
};

// Create reducer for given actionTypes
const createReducer = actionTypes => (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case actionTypes.PENDING:
      return {
        ...state,
        error: null,
        fetching: true,
        status: null,
        cancelled: false,
        //responseHeaders: {},
      };

    case actionTypes.FULFILLED:
      return {
        ...state,
        data: action.payload.data,
        error: null,
        fetching: false,
        status: action.payload.status,
        cancelled: false,
        //responseHeaders: action.payload.headers,
      };

    case actionTypes.REJECTED:
      return {
        ...state,
        data: null,
        error: action.payload.error,
        fetching: false,
        status: action.payload.status,
        cancelled: false,
        //responseHeaders: action.payload.headers,
      };

    case actionTypes.CANCELLED:
      // Don't do anything if we're not fetching
      if (!state.fetching) {
        return state;
      }

      return {
        ...state,
        fetching: false,
        cancelled: true,
      };

    default:
      return state;
  }
};

const createRouteReducers = (routes, actionTypes) => {
  const reducers = {};
  Object.keys(routes).forEach(route =>
    reducers[route] = createReducer(actionTypes[route]));

  return combineReducers(reducers);
};

export default createRouteReducers;
