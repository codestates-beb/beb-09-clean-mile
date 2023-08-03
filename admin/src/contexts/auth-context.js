import { createContext, useContext, useEffect, useReducer, useRef, useState } from "react";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import axios from "axios";

const HANDLERS = {
  INITIALIZE: "INITIALIZE",
  SIGN_IN: "SIGN_IN",
  SIGN_OUT: "SIGN_OUT",
  REFRESH: "REFRESH",
};

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
};

const handlers = {
  [HANDLERS.INITIALIZE]: (state, action) => {
    const user = action.payload;

    return {
      ...state,
      ...// if payload (user) is provided, then is authenticated
      (user
        ? {
            isAuthenticated: true,
            isLoading: false,
            user,
          }
        : {
            isLoading: false,
          }),
    };
  },
  [HANDLERS.SIGN_IN]: (state, action) => {
    const user = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
    };
  },
  [HANDLERS.SIGN_OUT]: (state) => {
    return {
      ...state,
      isAuthenticated: false,
      user: null,
    };
  },
};

const reducer = (state, action) =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

// The role of this context is to propagate authentication state through the App tree.

export const AuthContext = createContext({ undefined });

export const AuthProvider = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);
  const [refreshIntervalId, setRefreshIntervalId] = useState(null);
  const initialized = useRef(false);

  const router = useRouter();

  const getAuthenticated = () => {
    try {
      return window.localStorage.getItem("clean-mile-admin-authenticated") === "true";
    } catch (err) {
      throw err;
    }
  };

  const setAuthenticated = (authenticated) => {
    try {
      window.localStorage.setItem("clean-mile-admin-authenticated", authenticated);
    } catch (err) {
      throw err;
    }
  };

  // TODO: change to real API call
  const initialize = async () => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (initialized.current) {
      return;
    }

    initialized.current = true;

    let isAuthenticated = false;

    try {
      isAuthenticated = getAuthenticated();
      if (isAuthenticated) {
        // const res = await axios.get("http://localhost:8080/admin/info", null, {
        //   withCredentials: true,
        // });

        // if (!res || !res.status === 200) {
        //   console.log(res.data);
        //   return;
        // }

        // console.log(res.data.data);

        const user = {
          id: "5e86809283e28b96d2d38537",
          avatar: "/assets/avatars/avatar-anika-visser.png",
          name: "Anika Visser",
          email: "anika.visser@devias.io",
        };

        dispatch({
          type: HANDLERS.INITIALIZE,
          payload: user,
        });
      } else {
        dispatch({
          type: HANDLERS.INITIALIZE,
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const refresh = async () => {
    let isAuthenticated = false;

    console.log("refresh");

    try {
      isAuthenticated = getAuthenticated();

      if (!isAuthenticated) {
        throw new Error("Not authenticated");
      }

      const res = await axios.post("http://localhost:8080/admin/refresh", null, {
        withCredentials: true,
      });

      if (!res || !res.status === 200) {
        throw new Error("Refresh failed");
      }
    } catch (err) {
      console.error(err);
      setAuthenticated(false);
      toggleRefresh(false);
      dispatch({
        type: HANDLERS.INITIALIZE,
      });
      router.push("/auth/login");
    }
  };

  const toggleRefresh = (flag) => {
    if (flag) {
      // Refresh every 10 minutes
      const intervalId = setInterval(async () => {
        try {
          await refresh();
        } catch (err) {
          console.error(err);
        }
      }, 10 * 60 * 1000);

      setRefreshIntervalId(intervalId);
    } else {
      console.log("Clearing refresh interval", refreshIntervalId);
      clearInterval(refreshIntervalId);
      setRefreshIntervalId(null);
    }
  };

  const signIn = async (email, password) => {
    const formData = new FormData();

    formData.append("email", email);
    formData.append("password", password);

    try {
      const res = await axios.post("http://localhost:8080/admin/login", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
        },
        withCredentials: true,
      });

      if (!res || !res.status === 200) {
        throw new Error("Login failed");
      }

      const userData = res.data.data.data;
      const user = {
        id: userData._id,
        avatar: "/assets/avatars/avatar-anika-visser.png",
        name: userData.name,
        email: userData.email,
      };

      setAuthenticated(true);

      dispatch({
        type: HANDLERS.SIGN_IN,
        payload: user,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const signOut = async () => {
    try {
      const res = await axios.post("http://localhost:8080/admin/logout", null, {
        withCredentials: true,
      });

      if (!res || !res.status === 200) {
        throw new Error("Logout failed");
      }

      setAuthenticated(false);
      toggleRefresh(false);

      dispatch({
        type: HANDLERS.SIGN_OUT,
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    try {
      initialize();
    } catch (err) {
      console.error(err);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signIn,
        signOut,
        toggleRefresh,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node,
};

export const AuthConsumer = AuthContext.Consumer;

export const useAuthContext = () => useContext(AuthContext);
