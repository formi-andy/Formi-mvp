import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FirebaseAuthContext } from "../../contexts/FirebaseAuth";

type Props = {
  children: React.ReactNode;
};

export function ProtectedRoute({ children }: Props) {
  const { currentUser } = useContext(FirebaseAuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate("/signin");
    }
  }, [currentUser, navigate]);

  return <>{children}</>;
}
