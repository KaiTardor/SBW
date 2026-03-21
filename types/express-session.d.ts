import session from 'express-session';

declare module 'express-session' {
  export interface SessionData {
    carrito: Array<{id: number, cantidad: number}>;
    total_carrito: number;
  }
}
