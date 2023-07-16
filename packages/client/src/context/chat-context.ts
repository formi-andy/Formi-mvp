import { createContext } from "react";
import { ChatClient } from "../../types/index-types";
export default createContext<ChatClient | null>(null);
