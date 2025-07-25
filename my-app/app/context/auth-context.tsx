'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut, getIdToken, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
interface AuthContextType {
  user: User | null;
  logout: () => Promise<void>;
  getToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);


useEffect(() => {
const unsubscribe = onAuthStateChanged(auth, (user) => {
    console.log('Firebase Auth State Changed:', user);
if (user) {
setUser(user);
} });

  return () => unsubscribe();
}, []);

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

const getToken = async () => {
  const user = auth.currentUser;
  if (user) {
    return await user.getIdToken(true);
  }
  return null;
};


  return (
    <AuthContext.Provider value={{ user, logout, getToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
