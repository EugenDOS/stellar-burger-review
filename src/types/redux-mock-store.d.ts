declare module 'redux-mock-store' {
  import { Store, AnyAction } from 'redux';
  
  export interface MockStoreCreator<S = any, A extends AnyAction = AnyAction> {
    (state?: S): MockStore<S, A>;
  }

  export interface MockStore<S = any, A extends AnyAction = AnyAction> extends Store<S, A> {
    getActions(): A[];
    clearActions(): void;
  }

  export default function configureStore<S = any, A extends AnyAction = AnyAction>(
    middlewares?: any[]
  ): MockStoreCreator<S, A>;
} 