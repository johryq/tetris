const color = [
  "linear-gradient(180deg,#FA9A87 2%,#FAC8BB 100%)",
  "linear-gradient(180deg,#C671D9 2%,#D39ED9 100%)",
  "linear-gradient(180deg,#8A9FF0 2%,#BCC2F0 100%)",
  "linear-gradient(180deg,#71D9C3 2%,#9ED9D2 100%)",
  "linear-gradient(180deg,#ACFC83 2%,#C8FCB8 100%)",
];
export const shape = [
  {
    // L形
    site: [0, 0, 0, 1, 1, 1, 2, 1],
    color: color[0],
    offset: [0, 1, 0],
  },
  {
    // T
    site: [0, 1, 1, 0, 1, 1, 2, 1],
    color: color[1],
    offset: [0, 1, 0],
  },
  {
    // Z
    site: [1, 1, 1, 2, 2, 1, 2, 2],
    color: color[2],
    offset: [0, 1, 0],
  },
  {
    // 田
    site: [0, 0, 0, 1, 1, 0, 1, 1],
    color: color[3],
    offset: [0, 1, 0],
  },
  {
    // ｜
    site: [0, 0, 1, 0, 2, 0, 3, 0],
    color: color[4],
    offset: [0, 0, 0],
  },
];
