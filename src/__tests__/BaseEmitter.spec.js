/* eslint-disable no-unused-vars, no-undef */
import BaseEmitter from '../BaseEmitter';
import { ID } from '../helpers/guard';

const initialState = {
  a: {
    value: 0
  },
  b: [1, 2, 3, 4],
  c: function () {},
  d: function * () {}
};
const counter = (state = initialState, action) => {
  switch (action.type) {
    case 'INCREMENT':
      state.a.value += action.with;
      return state;
    case 'DECREMENT':
      state.a.value -= action.with;
      return state;
    default:
      return state;
  }
};

describe('Given the BaseEmitter', function () {
  before(() => {
    window[ID] = true;
  });
  after(() => {
    window[ID] = false;
  });
  beforeEach(() => {
    sinon.stub(window.top, 'postMessage');
  });
  afterEach(() => {
    window.top.postMessage.restore();
  });
  describe('and when we dispatch an event', function () {
    it('should dispatch an event to Kuker extension', function () {
      const emit = BaseEmitter();

      emit({
        type: 'foo',
        state: {
          a: ['b', 'c'],
          someFunc: function AAA() {},
          someGene: function * BBB() { yield 'aaa'; }
        },
        time: (new Date()).getTime(),
        title: 'aaaa'
      });

      expect(window.top.postMessage).to.be.calledWith({
        state: { a: ['b', 'c'], someFunc: { __func: 'AAA' }, someGene: { __func: 'BBB' } },
        time: sinon.match.number,
        title: 'aaaa',
        type: 'foo'
      }, '*');
    });
  });
});