import { createContext, useEffect, useState } from 'react';

import { getStoredUser, requestLogin, deleteStoredUser } from '../services/AuthService';
import { removeFromStorage as removeTransportLog } from '../services/TransportLogService';
import { remove as removeCurrentTransport } from '../services/TransportService';
import { AuthContextData, User } from '../types/Auth';

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = (props) => {
  const [user, setUser] = useState<AuthContextData>();
  const [authLoaded, setAuthLoaded] = useState(false);

  // Determine if the user is already logged in when the app loads.
  // If there's a user in the local storage, assign it to the context
  // to make the app recognize it.
  useEffect(() => {
    getStoredUser().then((user: User) => {
      if (user) {
        setUser(user);
      }
      setAuthLoaded(true);
    });
  }, []);

  // Makes an actual login request towards the backend API.
  const login = async (username: string, password: string): Promise<User> => {
    return requestLogin(username, password).then((user: User) => {
      setUser(user);

      return user;
    });
  };

  // Removes the user from the local storage and context.
  const logout = async () => {
    await removeTransportLog();
    await removeCurrentTransport();
    await deleteStoredUser();

    setUser(null);
  };

  const isLoggedIn = (): boolean => {
    return !!user?.access_token;
  };

  return (
    <AuthContext.Provider value={{ user, authLoaded, login, logout, isLoggedIn }}>
      {props.children}
    </AuthContext.Provider>
  );
};
