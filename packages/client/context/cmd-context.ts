import { createContext } from "react";
import { CommandChannelClient } from "@/types/index-types";
export default createContext<CommandChannelClient | null>(null);
