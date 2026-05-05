import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

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


export const store = configureStore({
  reducer: {
    user: userReducer,
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
    getDefaultMiddleware().concat([authApi.middleware, clasesApi.middleware, materiasApi.middleware, alumnosApi.middleware, notasApi.middleware, ciclosApi.middleware, gradosApi.middleware, seccionesApi.middleware, horariosApi.middleware, asistenciasApi.middleware, ponderacionesApi.middleware]),
});

setupListeners(store.dispatch);
