import React from 'react';
import Enzyme, { mount } from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import Component from './Component';
import { addCount } from './actions';
import reducer from './reducer';

Enzyme.configure({ adapter: new EnzymeAdapter() });

// Testing functional components that use useDispatch and useSelector hooks 
// can be slightly different than regular connected component testing. 
// This test setup demonstrates a foolproof way of testing components that works for 
// both kinds of components (components that are using these hooks or connected components).

// our component depends on the redux store, we must also wrap it in a Provider HOC, 
// exported by react-redux. And since the purpose of this tutorial is testing our component fully, 
// including the redux side, we must create a 'mock store' for our redux <Provider /> with 
// an initial state that satisfies the structure of our reducer. Once that’s done, 
// we can render our component using 'mount'

describe('<Component /> unit test', () => {
  const getWrapper = (mockStore = createStore(reducer, { count: 0 })) =>
    mount(
      <Provider store={mockStore}>
        <Component />
      </Provider>
    );

  it('should add to count and display the correct # of counts', () => {
    const wrapper = getWrapper();
    expect(wrapper.find('h3').text()).toEqual('Count: 0');
    wrapper.find('button').simulate('click');
    expect(wrapper.find('h3').text()).toEqual('Count: 1');
  });

  it('should dispatch the correct action on button click', () => {
    const mockStore = createStore(reducer, { count: 0 });
    mockStore.dispatch = jest.fn();

    const wrapper = getWrapper(mockStore);
    wrapper.find('button').simulate('click');
    expect(mockStore.dispatch).toHaveBeenCalledWith(addCount());
  });
});
