import React, { createContext, useState, ReactNode, useContext } from 'react';
import { User } from '../types/types.ts'; // We'll define this type later

interface UsersContextProps {
  users: Map<number, User>;
  setUsers: React.Dispatch<React.SetStateAction<Map<number, User>>>;
}

const UsersContext = createContext<UsersContextProps | undefined>(undefined);

export const UsersProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<Map<number, User>>(new Map());

  return (
    <UsersContext.Provider value={{ users, setUsers }}>
      {children}
    </UsersContext.Provider>
  );
};

export const useUsers = () => {
  const context = useContext(UsersContext);
  if (context === undefined) {
    throw new Error('useUsers must be used within a UsersProvider');
  }
  return context;
};