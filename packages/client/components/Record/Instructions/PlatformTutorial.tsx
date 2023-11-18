"use client";

import { useDisclosure } from "@mantine/hooks";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

import AppLoader from "@/components/Loaders/AppLoader";
import NotFoundPage from "@/app/not-found";
import PlatformTutorialModal from "./PlatformTutorialModal";
import { UserRole } from "@/types/role-types";

const PlatformTutorial = () => {
  const [opened, { open, close }] = useDisclosure(true);
  const user = useQuery(api.users.currentUser);

  if (user === undefined) {
    return <AppLoader />;
  }

  if (!user) {
    return <NotFoundPage />;
  }

  if (user.role === UserRole.Patient) {
    return <PlatformTutorialModal opened={opened} close={close} />;
  } // else return platform tutorial for doctors

  return <></>;
};

export default PlatformTutorial;
