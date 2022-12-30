export interface Block {
  data: number;
  bg: string;
}

export interface Block2 {
  site: number[];
  color: string;
  offset: number[];
}

export class KeyCode {
  up = 38;
  down = 40;
  left = 37;
  right = 39;
}
