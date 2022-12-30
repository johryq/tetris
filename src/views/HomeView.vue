<template>
  <div class="game">
    <div class="game-box">
      <div class="game-main">
        <div class="game-container">
          <div class="row" :key="index" v-for="(row, index) in frame">
            <div
              class="block"
              :style="{ background: block.bg }"
              :key="idx2"
              v-for="(block, idx2) in row"
            ></div>
          </div>
        </div>
        <div class="game-right">
          <div class="game-container2">
            <div class="row" :key="index" v-for="(row, index) in frame2">
              <div
                class="block"
                :style="{ background: block.bg }"
                :key="idx2"
                v-for="(block, idx2) in row"
              ></div>
            </div>
          </div>
          <div class="game-infamation">
            <div class="info">得分：{{ score }}</div>
            <div @click="addLevel" class="info">等级：{{ level }}</div>
            <div @click="changeStart" class="info btn">
              <svg v-show="isStart" class="icon" aria-hidden="true">
                <use xlink:href="#icon-zanting"></use>
              </svg>
              <svg v-show="!isStart" class="icon" aria-hidden="true">
                <use xlink:href="#icon-xiangyou"></use>
              </svg>
            </div>
            <div @click="resetGame" class="info btn">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-refresh1"></use>
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div class="game-controller">
        <div class="ctl-left">
          <div @click="blockLeftMove" class="btn">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-xiangzuo"></use>
            </svg>
          </div>
        </div>
        <div class="ctl-middle">
          <div @click="blockChange" class="btn">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-xiangshang"></use>
            </svg>
          </div>
          <div @click="blockDown" class="btn">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-xiangxia"></use>
            </svg>
          </div>
        </div>
        <div class="ctl-right">
          <div @click="blockRightMove" class="btn">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-xiangyou"></use>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import "//at.alicdn.com/t/c/font_3841683_jvc3jgkx0x.js";
import { onMounted, reactive, watch } from "vue";
import { storeToRefs } from "pinia";
import { useStore } from "@/stores/main";
import { KeyCode, type Block, type Block2 } from "@/type/type";
import { shape } from "@/utils/block";

const stores = useStore();
const initDate = reactive({
  row: 20,
  col: 10,
  bg: "#eee",
});
const { frame, frame2, block, nextBlock, score, isStart, level } =
  storeToRefs(stores);
let oldFrame: any = [];
let tempBlock: any = {};
let playGameTimer = -1;

onMounted(() => {
  initFrame();
  getFirstBlock();
  setKeyDown();
});

watch(
  () => "score.value",
  (newVal: any) => {
    if (level.value === 1) {
      if (newVal % 100 > 1) {
        level.value = 2;
      }
    } else if (level.value === 2) {
      if (newVal % 1000 > 1) {
        level.value = 3;
      }
    }
  }
);

const addLevel = () => {
  level.value += 1;
  changeStart();
  changeStart();
};

const changeStart = () => {
  setTimeout(() => {
    isStart.value = !isStart.value;
    if (isStart.value) {
      playGameTimer = setInterval(blockDown, 1000 - 100 * level.value);
    } else {
      clearInterval(playGameTimer);
    }
  }, 200);
};

function initFrame() {
  // 清空画布
  frame.value.pop();
  frame2.value.pop();
  oldFrame.pop();
  // 初始化画布
  for (let i = 0; i < initDate.row; i++) {
    const rowArray = [];
    for (let j = 0; j < initDate.col; j++) {
      rowArray.push({
        data: 0,
        bg: initDate.bg,
      });
    }
    // 填充画布
    oldFrame.push(rowArray);
    frame.value.push(rowArray);
  }
}

// 获取一个旋转之后的block
function getABlock() {
  let num = Math.floor(Math.random() * shape.length);
  tempBlock = shape[num];
  const blockRotate = Math.floor(Math.random() * 4);
  for (let index = 0; index < blockRotate; index++) {
    blockChange(true);
  }
  const site = tempBlock.site;
  const yArray = [site[0], site[2], site[4], site[6]];
  const maxY = Math.max(...yArray);
  const xArray = [site[1], site[3], site[5], site[7]];
  const maxX = Math.max(...xArray);

  if (maxY > initDate.row - 1) {
    for (let b = 0; b < frame.value.length * 2 - 1; b += 2) {
      site[b] = site[b] - (maxY - initDate.row);
      if (maxX > initDate.col - 1) {
        site[b + 1] = site[b + 1] - (maxX - initDate.col);
      }
    }
  }

  return tempBlock;
}

