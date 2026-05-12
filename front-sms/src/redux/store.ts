import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import storage from "redux-persist/lib/storage/session"; // sessionStorage, más seguro que localStorage

//slice
import userReducer from "./features/userSlice";

//services
import { authApi } from "./services/authApi";
import { clasesApi } from "./services/clasesApi";
import { materiasApi } from "./services/asignatura.Api";
import { alumnosApi } from "./services/alumnosApi";
import { notasApi } from "./services/notasApi";
import { ciclosApi } from "./services/ciclosApi";
import { gradosApi } from "./services/gradosApi";
import { seccionesApi } from "./services/seccionesApi";
import { horariosApi } from "./services/horariosApi";
import { asistenciasApi } from "./services/asistenciasApi";
import { ponderacionesApi } from "./services/ponderacionesApi";

const persistConfig = {
  key: "user",
  storage,
  whitelist: ["userLogin", "usertoken"], // solo persiste estos campos
};

const persistedUserReducer = persistReducer(persistConfig, userReducer);

export const store = configureStore({
  reducer: {
    user: persistedUserReducer,
    [authApi.reducerPath]: authApi.reducer,
    [clasesApi.reducerPath]: clasesApi.reducer,
    [materiasApi.reducerPath]: materiasApi.reducer,
    [alumnosApi.reducerPath]: alumnosApi.reducer,
    [notasApi.reducerPath]: notasApi.reducer,
    [ciclosApi.reducerPath]: ciclosApi.reducer,
    [gradosApi.reducerPath]: gradosApi.reducer,
    [seccionesApi.reducerPath]: seccionesApi.reducer,
    [horariosApi.reducerPath]: horariosApi.reducer,
    [asistenciasApi.reducerPath]: asistenciasApi.reducer,
    [ponderacionesApi.reducerPath]: ponderacionesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat([
      authApi.middleware,
      clasesApi.middleware,
      materiasApi.middleware,
      alumnosApi.middleware,
      notasApi.middleware,
      ciclosApi.middleware,
      gradosApi.middleware,
      seccionesApi.middleware,
      horariosApi.middleware,
      asistenciasApi.middleware,
      ponderacionesApi.middleware,
    ]),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

setupListeners(store.dispatch);