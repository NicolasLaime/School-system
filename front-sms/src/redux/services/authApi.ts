import {
  createApi,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { logoutUser, setUserToken } from "../features/userSlice";
import { User, UserRole } from "../../../types/Usuario.type";

interface RootState {
  user: {
    userLogin: User | null;
    usertoken: string | null;
  };
}


const backendUrl = process.env.NEXT_PUBLIC_API_ROUTElOCAL;

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  data: User;
  accessToken?: string;
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
  baseUrl: backendUrl,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const token = state.user?.usertoken;
    if (token) {

      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const baseQueryWithReauth: typeof baseQuery = async (
  args,
  api,
  extraOptions,
) => {
  let result = await baseQuery(args, api, extraOptions);

  const error = result.error as FetchBaseQueryError | undefined;
  const status = error?.status;


  console.log("Resultado de la query original:", result);

  if (result.error && [401, 403].includes(status as number)) {
    console.log("Intentando refrescar el token...");

    const refreshResult = await baseQuery(
      {
        url: "/auth/refresh",
        method: "POST",
      },
      api,
      extraOptions,
    );

    console.log("Resultado del refresh:", refreshResult);

    if (refreshResult.data) {
      const { accessToken } = refreshResult.data as { accessToken: string };

      console.log("Nuevo accessToken:", accessToken);

      api.dispatch(setUserToken(accessToken));

      result = await baseQuery(args, api, extraOptions);
      console.log("Resultado después de refrescar:", result);
    } else {
      console.warn("No se pudo refrescar el token. Cerrando sesión.");
      api.dispatch(logoutUser());
    }
  }

  return result;
};

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Usuarios"],
  endpoints: (builder) => ({

    //login (auth/login moved to GET /usuarios per Swagger)
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),

    //logout
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),

    //refreshToken
    refreshToken: builder.mutation<{ accessToken: string }, void>({
      query: () => ({
        url: "/auth/refresh",
        method: "POST",
      }),
    }),

    //traer todos los usuarios
    getUsers: builder.query<getUsersResponse, void>({
      query: () => ({
        url: "/usuarios",
        method: "GET",
      }),
      providesTags: [{ type: "Usuarios", id: "LIST" }],
    }),

    //traer un usuario por su id
    getUserById: builder.query<UserResponse, string>({
      query: (id) => {
        console.log("ID del usuario:", id);
        return {
          url: `/usuarios/${id}`,
          method: "GET"
        }
      },
      providesTags: (result, error, id) => [{ type: "Usuarios", id }],
    }),

    //actualizar un usuario
    updateUser: builder.mutation<UserResponse, { id: string; data: Partial<User> }>({
      query: ({ id, data }) => {
        console.log("🛠️ Enviando usuario desde mutation:", data);
        return {
          url: `/usuarios/${id}`,
          method: "PUT",
          body: data,
        };
      },
      invalidatesTags: (result, error, { id }) => [
        { type: "Usuarios", id },
        { type: "Usuarios", id: "LIST" },
      ],
    }),

    //crear un usuario
    createUser: builder.mutation<CreateUserResponse, CreateUserRequest>({
      query: ({ data, userLoginId }) => {
        return {
          headers: {
            "X-Creador-Id": String(userLoginId), // ✅ HTTP headers son siempre strings
          },
          url: "usuarios",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: [{ type: "Usuarios", id: "LIST" }],
    }),

    //usuario por rol
    getUsuariosByRol: builder.query<getUsersResponse, UserRole>({
      query: (rol) => `/usuarios/rol/${rol}`,
      providesTags: [{ type: "Usuarios", id: "LIST" }],
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRefreshTokenMutation,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useCreateUserMutation,
  useGetUsersQuery,
  useGetUsuariosByRolQuery
} = authApi;
