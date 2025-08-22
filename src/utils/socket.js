import { io } from "socket.io-client";
import { BASE_URL } from "./constants";

export const createSocketConnection = () => {
  if (location.hostname === "localhost") {
    return io(BASE_URL, {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });
  }
  else{
    return io("/", { path: "/api/socket.io" });
  }
  
};