function getFirstBlock() {
  if (!block.value.color) {
    console.log("first");
    nextBlock.value = getABlock();
    block.value = getABlock();
  } else {
    console.log("two");
    block.value = nextBlock.value;
    nextBlock.value = getABlock();
  }
  renderCon2();

  // 居中
  let minX = devanning(block.value.site[1]);
  let minY = devanning(block.value.site[0]);
  let maxX = 0;

  for (let index = 0; index < 8; index += 2) {
    if (block.value.site[index] < minY) {
      minY = block.value.site[index];
    }
    if (block.value.site[index + 1] < minX) {
      minX = block.value.site[index + 1];
    }
    if (block.value.site[index + 1] > maxX) {
      maxX = block.value.site[index + 1];
    }
  }
  const middleNum = Math.floor((10 - (maxX - minX)) / 2);
  for (let index = 0; index < 8; index += 2) {
    // 左三
    // if (minX > 3) {
    //   block.value.site[index + 1] = block.value.site[index + 1] - (minX - 3);
    // } else {
    //   block.value.site[index + 1] = block.value.site[index + 1] + (3 - minX);
    // }
    if (minX === middleNum) {
      return;
    }
    if (maxX > 4) {
      block.value.site[index + 1] =
        block.value.site[index + 1] - (minX - middleNum);
    } else {
      block.value.site[index + 1] =
        block.value.site[index + 1] + (middleNum - minX);
    }

    block.value.site[index] = block.value.site[index] - minY;
  }
  refreshCon();
}

function renderCon2() {
  const site = devanning(nextBlock.value.site);
  const tbg = nextBlock.value.color;
  const colArray = [];
  // 刷新画布
  for (let i = 0; i < 4; i++) {
    const rowArray = [];
    for (let j = 0; j < 4; j++) {
      rowArray.push({
        data: 0,
        bg: initDate.bg,
      });
    }
    colArray.push(rowArray);
  }
  frame2.value = colArray;
  // 渲染画布
  const yArray = [site[0], site[2], site[4], site[6]];
  const maxY = Math.max(...yArray);
  const xArray = [site[1], site[3], site[5], site[7]];
  const maxX = Math.max(...xArray);

  for (let b = 0; b < frame2.value.length * 2 - 1; b += 2) {
    if (maxY > 3) {
      site[b] = site[b] - (maxY - 3);
    }
    if (maxX > 3) {
      site[b + 1] = site[b + 1] - (maxX - 3);
    }
  }
  // 渲染nextBlock
  for (let b = 0; b < frame2.value.length * 2 - 1; b += 2) {
    let row = site[b];
    let col = site[b + 1];
    frame2.value[row][col].bg = tbg;
  }
}

// 刷新画布，画上去
function refreshCon() {
  const site = block.value.site;
  const tbg = block.value.color;

  frame.value = JSON.parse(JSON.stringify(oldFrame));

  for (let b = 0; b < frame2.value.length * 2 - 1; b += 2) {
    frame.value[site[b]][site[b + 1]].bg = tbg;
  }
}

// controller
function setKeyDown() {
  const keyCode = new KeyCode();
  document.addEventListener("keydown", (e) => {
    let code = e.keyCode;
    if (code === keyCode.up) {
      blockChange();
    } else if (code === keyCode.down) {
      blockDown();
    } else if (code === keyCode.left) {
      blockLeftMove();
    } else if (code === keyCode.right) {
      blockRightMove();
    }
  });
}

function blockDown() {
  const site = devanning(block.value.site);
  const yArray = [site[0], site[2], site[4], site[6]];
  const maxNun = Math.max(...yArray);
  const newNum = maxNun + 1;
  // 改变后方块位置
  for (let index = 0; index < 8; index += 2) {
    site[index] = site[index] + 1;
  }
  // 到达最后一行
  console.log(newNum);

  if (newNum === initDate.row - 1) {
    // const oldSite = devanning(block.value.site);
    // 固定方块
    for (let index = 0; index < 8; index += 2) {
      oldFrame[site[index]][site[index + 1]].bg = block.value.color;
      oldFrame[site[index]][site[index + 1]].data = 1;
    }
    // 得分判定
    haveScore();
    block.value.site = site;
    refreshCon();
    // 获取下一个方块
    getFirstBlock();
  } else {
    // 碰撞判定
    isCrash(site);
  }
}

function blockLeftMove() {
  const site = devanning(block.value.site);
  const xArray = [site[1], site[3], site[5], site[7]];
  const minNum = Math.min(...xArray);
  const newNum = minNum - 1;
  if (newNum < 0) {
    console.log("can not left move");
  } else {
    for (let index = 0; index < 8; index += 2) {
      site[index + 1] = site[index + 1] - 1;
    }
    isCrash(site);
  }
}

function blockRightMove() {
  const site = devanning(block.value.site);
  const xArray = [site[1], site[3], site[5], site[7]];
  const minNum = Math.max(...xArray);
  const newNum = minNum + 1;
  if (newNum > initDate.col - 1) {
    console.log("can not right move");
  } else {
    for (let index = 0; index < 8; index += 2) {
      site[index + 1] = site[index + 1] + 1;
    }
    isCrash(site);
  }
}

