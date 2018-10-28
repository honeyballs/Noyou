import React, { Component } from 'react';
import { AppState } from 'react-native'
import { createStackNavigator } from 'react-navigation';
import io from 'socket.io-client';

import HomeScreen from './components/HomeScreen';
import ListScreen from './components/ListScreen';
import FilteredList from './components/FilteredList';

const RootStack = createStackNavigator(
  {
    Home: HomeScreen,
    Lists: ListScreen,
    FilteredList: FilteredList
  },
  {
    initialRouteName: 'Home'
  }
);

export default class App extends Component {

  state = {
    appState: AppState.currentState
  }

  socket = null;

  constructor(props) {
    super(props);
    this.socket = io('https://noyouserver-snmnutakjv.now.sh/');
  }

  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = (nextAppState) => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      this.socket = io('https://noyouserver-snmnutakjv.now.sh/');
    }
    this.setState({appState: nextAppState});
  }

  render() {
    return <RootStack screenProps={this.socket}/>
  }
}