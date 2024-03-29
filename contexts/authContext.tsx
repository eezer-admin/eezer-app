import { AuthContextData } from '@interfaces/User';
import { User } from '@src/domain/entities/User';
import { ClearTransportLogUseCase } from '@usecases/transport/ClearTransportLogUseCase';
import { ClearTransportUseCase } from '@usecases/transport/ClearTransportUseCase';
import { ClearUserUseCase } from '@usecases/user/ClearUserUseCase';
import { GetUserUseCase } from '@usecases/user/GetUserUseCase';
import { LoginUseCase } from '@usecases/user/LoginUseCase';
import { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = (props) => {
  const [user, setUser] = useState<AuthContextData>();
  const [authLoaded, setAuthLoaded] = useState(false);

  // Determine if the user is already logged in when the app loads.
  // If there's a user in the local storage, assign it to the context
  // to make the app recognize it.
  useEffect(() => {
    new GetUserUseCase().execute().then((user: User | null) => {
      if (user) {
        setUser(user);
      }
      setAuthLoaded(true);
    });
  }, []);

  // Makes an actual login request towards the backend API.
  const login = async (username: string, password: string): Promise<User | null> => {
    return new LoginUseCase().execute(username, password).then((user: User) => {
      if (user) {
        setUser(user);

        return user;
      }

      return null;
    });
  };

  // Removes the user from the local storage and context.
  const logout = async () => {
    await new ClearTransportLogUseCase().execute();
    await new ClearTransportUseCase().execute();
    await new ClearUserUseCase().execute();

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
