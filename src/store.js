import { handleActions, createAction } from 'redux-actions';

const initialState = {
  typingStatus: 'none',   // typing, done, none
  newSentence: false,
  word: '',
  sentence: '',
  buffer: [],
  sentimental: {
    emotion: 'pos',     // pos, neg
    level: 0,     // 0 - 5
  }
}

const TYPING_DONE = 'TYPING_DONE';
const TYPING_ING = 'TYPING_ING';
const TYPING_NONE = 'TYPING_NONE';

const SET_NEXT_SENTENCE = 'SET_NEXT_SENTENCE';
const FETCH_SENTENCE = 'FETCH_SENTENCE';
const ADD_SENTENCE = 'ADD_SENTENCE';

export const typingDone = createAction(TYPING_DONE);
export const typingIng = createAction(TYPING_ING);    // payload: word
export const typingNone = createAction(TYPING_NONE);

export const addSentence = createAction(ADD_SENTENCE);   // payload: sentence
export const fetchSentence = createAction(FETCH_SENTENCE); 
export const setNextSentence = createAction(SET_NEXT_SENTENCE);   // payload: sentence

export default handleActions({
  [TYPING_DONE]: (state) => ({
    ...state,
    typingStatus: 'done',
  }),
  [TYPING_ING]: (state, action) => ({
    ...state,
    typingStatus: 'typing',
    word: action.payload,
  }),
  [TYPING_NONE]: (state) => ({
    ...state,
    typingStatus: 'none',
    word: '',
  }),
  [SET_NEXT_SENTENCE]: (state) => ({
    ...state,
    sentence: state.buffer[0],
    buffer: state.buffer.slice(1),
    newSentence: true,
  }),
  [FETCH_SENTENCE]: (state) => ({
    ...state,
    newSentence: false,
  }),
  [ADD_SENTENCE]: (state, action) => ({
    ...state,
    buffer: state.buffer.concat(action.payload.sentence),
    sentimental: action.payload.sentimental,
  })
}, initialState)