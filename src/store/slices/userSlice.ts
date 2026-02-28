import { User } from "../api/useAuth";
import { StateCreator, StoreApi } from "zustand";

export interface UserState {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  setUser: (user: User) => void;
}

const initialState: UserState = {
  isAuthenticated: false,
  token: null,
  user: null,
  login: () => {},
  logout: () => {},
  setUser: () => {},
};

export const UserStore: StateCreator<UserState, [], [], UserState> = (
  set,
  get
) => ({
  ...initialState,
  login: (token: string, user: User) =>
    set({ isAuthenticated: true, token, user }),
  logout: () => set({ isAuthenticated: false, token: null, user: null }),
  setUser: (user: User) => set({ user }),
});
