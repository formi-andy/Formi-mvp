import { createContext } from "react";
import { MediaStream } from "../../types/index-types";
interface MediaContext {
  audio: {
    encode: boolean;
    decode: boolean;
  };
  video: {
    encode: boolean;
    decode: boolean;
  };
  share: {
    encode: boolean;
    decode: boolean;
  };
  mediaStream: MediaStream | null;
}
export default createContext<MediaContext>(null as any);
