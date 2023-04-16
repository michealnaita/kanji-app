import React from 'react';
import { HouseholdSlim } from '../../utils/types';

interface IApp {
  firstname: string;
  lastname: string;
  email: string;
  phone: number;
  username: string;
  id: string;
  current_amount: number;
  households: HouseholdSlim[];
  isAuthenticated: boolean;
  notifications: string[];
}

export enum Actions {
  LOAD = 'LOAD',
  AUTHENTICATE = 'AUTHENTICATE',
  UPDATE_HOUSEHOLDS = 'UPDATE_HOUSEHOLDS',
}
type ActionsType =
  | {
      type: Actions.LOAD;
      payload: any;
    }
  | {
      type: Actions.AUTHENTICATE;
    }
  | { type: Actions.UPDATE_HOUSEHOLDS; payload: HouseholdSlim[] };

const initialState: IApp = {
  username: '',
  id: '',
  isAuthenticated: false,
  current_amount: 0,
  households: [],
  firstname: '',
  lastname: '',
  phone: 0,
  email: '',
  notifications: [],
};

function appReducer(state: IApp, action: ActionsType): IApp {
  switch (action.type) {
    case Actions.LOAD: {
      return { ...state, ...action.payload };
    }
    case Actions.AUTHENTICATE: {
      return { ...state, isAuthenticated: true };
    }
    case Actions.UPDATE_HOUSEHOLDS: {
      return { ...state, households: action.payload };
    }
    default:
      return state;
  }
}

type ActionCreators = {
  authenticate: () => void;
  updateHouseholds: (d: HouseholdSlim[]) => void;
  load: (d: any) => void;
};

const AppContext = React.createContext<(IApp & ActionCreators) | null>(null);

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
      updateHouseholds: (payload: HouseholdSlim[]) =>
        dispatch({ type: Actions.UPDATE_HOUSEHOLDS, payload }),
    }),
    [state]
  );
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
