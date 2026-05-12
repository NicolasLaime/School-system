import {
  createApi,
  fetchBaseQuery,
  FetchBaseQueryError,
  BaseQueryFn,
  FetchArgs,
} from "@reduxjs/toolkit/query/react";
import { logoutUser } from "../features/userSlice";
import { User, UserRole } from "../../../types/Usuario.type";

interface RootState {
  user: {
    userLogin: User | null;
    usertoken: string | null;
  };
}

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
}

interface getUsersResponse {
  success: boolean;
  message: string;
  data: User[];
}

interface UserResponse {
  message: string;
  data: User;
  error?: string;
}

interface CreateUserRequest {
  data: Partial<User>;
  userLoginId: number;
}

interface CreateUserResponse {
  data: {
    success: boolean;
    message: string;
    data: User;
  };
}

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL, // http://localhost:8080
  credentials: "omit",
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const token = state.user?.usertoken;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  const error = result.error as FetchBaseQueryError | undefined;
  const status = error?.status;

  if (result.error && [401, 403].includes(status as number)) {
    console.warn("Token expirado. Cerrando sesión.");
    api.dispatch(logoutUser());
  }

  return result;
};

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Usuarios"],
  endpoints: (builder) => ({

   login: builder.mutation<LoginResponse, LoginRequest>({
  query: (credentials) => ({
    url: "/auth/login",        // ✅ http://localhost:8080/auth/login
    method: "POST",
    body: credentials,
  }),
}),

logout: builder.mutation<void, void>({
  query: () => ({
    url: "/auth/logout",       // ✅ http://localhost:8080/auth/logout
    method: "POST",
  }),
}),

getUsers: builder.query<getUsersResponse, void>({
  query: () => ({ url: "/api/usuarios", method: "GET" }),
  providesTags: [{ type: "Usuarios", id: "LIST" }],
}),

getUserById: builder.query<UserResponse, string>({
  query: (id) => ({ url: `/api/usuarios/${id}`, method: "GET" }),
  providesTags: (result, error, id) => [{ type: "Usuarios", id }],
}),

updateUser: builder.mutation<UserResponse, { id: string; data: Partial<User> }>({
  query: ({ id, data }) => ({
    url: `/api/usuarios/${id}`,
    method: "PUT",
    body: data,
  }),
  invalidatesTags: (result, error, { id }) => [
    { type: "Usuarios", id },
    { type: "Usuarios", id: "LIST" },
  ],
}),

createUser: builder.mutation<CreateUserResponse, CreateUserRequest>({
  query: ({ data, userLoginId }) => ({
    headers: { "X-Creador-Id": String(userLoginId) },
    url: "/api/usuarios",
    method: "POST",
    body: data,
  }),
  invalidatesTags: [{ type: "Usuarios", id: "LIST" }],
}),

getUsuariosByRol: builder.query<getUsersResponse, UserRole>({
  query: (rol) => `/api/usuarios/rol/${rol}`,
  providesTags: [{ type: "Usuarios", id: "LIST" }],
}),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useCreateUserMutation,
  useGetUsersQuery,
  useGetUsuariosByRolQuery,
} = authApi;