import React, { Component } from 'react';
import './App.css';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as reducer from './store';

import axios from 'axios';

import Image from './Image';
import Typing from './Typing';

class App extends Component {
  constructor() {
    super();
    this.state = {
      currentCount: 10,
      username: '',
    }
  }

  componentDidMount() {
    let intervalId = setInterval(this.getSentenceFromDB, 5000);
    this.setState({ intervalId: intervalId });
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId);
  }

  getSentenceFromDB = () => {
    const { addSentence } = this.props;
    axios.get('/twitter')
      .then(res => {
        addSentence(res.data)
      });
  }

  render() {
    const { username } = this.state;
    return (
      <div className="App">
        <h1>C O G A M {username}</h1>
        <div className="text-area">
          <Image />
        </div>
        <Typing />
      </div>

    );
  }
}

export default connect(
  state => ({

  }),
  dispatch => ({
    addSentence: bindActionCreators(reducer.addSentence, dispatch)
  })
)(App);