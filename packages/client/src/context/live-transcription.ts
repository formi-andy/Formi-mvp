import { createContext } from "react";
import { LiveTranscriptionClient } from "../../types/index-types";
export default createContext<LiveTranscriptionClient | null>(null);
