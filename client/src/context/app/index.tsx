import React from 'react';
import {
  AddServiceData,
  HouseholdSlim,
  Service,
  UserNotification,
  UserTransaction,
} from '../../utils/types';
type EditableUserData = {
  firstname: string;
  lastname: string;
  phone: number;
};
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
  notifications: UserNotification[];
  transactions: UserTransaction[];
  services: Service[];
}

export enum Actions {
  LOAD = 'LOAD',
  AUTHENTICATE = 'AUTHENTICATE',
  UPDATE_HOUSEHOLDS = 'UPDATE_HOUSEHOLDS',
  SIGN_OUT = 'SIGN_OUT',
  UPDATE_USER_PROFILE = 'UPDATE_USER_PROFILE',
  ADD_SERVICE = 'ADD_SERVICE',
}
type ActionsType =
  | {
      type: Actions.LOAD;
      payload: any;
    }
  | {
      type: Actions.AUTHENTICATE;
    }
  | { type: Actions.UPDATE_HOUSEHOLDS; payload: HouseholdSlim[] }
  | { type: Actions.SIGN_OUT }
  | {
      type: Actions.UPDATE_USER_PROFILE;
      payload: EditableUserData;
    }
  | {
      type: Actions.ADD_SERVICE;
      payload: AddServiceData;
    };

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
  transactions: [],
  services: [],
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
    case Actions.UPDATE_USER_PROFILE: {
      return { ...state, ...action.payload };
    }
    case Actions.SIGN_OUT: {
      return initialState;
    }
    case Actions.ADD_SERVICE: {
      return { ...state, ...action.payload };
    }
    default:
      return state;
  }
}

type ActionCreators = {
  authenticate: () => void;
  updateHouseholds: (d: HouseholdSlim[]) => void;
  load: (d: any) => void;
  signOut: () => void;
  updateUserProfile: (d: EditableUserData) => void;
  addService: (d: AddServiceData) => void;
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
      signOut: () => dispatch({ type: Actions.SIGN_OUT }),
      updateUserProfile: (payload: EditableUserData) =>
        dispatch({
          type: Actions.UPDATE_USER_PROFILE,
          payload,
        }),
      addService: (payload: AddServiceData) =>
        dispatch({ type: Actions.ADD_SERVICE, payload }),
    }),
    [state]
  );
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
