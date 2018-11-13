import React, { Component, Fragment } from "react";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as reducer from "./store";

import Typist from "react-typist";

class Typing extends Component {
  constructor() {
    super();
    this.state = {
      word: "",
      sentence: ""
    };
  }

  componentWillMount() {
    // 최초 실행 시 buffer에서 가져올 문장 설정하기
    const { setNextSentence, buffer } = this.props;
    if (buffer.length !== 0) return setNextSentence();
  }

  componentWillReceiveProps(nextProps) {
    const { typingStatus, newSentence, buffer } = nextProps;

    // 가져올 새 문장이 있을 때
    if (newSentence) {
      const { fetchSentence } = this.props;
      fetchSentence();
      return this.getWord(nextProps.sentence);
      // return this.setNewSentence(sentence);
    }

    // typingStatus가 none일 때, 다음 글자 받아오기
    const { sentence } = this.state;
    if (typingStatus === "none") {
      // 출력할 문장이 남아있는 경우 다음 단어를 가져옴
      if (sentence) return this.getWord();

      const { setNextSentence } = this.props;
      // 버퍼가 비지 않았을 때, 다음 문장을 가져옴
      if (buffer.length !== 0) return setNextSentence();
    }
  }

  // 다음 단어를 가져오는 함수
  getWord = newSentence => {
    // 출력할 문장 설정
    // (새 문장일 경우: newSentence, 기존 문장일 경우: state의 sentence)
    let sentence = newSentence;
    if (!sentence) sentence = this.state.sentence;

    const { typingIng } = this.props;
    this.setState({
      word: sentence[0],
      sentence: sentence.slice(1)
    });

    return typingIng(sentence[0]);
  };

  render() {
    const { word } = this.state;
    const { typingStatus, typingDone } = this.props;
    const cursor = { show: false };

    if (typingStatus !== "typing") return <div />;
    return (
      <Fragment>
        <Typist onTypingDone={typingDone} cursor={cursor}>
          <div className="word" style={{ color: "black" }}>
            {word}
          </div>
        </Typist>
      </Fragment>
    );
  }
}

export default connect(
  state => ({
    typingStatus: state.typingStatus,
    word: state.word,
    sentence: state.sentence,
    newSentence: state.newSentence,
    buffer: state.buffer
  }),
  dispatch => ({
    typingDone: bindActionCreators(reducer.typingDone, dispatch),
    typingIng: bindActionCreators(reducer.typingIng, dispatch),
    setNextSentence: bindActionCreators(reducer.setNextSentence, dispatch),
    fetchSentence: bindActionCreators(reducer.fetchSentence, dispatch)
  })
)(Typing);
