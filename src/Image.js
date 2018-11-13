import React, { Component, Fragment } from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as reducer from './store';

import axios from 'axios';

import { text } from './color';

class Image extends Component {
  constructor() {
    super();
    this.state = {
      sentence: (Array(30).join(text)).substr(0, 7000),
      level: 0,
      emotion: 'pos',
      direction: true,    // true: +1, false: -1
    }
  }

  componentWillMount() {
    axios.get('/rgb')
      .then(res => this.setState({ rgbList: res.data }));
  }

  componentDidMount() {
    let intervalId = setInterval(this.level, 1000);
    this.setState({ intervalId: intervalId });
  }

  componentWillReceiveProps(nextProps) {
    const { typingStatus, word, sentimental } = nextProps;
    const { typingNone } = this.props;
    let { sentence } = this.state;
    console.log('다음 감정: ', sentimental);

    // typing이 끝났을 때
    if (typingStatus === 'done') {
      // 최대 길이를 초과했을 때, 앞의 한 글자 삭제
      const maxLength = 7000;
      if (sentence.length >= maxLength) sentence = sentence.substr(1, maxLength) // 1 ~ arg2 까지만 출력. (arg2=7001)
      // state의 sentence에 새 단어 추가
      this.setState({
        sentence: sentence + word,
        ...sentimental
      })

      // store의 typing 상태 변경
      return typingNone();
    }
  }
  
  level = () => {
    const { direction, level } = this.state;
    if (direction) {
      return this.setState({
        level: (level >= 5) ? 4 : level + 1,
        direction: (level >= 5) ? true : false,
      })
    } else {
      return this.setState({
        level: (level <= 0) ? 1 : level - 1,
        direction: (level <= 0) ? false : true,
      })
    }
  }

  render() {
    const { rgbList, level } = this.state;

    if (!rgbList) return <div />;
    const emotion = this.state.emotion.concat('_img');
    const colorList = (rgbList[emotion][level]) ? rgbList[emotion][level].split(':') : rgbList[emotion][0]; // ':'로 rgb 나눔
    const textList = this.state.sentence.split('');
    return (
      <Fragment>
        <div style={{ textAlign: 'left', }}>
          {textList.map((item, i) => (
            <div className="word" style={{
              color: colorList[i],
            }} key={i}>{item}</div>
          ))}
        </div>
      </Fragment>
    );
  }
}

export default connect(
  state => ({
    typingStatus: state.typingStatus,
    word: state.word,
    sentimental: state.sentimental,
  }),
  dispatch => ({
    typingNone: bindActionCreators(reducer.typingNone, dispatch)
  })
)(Image);
