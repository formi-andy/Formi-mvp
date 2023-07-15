import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { User } from "firebase/auth";
import app from "../firebase";

interface FirebaseAuthContextProps {
  currentUser: User | null | undefined;
}

export const FirebaseAuthContext =
  React.createContext<FirebaseAuthContextProps>({
    currentUser: null,
  });

export const FirebaseAuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>();
  const auth = getAuth(app);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
  }, [auth]);

  return (
    <FirebaseAuthContext.Provider value={{ currentUser }}>
      {children}
    </FirebaseAuthContext.Provider>
  );
};
