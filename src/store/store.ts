import { configureStore, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Book } from "@/types/book";

type AuthMode = "login" | "register";

const uiSlice = createSlice({
  name: "ui",
  initialState: { authOpen: false, authMode: "login" as AuthMode },
  reducers: {
    openAuth: (state, action: PayloadAction<AuthMode | undefined>) => {
      state.authOpen = true;
      state.authMode = action.payload ?? "login";
    },
    closeAuth: (state) => { state.authOpen = false; },
    setAuthMode: (state, action: PayloadAction<AuthMode>) => { state.authMode = action.payload; },
  },
});

const authSlice = createSlice({
  name: "auth",
  initialState: { email: null as string | null, subscription: "basic" },
  reducers: {
    loginGuest: (state) => { state.email = "guest@gmail.com"; },
    loginWithEmail: (state, action: PayloadAction<string>) => { state.email = action.payload; },
    hydrateAuth: (state, action: PayloadAction<{email:string|null;subscription:string}>) => { state.email = action.payload.email; state.subscription = action.payload.subscription; },
    upgradeSubscription: (state) => { state.subscription = "premium"; },
    logout: (state) => { state.email = null; state.subscription = "basic"; },
  },
});

const librarySlice = createSlice({
  name: "library",
  initialState: { books: [] as Book[] },
  reducers: {
    hydrateLibrary: (state, action: PayloadAction<Book[]>) => { state.books = action.payload; },
    addToLibrary: (state, action: PayloadAction<Book>) => {
      if (!state.books.some((book) => book.id === action.payload.id)) state.books.push(action.payload);
    },
    removeFromLibrary: (state, action: PayloadAction<string>) => {
      state.books = state.books.filter((book) => book.id !== action.payload);
    },
  },
});

export const { openAuth, closeAuth, setAuthMode } = uiSlice.actions;
export const { loginGuest, loginWithEmail, hydrateAuth, upgradeSubscription, logout } = authSlice.actions;
export const { hydrateLibrary, addToLibrary, removeFromLibrary } = librarySlice.actions;
export const store = configureStore({ reducer: { ui: uiSlice.reducer, auth: authSlice.reducer, library: librarySlice.reducer } });
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
