import ReduxObservableApi from './redux-observable-api';

// API endpoint configuration
const rest = new ReduxObservableApi({
  users: {
    url: '/users/{user}',
  },
}, {
  baseUrl: 'https://api.github.com',
});

// TODO: less noise
const actions = rest.actions;
const reducer = rest.reducer;
const middleware = rest.middleware;
export { actions, reducer, middleware };
