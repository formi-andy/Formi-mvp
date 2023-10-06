import { createContext } from "react";
import { RecordingClient } from "@/types/index-types";
export default createContext<RecordingClient | null>(null);
