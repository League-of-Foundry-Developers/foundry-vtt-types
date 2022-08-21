import * as _io from "socket.io-client";

declare global {
  // eslint-disable-next-line no-var
  var io: typeof _io & typeof _io.io & { connect: typeof _io.io };
  namespace io {
    type Socket = _io.Socket;
    type SocketOptions = _io.SocketOptions;
    type Manager = _io.Manager;
    type ManagerOptions = _io.ManagerOptions;
  }
}
