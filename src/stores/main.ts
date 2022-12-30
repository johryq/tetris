import { defineStore } from "pinia";
import type { Block, Block2 } from "@/type/type";

export const useStore = defineStore("main", {
  state: () => {
    return {
      score: 0,
      level: 1,
      isStart: false,
      frame: [<Block[]>[]],
      frame2: [<Block[]>[]],
      block: <Block2>{},
      nextBlock: <Block2>{},
    };
  },
});
