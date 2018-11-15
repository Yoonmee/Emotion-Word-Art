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
        if(res.data.sentence) addSentence(res.data);
      });
  }

  render() {
    return (
      <div className="App">
        <h1>C O G A M</h1>
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