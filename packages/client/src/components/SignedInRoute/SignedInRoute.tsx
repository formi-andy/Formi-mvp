import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FirebaseAuthContext } from "../../contexts/FirebaseAuth";
import { useLocation } from "react-router-dom";

type Props = {
  children: React.ReactNode;
};

export function SignedInRoute({ children }: Props) {
  const { currentUser } = useContext(FirebaseAuthContext);
  const navigate = useNavigate();

  const { pathname } = useLocation();

  useEffect(() => {
    if (currentUser && (pathname === "/signin" || pathname === "/signup")) {
      navigate("/view");
    }
  }, [currentUser, navigate]);

  return <>{children}</>;
}
