/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { AppRegistry } from 'react-native';

import 'rxjs';

import { reducer as api, middleware as apiMiddleware } from './rest';
import App from './App';

// redux/configureStore.js

import { Provider } from 'react-redux';
import { combineReducers, createStore, applyMiddleware, compose } from 'redux';

const rootReducer = combineReducers({
  api,
});

const composeEnhancers = (__DEV__ && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;
const enhancer = composeEnhancers(
  applyMiddleware(apiMiddleware)
);

const store = createStore(rootReducer, enhancer);

export default class ReduxObservableApi extends Component {
  render() {
    return (
      <Provider store={store}>
        <App />
      </Provider>
    );
  }
}

AppRegistry.registerComponent('ReduxObservableApi', () => ReduxObservableApi);
