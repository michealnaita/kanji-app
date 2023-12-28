import React from 'react';
import { AddServiceData, HouseholdSlim, User } from '../../utils/types';
import { useAuth } from '../auth';
import useGetUserDataQuery from '../../api/user/current';
import { routes, settings } from '../../settings';

type EditableUserData = {
  firstname: string;
  lastname: string;
  phone: number;
};
interface IApp extends User {
  username: string;
  isLoading: boolean;
  isError?: {
    state: boolean;
    message: string;
  };
}

export enum Actions {
  LOAD = 'LOAD',
  AUTHENTICATE = 'AUTHENTICATE',
  UPDATE_HOUSEHOLDS = 'UPDATE_HOUSEHOLDS',
  SIGN_OUT = 'SIGN_OUT',
  UPDATE_USER_PROFILE = 'UPDATE_USER_PROFILE',
  ADD_SERVICE = 'ADD_SERVICE',
  ERROR = 'ERROR',
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
    }
  | {
      type: Actions.ERROR;
      payload: { message: string };
    };

const initialState: IApp = {
  username: '',
  id: '',
  current_amount: 0,
  households: [],
  firstname: '',
  lastname: '',
  phone: 0,
  email: '',
  notifications: [],
  transactions: [],
  services: [],
  isLoading: true,
  roles: [],
  balance: 0,
};

function appReducer(state: IApp, action: ActionsType): IApp {
  switch (action.type) {
    case Actions.LOAD: {
      return {
        ...state,
        ...action.payload,
        isLoading: false,
      };
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
    case Actions.ERROR: {
      return {
        ...state,
        isError: { state: true, message: action.payload.message },
      };
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
  error: (d: { message: string }) => void;
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
  const { data, error, mutate } = useGetUserDataQuery();
  const { user_uid, isAuthenticated } = useAuth();
  const [state, dispatch] = React.useReducer(appReducer, initialState);
  const value = React.useMemo<IApp & ActionCreators>(
    () => ({
      ...state,
      load: (payload) => dispatch({ type: Actions.LOAD, payload }),
      authenticate: () => dispatch({ type: Actions.AUTHENTICATE }),
      updateHouseholds: (payload) =>
        dispatch({ type: Actions.UPDATE_HOUSEHOLDS, payload }),
      signOut: () => dispatch({ type: Actions.SIGN_OUT }),
      updateUserProfile: (payload) =>
        dispatch({
          type: Actions.UPDATE_USER_PROFILE,
          payload,
        }),
      addService: (payload) => dispatch({ type: Actions.ADD_SERVICE, payload }),
      error: (payload) => dispatch({ type: Actions.ERROR, payload }),
    }),
    [state]
  );
  React.useEffect(() => {
    if (data) {
      value.load({ id: user_uid, ...data });
    }
  }, [data]);
  React.useEffect(() => {
    if (error) {
      console.error(error.message);
      value.error({ message: error.message });
    }
  }, [error]);
  React.useEffect(() => {
    if (user_uid && isAuthenticated) {
      mutate(user_uid);
    }
  }, [user_uid, isAuthenticated]);
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
