import React, { Component, Fragment } from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as reducer from './store';

import axios from 'axios';

const FRAME_SIZE = 10;

class Image extends Component {
  constructor() {
    super();
    this.state = {
      sentence: '',
      level: 0,
      emotion: 'pos',
      direction: true,    // true: +1, false: -1
    }
  }

  componentWillMount() {
    // 모든 rgb 색상 목록 받아와서 state에 저장
    axios.get('/rgb')
      .then(res => this.setState({ rgbList: res.data }));
    axios.get('/init')
      .then(res => this.setState({ sentence: res.data.sentence}));
  }

  componentDidMount() {
    // let intervalId = setInterval(this.level, 5000);
    // this.setState({ intervalId: intervalId });
  }

  componentWillReceiveProps(nextProps) {
    const { typingStatus, word, sentimental } = nextProps;
    const { typingNone } = this.props;
    let { sentence } = this.state;

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

  // 감정 레벨 전후로 왔다갔다 주기적으로 반복
  level = () => {

    const { direction, level } = this.state;
    if (level === 0) return;
    if (direction) {
      return this.setState({
        level: (level >= FRAME_SIZE) ? FRAME_SIZE - 1 : level + 1,
        direction: (level >= FRAME_SIZE) ? true : false,
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
    console.log('감정레벨: ', level);

    // rgbList가 로딩되지 않으면 렌더링하지 않음
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
