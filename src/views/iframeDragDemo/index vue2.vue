<template>
  <div class="wrapper">
    <!-- 悬浮头像  -->
    <vue-draggable-resizable v-if="showNewAvatar" :x="500" :y="50" @dragging="avatarPrint" @dragstop="handleDragEnd"
      class="avatar-draggable" :draggable="true" :resizable="false" :parent="true">
      <div class="avatar-draggable-img" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
        <el-icon v-if="showavatarClose" class="avatar-draggable-img-close" @click="clickavatarCloseFn">
          <CircleCloseFilled />
        </el-icon>
        <img @click="handleShowNewAvatarFn" src="./assets/avatar.png" alt="">
      </div>
    </vue-draggable-resizable>
    <!-- 悬浮机器人弹窗  -->
    <vue-draggable-resizable v-if="showNewRobot" v-show="!showNewAvatar" :w="draggable.initW" :h="draggable.initH"
      :x="draggable.x" :y="draggable.y" :draggable="true" :resizable="true" :parent="true" 
      :class="['custom-border', 'main-draggable']">
      <el-icon class="closeicon" id="robotCloseId" @click="() => { showNewAvatar = true }">
        <CircleCloseFilled />
      </el-icon>
      <iframe src="注意需要嵌套的地址" style="width: 96%; height: 96%;" class="iframne"
        allow="camera; microphone"></iframe>
    </vue-draggable-resizable>
    <div class="header">
      <button @click="wakeupnewrobotFn">唤醒数字员工</button>
    </div>
  </div>
</template>

<script>
import VueDraggableResizable from './vuedraggableresizable/components/vue-draggable-resizable.vue'
import './vuedraggableresizable/components/vue-draggable-resizable.css'
export default {
  components: {
    VueDraggableResizable
  },
  data() {
    return {
      isDragging: false, // 是否在拖拽
      showNewAvatar: false, // 是否显示新头像
      showavatarClose: false, // 是否显示关闭图标
      showNewRobot: false, // 是否显示新机器人
      draggable: {
        x: 527,
        y: 69,
        initW: 868,
        initH: 620,
      },//拖动坐标参数
      showrobot: false, // 机器人显示状态
      position: { x: 50, y: 50 }, // 机器人初始位置
    }
  },
  methods: {
    // 唤醒机器人 按钮事件
    wakeupnewrobotFn() {
      this.showNewRobot = !this.showNewRobot
      this.showNewAvatar = false
    },

    // 悬浮头像事件==关闭按钮
    clickavatarCloseFn() {
      this.showNewAvatar = false
      this.showNewRobot = false
    },
    // 悬浮头像事件==鼠标移入
    handleMouseEnter() {
      this.showavatarClose = true
    },
    // 悬浮头像事件==鼠标移出 
    handleMouseLeave() {
      this.showavatarClose = false
    },
    // 悬浮头像事件==点击头像图片 
    handleShowNewAvatarFn() {
      if (this.isDragging) return
      this.showNewAvatar = false
    },
    // 悬浮头像事件==拖动中 
    avatarPrint(e) {
      this.isDragging = true
    },
    // 悬浮头像事件==拖动结束 
    handleDragEnd() {
      // 拖拽结束延时否则执行先于click
      setTimeout(() => {
        this.isDragging = false;
      }, 0);
    }
  }
}
</script>

<style lang="less" scoped>
// 可拖拽头像和机器人样式==start
   //悬浮头像样式
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
    }

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }
}
   //悬浮机器人样式
.main-draggable {
  position: absolute !important;
  z-index: 10000 !important;
  border: 1px solid #249FCE;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: linear-gradient(135deg, #a1c4fd, #c2e9fb);
  cursor: move;

  .closeicon {
    font-size: 27px;
    color: #fff;
    position: absolute;
    right: 0;
    top: 0;
    cursor: pointer;
  }
}

// 可拖拽头像和机器人样式==end
.wrapper {
  background-color: #293441;
  height: 100vh;
}
</style>