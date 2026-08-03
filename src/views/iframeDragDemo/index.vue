<template>
  <div class="wrapper">
    <!-- 悬浮头像 -->
    <vue-draggable-resizable
      v-if="showNewAvatar"
      :x="500"
      :y="50"
      @dragging="avatarPrint"
      @dragstop="handleDragEnd"
      class="avatar-draggable"
      :draggable="true"
      :resizable="false"
      :parent="true"
    >
      <div
        class="avatar-draggable-img"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave"
      >
        <el-icon
          v-if="showavatarClose"
          class="avatar-draggable-img-close"
          @click="clickavatarCloseFn"
        >
          <CircleCloseFilled />
        </el-icon>
        <img
          @click="handleShowNewAvatarFn"
          src="./assets/avatar.png"
          alt="头像"
        >
      </div>
    </vue-draggable-resizable>

    <!-- 悬浮机器人弹窗 -->
    <vue-draggable-resizable
      v-if="showNewRobot"
      v-show="!showNewAvatar"
      :w="draggable.initW"
      :h="draggable.initH"
      :x="draggable.x"
      :y="draggable.y"
      :draggable="true"
      :resizable="true"
      :parent="true"
      class="custom-border main-draggable"
    >
      <el-icon
        class="closeicon"
        id="robotCloseId"
        @click="showNewAvatar = true"
      >
        <CircleCloseFilled />
      </el-icon>
      <iframe
        src="https://172.27.33.81:19900/yixiaozhi"
        style="width: 96%; height: 96%;"
        class="iframne"
        allow="camera; microphone"
      ></iframe>
    </vue-draggable-resizable>

    <div class="header">
      <button @click="wakeupnewrobotFn">唤醒数字员工</button>
    </div>
  </div>
</template>

<script setup>
  import { ref,onMounted } from 'vue'
  // 导入组件（确保路径正确）
  import VueDraggableResizable from './vuedraggableresizable/components/vue-draggable-resizable.vue'
  // 导入图标（Vue3 Element Plus 图标导入方式）
  import { CircleCloseFilled } from '@element-plus/icons-vue'
  // 导入样式
  import './vuedraggableresizable/components/vue-draggable-resizable.css'

// 响应式数据
const isDragging = ref(false) // 是否在拖拽
const showNewAvatar = ref(false) // 是否显示新头像
const showavatarClose = ref(false) // 是否显示关闭图标
const showNewRobot = ref(false) // 是否显示新机器人
const draggable = ref({
  x: 527,
  y: 69,
  initW: 868,
  initH: 620,
}) // 拖动坐标参数
const showrobot = ref(false) // 机器人显示状态
const position = ref({ x: 50, y: 50 }) // 机器人初始位置

// 方法定义
const wakeupnewrobotFn = () => {
  showNewRobot.value = !showNewRobot.value
  showNewAvatar.value = false
}

const clickavatarCloseFn = () => {
  showNewAvatar.value = false
  showNewRobot.value = false
}

const handleMouseEnter = () => {
  showavatarClose.value = true
}

const handleMouseLeave = () => {
  showavatarClose.value = false
}

const handleShowNewAvatarFn = () => {
  if (isDragging.value) return
  showNewAvatar.value = false
  // 点击头像时显示机器人弹窗
  showNewRobot.value = true
}

const avatarPrint = (e) => {
  isDragging.value = true
}

const handleDragEnd = () => {
  // 拖拽结束延时否则执行先于click
  setTimeout(() => {
    isDragging.value = false
  }, 0)
}
</script>

<style lang="less" scoped>
// 可拖拽头像和机器人样式==start
// 悬浮头像样式
.avatar-draggable {
  border: none !important;

  &:hover {
    cursor: pointer;
  }

  &-img {
    position: relative;
    width: 80px;
    height: 80px;

    &-close {
      position: absolute;
      right: 0;
      color: #fff;
      background: rgba(0, 0, 0, 0.5);
      border-radius: 50%;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
    }
  }
}

// 悬浮机器人样式
.main-draggable {
  position: absolute !important;
  z-index: 10000 !important;
  border: 1px solid #249FCE;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #a1c4fd, #c2e9fb); // 修复背景渐变语法
  cursor: move;

  .closeicon {
    font-size: 27px;
    color: #fff;
    position: absolute;
    right: 0;
    top: 0;
    cursor: pointer;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 50%;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    transform: translate(50%, -50%); // 优化关闭按钮位置
  }
}

// 可拖拽头像和机器人样式==end
.wrapper {
  background-color: #293441;
  height: 100vh;
  position: relative; // 添加相对定位，确保绝对定位的元素正常显示
}

.header {
  padding: 20px;

  button {
    padding: 8px 16px;
    background: #249FCE;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
      background: #1a88b8;
    }
  }
}

// 修复 iframe 样式拼写错误
.iframne {
  border: none;
  border-radius: 4px;
}

// 解决 VueDraggableResizable 默认样式问题
:deep(.vue-draggable-resizable) {
  box-sizing: border-box;
}
</style>