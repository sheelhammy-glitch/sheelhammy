// /store/useAppStore.ts
import { create, StoreApi } from "zustand";
import { SearchSlice, SearchState } from "./slices/searchSlice";
import { UserStore, UserState } from "./slices/userSlice";


export interface AppState extends SearchState, UserState {}

const useAppStore = create<AppState>((set, get, store: StoreApi<AppState>) => ({
  ...SearchSlice(set, get, store),
  ...UserStore(set, get, store),
}));

export default useAppStore;
