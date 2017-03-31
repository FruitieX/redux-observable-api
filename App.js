import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  Button,
  View
} from 'react-native';

import { actions as api } from './rest';

import { connect } from 'react-redux';

let App = ({ isFetchingUser, fetchUser, cancelFetch, users }) => (
  <View>
    <Text>{isFetchingUser ? '(Loading...)': ''}</Text>
    <Button title="Fetch" onPress={() => fetchUser('redux-observable')} />
    <Button title="Cancel" onPress={cancelFetch} />
    <Text>{'Data:'}</Text>
    <Text>{JSON.stringify(users)}</Text>
  </View>
);

App = connect(
  state => ({
    users: state.api.users,
  }),
  dispatch => ({
    fetchUser: user => dispatch(api.get.users({ user, foo: 'bar' })),
    cancelFetch: () => dispatch(api.cancel.users()),
  })
)(App);

export default App;
