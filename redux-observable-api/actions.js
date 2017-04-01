import qs from 'qs';

// "Namespace" all actions by prefixing them with 'API/'
export const ACTION_PREFIX = 'API';

// Available HTTP methods in user-facing actions
const methods = ['get', 'post', 'delete', 'put', 'patch', 'cancel'];

// Create action types for given route, namespaced with ACTION_PREFIX
// TODO: convert camelCase to SCREAMING_CASE (currently uses .toUpperCase())
const createActionTypes = route => ({
  PENDING: `${ACTION_PREFIX}/FETCH_${route}_PENDING`,
  FULFILLED: `${ACTION_PREFIX}/FETCH_${route}_FULFILLED`,
  REJECTED: `${ACTION_PREFIX}/FETCH_${route}_REJECTED`,
  CANCELLED: `${ACTION_PREFIX}/FETCH_${route}_CANCELLED`,
});

// Action creator for given method, using given actionTypes
const createAction = ({
  routeConfig,
  routeActionTypes,
  method,
  config = {},
}) => (params = {}, requestOptions) => {
  // Concatenate route URL with base URL if set
  let url = config.baseUrl ? `${config.baseUrl}${routeConfig.url}` : routeConfig.url;

  // Replace placeholders
  // TODO: what if we want a param both in URL and querystring?
  const queryParams = {};
  Object.keys(params).forEach(param => {
    if (url.indexOf(`{${param}}`) !== -1) {
      // Param found in URL, replace it with value
      url = url.replace(`{${param}}`, params[param]);
    } else {
      // Param not found in URL, append to querystring
      queryParams[param] = params[param];
    }
  });

  // Stringify query string, prepend with '?' only if query string params were found
  let queryString = qs.stringify(queryParams);
  queryString = queryString ? `?${queryString}`: '';

  return {
    type: method === 'cancel' ? routeActionTypes.CANCELLED : routeActionTypes.PENDING,
    payload: {
      params,
      options: {
        ...config.defaultOptions,
        ...routeConfig,
        ...requestOptions,
        method,
        url: `${url}${queryString}`,
      },
    }
  };
};

// Create all actions/actionTypes for given routes
const createRouteActions = (routes, config) => {
  const actionTypes = {};
  const actions = {
    _internals: {}
  };

  // Action types
  Object.keys(routes).forEach(route =>
    actionTypes[route] = createActionTypes(route.toUpperCase()));

  // Actions
  methods.forEach(method => actions[method] = {});

  Object.keys(routes).forEach(route => {
    // Internally used actions for fullfilled/rejected requests
    actions._internals[route] = {
      fulfilled: data => ({
        type: actionTypes[route].FULFILLED,
        payload: data,
      }),
      rejected: error => ({
        type: actionTypes[route].REJECTED,
        payload: error,
      }),
    };

    // User-facing actions. One per [route, HTTP method] pair
    methods.forEach(method =>
      actions[method][route] = createAction({
        routeConfig: routes[route],
        routeActionTypes: actionTypes[route],
        method,
        config,
      }));
  });

  return { actions, actionTypes };
};

export default createRouteActions;
