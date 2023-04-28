import React from 'react';
import useGetAdminDataMutation from '../../api/admin/getAdmin';
import { Admin } from '../../utils/types';
import { useApp } from '../app';

enum Actions {
  UPDATE_STATE = 'UPDATE_STATE',
  LOAD = 'LOAD',
  ERROR = 'ERROR',
}
type UpdateData = {
  active_services?: Admin['active_services'];
  pending_requests?: Admin['pending_requests'];
  houses?: Admin['houses'];
};
type ActionTypes =
  | {
      type: Actions.LOAD;
      payload: Admin;
    }
  | {
      type: Actions.UPDATE_STATE;
      payload: UpdateData;
    }
  | {
      type: Actions.ERROR;
      payload: { message: string };
    };
type AdminActions = {
  updateAdmin: (d: UpdateData) => void;
  loadAdmin: (d: Admin) => void;
  error: (d: { message: string }) => void;
};
interface IAdmin extends Admin {
  isLoading: boolean;
  isError?: {
    state: boolean;
    message: string;
  };
}
const INITIAL_STATE: IAdmin = {
  users_count: 0,
  active_services: [],
  pending_requests: [],
  houses: [],
  isLoading: true,
};

function adminReducer(state: IAdmin, action: ActionTypes): IAdmin {
  if (action.type == Actions.LOAD) {
    return { ...state, ...action.payload };
  }
  if (action.type == Actions.UPDATE_STATE) {
    return { ...state, ...action.payload };
  }
  if (action.type == Actions.ERROR) {
    return {
      ...state,
      isError: { state: true, message: action.payload.message },
    };
  }
  return state;
}

const AdminContext = React.createContext<(IAdmin & AdminActions) | null>(null);
export default function useAdmin() {
  const state = React.useContext(AdminContext);
  if (!state) throw new Error('Wrap component in Admin Provider');
  return state;
}
export function AdminProvider({ children }: any) {
  const { roles } = useApp();
  const { mutate, data, error, isError } = useGetAdminDataMutation();
  const [state, dispatch] = React.useReducer(adminReducer, INITIAL_STATE);
  const value = React.useMemo<IAdmin & AdminActions>(
    () => ({
      ...state,
      updateAdmin: (payload) =>
        dispatch({ type: Actions.UPDATE_STATE, payload }),
      loadAdmin: (payload) => dispatch({ type: Actions.LOAD, payload }),
      error: (payload) => dispatch({ type: Actions.ERROR, payload }),
    }),
    [state]
  );
  React.useEffect(() => {
    if (data) {
      value.loadAdmin(data);
    }
  }, [data]);
  React.useEffect(() => {
    if (error) {
      console.error(error.message);
      value.error({ message: error.message });
    }
  }, [isError]);
  React.useEffect(() => {
    if (!!roles.length && roles.includes('admin')) {
      mutate();
    }
  }, [roles]);
  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
}
