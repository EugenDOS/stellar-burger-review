import store, { rootReducer } from '../services/store';

describe('Redux Store', () => {
  it('should correctly initialize rootReducer', () => {
    // Check that rootReducer with undefined state produces the same state as the store
    const initialState = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(initialState).toEqual(store.getState());
  });
});
