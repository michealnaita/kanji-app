import React from 'react';
import { HouseholdSlim } from '../../utils/types';

interface IApp {
  username: string;
  id: string;
  current_amount: number;
  households: HouseholdSlim[];
  isAuthenticated: boolean;
}
export enum Actions {
  LOAD = 'LOAD',
  AUTHENTICATE = 'AUTHENTICATE',
}
type ActionsType =
  | {
      type: Actions.LOAD;
      payload: any;
    }
  | {
      type: Actions.AUTHENTICATE;
    };

const initialState: IApp = {
  username: 'janedoe',
  id: '09uijwrksfli9w49worepf',
  isAuthenticated: false,
  current_amount: 12000,
  households: [
    { id: '12345678', name: 'The lules', service: 'netflix' },
    { id: '12345678', name: 'The kamyas', service: 'spotify' },
  ],
};

function appReducer(state: IApp, action: ActionsType): IApp {
  switch (action.type) {
    case Actions.LOAD: {
      return { ...state, ...action.payload };
    }
    case Actions.AUTHENTICATE: {
      return { ...state, isAuthenticated: true };
    }
    default:
      return state;
  }
}
const AppContext = React.createContext<any>(null);

// App Hook
export function useApp() {
  const context = React.useContext(AppContext);
  if (!context) throw new Error('must wrap component in App context provider');
  return context;
}

// App Provider
export function AppProvider({ children }: { children: JSX.Element }) {
  const [state, dispatch] = React.useReducer(appReducer, initialState);
  const value = React.useMemo(
    () => ({
      ...state,
      load: (payload: any) => dispatch({ type: Actions.LOAD, payload }),
      authenticate: () => dispatch({ type: Actions.AUTHENTICATE }),
    }),
    [state]
  );
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
