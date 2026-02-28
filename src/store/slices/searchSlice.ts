// /store/slices/searchSlice.ts
import { StateCreator, StoreApi } from "zustand";

export interface SearchState {
  searchQuery: string;
  searchResults: unknown;
  setSearchQuery: (query: string) => void;
  setSearchResults: (results: unknown) => void;
  clearSearch: () => void;
}

export const SearchSlice: StateCreator<
  SearchState,
  [],
  [],
  SearchState
> = (set, get, store: StoreApi<SearchState>) => ({
  searchQuery: "",
  searchResults: [],
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSearchResults: (results) => set({ searchResults: results }),
  clearSearch: () => {
    set({ searchQuery: "", searchResults: [] });
    store.subscribe(() => console.log("Search state changed"));
  },
});