import { createContext } from "react";
import { SubsessionClient } from "../../types/index-types";
export default createContext<SubsessionClient | null>(null);