function blockChange(isFirstBlock = false) {
  // 旋转方式一
  // 结果 = 2
  // 旋转后的行 = 旋转前的列
  // 旋转后的列 = 旋转前的行 - 3
  let site, offset;
  if (isFirstBlock) {
    site = tempBlock.site;
    offset = tempBlock.offset;
  } else {
    site = block.value.site;
    offset = block.value.offset;
  }
  let newSite = [];
  // for (let i = 0; i < 8; i += 2) {
  //   let row = site[i];
  //   let col = site[i + 1];
  //   let newRow = col;
  //   let newCol = row - 3;
  //   newSite.push(newRow, newCol);
  // }

  // 旋转方式2
  // 结果 = 4
  // 行 = 列
  // 列 = -行
  for (let i = 0; i < 8; i += 2) {
    let row = site[i];
    let col = site[i + 1];
    let newRow = col;
    let newCol = -row;
    newSite.push(newRow, newCol);
  }
  // 负值判定
  let smallRow = newSite[0];
  let smallCol = newSite[1];
  for (let i = 0; i < 8; i += 2) {
    // 位移x至旋转位置
    newSite[i + 1] = newSite[i + 1] + 1;
    newSite[i] = newSite[i] + 1;
    if (newSite[i] < smallRow) {
      smallRow = newSite[i];
    }
    if (newSite[i + 1] < smallCol) {
      smallCol = newSite[i + 1];
    }
  }
  if (smallRow < 0) {
    for (let i = 0; i < 8; i += 2) {
      newSite[i] = newSite[i] + Math.abs(smallRow);
    }
  }
  if (smallCol < 0) {
    for (let i = 0; i < 8; i += 2) {
      newSite[i + 1] = newSite[i + 1] + Math.abs(smallCol);
    }
  }
  // 旋转角度赋值
  if (offset[2] === 180) {
    offset[2] = 0;
  } else {
    offset[2] = offset[2] + 45;
  }
  // 获取最后旋转完成方块位置
  if (isFirstBlock) {
    tempBlock.site = newSite;
    tempBlock.offset = offset;
  } else {
    block.value.site = newSite;
    block.value.offset = offset;
    refreshCon();
  }
}

const resetGame = () => {
  stores.$reset();
  oldFrame = [];
  clearInterval(playGameTimer);
  initFrame();
  getFirstBlock();
};

// 得分判定
function haveScore() {
  for (let index = 0; index < 4; index++) {
    let idx2 = oldFrame.length - index - 1;
    const sum = oldFrame[idx2].reduce(
      (accumulator: any, currentValue: any) => accumulator + currentValue.data,
      0
    );
    if (sum === 10) {
      console.log(idx2, sum);
      oldFrame.splice(idx2, 1);
      const rowArray = [];
      for (let j = 0; j < initDate.col; j++) {
        rowArray.push({
          data: 0,
          bg: initDate.bg,
        });
      }
      oldFrame.unshift(rowArray);
      score.value += 1;
    }
  }
}

// 是否发生碰撞
function isCrash(site: number[]) {
  const lastBlock = devanning(site);
  // 下一块方块
  for (let index = 0; index < 8; index += 2) {
    site[index] = site[index] + 1;
  }
  // 下一个方块是否与固定块碰撞
  for (let index = 0; index < 8; index += 2) {
    if (frame.value[site[index]][site[index + 1]].data === 1) {
      const yArray = [lastBlock[0], lastBlock[2], lastBlock[4], lastBlock[6]];
      const minNum = Math.min(...yArray);
      const maxNum = Math.max(...yArray);
      console.log(minNum, maxNum);

      if (minNum === maxNum - minNum) {
        const val = window.confirm("game over,restart game?");
        if (val === true) {
          resetGame();
        }
        return;
      }
      // 固定方块
      for (let b = 0; b < 8; b += 2) {
        oldFrame[lastBlock[b]][lastBlock[b + 1]].bg = block.value.color;
        oldFrame[lastBlock[b]][lastBlock[b + 1]].data = 1;
      }
      // 得分判定
      haveScore();
      // block.value.site = lastBlock;
      // 刷新界面
      // refreshCon();
      // 获取下一个方块
      getFirstBlock();
      return;
    }
  }
  block.value.site = lastBlock;
  refreshCon();
}
// 拆箱
function devanning(obj: Object) {
  return JSON.parse(JSON.stringify(obj));
}
</script>

<style scoped lang="less">
@blockSize: 20px;
@spaceSize: 1px;
.game {
  .icon {
    width: 1.5em;
    height: 1.5em;
    vertical-align: -0.4em;
    fill: currentColor;
    overflow: hidden;
  }
  &-box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    .game-main {
      display: flex;
      .game-container,
      .game-container2 {
        .row {
          display: flex;
          padding: @spaceSize;
          .block {
            margin: 0 @spaceSize;
            width: @blockSize;
            height: @blockSize;
          }
        }
      }
      .game-right {
        display: flex;
        flex-direction: column;
        margin-left: 20px;
        .game-infamation {
          .info {
            line-height: 40px;
            height: 40px;
          }
          .btn {
            width: 40px;
            border-radius: 5px;
            text-align: center;
            background-color: #eee;
            margin-bottom: 10px;
          }
        }
      }
    }
    .game-controller {
      width: 200px;
      height: 110px;
      display: flex;
      justify-content: space-between;
      margin-top: 10px;

      .ctl-left,
      .ctl-middle,
      .ctl-right {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }
      .ctl-middle {
        justify-content: space-between;
      }
      .btn {
        width: 50px;
        height: 50px;
        border-radius: 20px;
        background-color: #eee;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
}
</style>
