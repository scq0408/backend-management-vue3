// RobotMonitor.js
import Recorder from "./recorder.js"
let diyflowCssFn = () => {
  const styleElement = document.createElement("style");
  const boxStyles = `
    .boxFlowingCss {
        padding: 10px;
        position: relative;
        overflow: hidden;
        z-index: 1;
    }

    .boxFlowingCss::before {
        content: '';
        position: absolute;
        width: 200%;
        height: 200%;
        background-color: #22292f;
        background-image: conic-gradient(transparent, #66ddf7, transparent 30%);
        left: -50%;
        top: -50%;
        z-index: -2;
        animation: rotate 5s linear infinite;
    }

    @keyframes rotate {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }

    .boxFlowingCss::after {
        content: '';
        position: absolute;
        inset: 1vmin;
        background-color: #22292f;
        z-index: -1;
        border-radius: 4px;
    }
`;

  styleElement.textContent = boxStyles;
  document.head.appendChild(styleElement);
};
diyflowCssFn();

class RobotMonitor {
  constructor(options = {}) {
    this.highlightElement = [];
    this.isPaused = false;
    this.pauseResolve = null;
    // 重构延迟状态：新增暂停时的时间冻结字段
    this.delayState = {
      isDelaying: false,
      startTime: 0,       // 延迟开始时间戳
      totalTime: 0,       // 总延迟时间
      elapsedTime: 0,     // 已消耗的有效时间（排除暂停）
      resolve: null
    };
    this.delayTimer = null; // 定时器引用
    this.API_URL = "chat"//音频
        this.audioPlayerObj = {
      blob: null,
      url: null,
      audioPlayer: null,
      isover: true 
    } // 音频播放器对象
  }
  /**
   * 加载并播放音频
   * @param {String} id 音频ID
   */
  async loadAndPlayAudio(id, msgJSON) {
    try {
      const response = await fetch(this.API_URL, {
        method: "POST",
        body: JSON.stringify({ id, info: "wav" }),
        headers: { "Content-Type": "application/json" }
      })
      if (response.ok) {
        this.audioPlayerObj.blob = await response.blob()
        this.audioPlayerObj.url = URL.createObjectURL(this.audioPlayerObj.blob)
        this.audioPlayerObj.audioPlayer = new Audio()
        this.audioPlayerObj.audioPlayer.src = this.audioPlayerObj.url
        // 绑定播放完成事件监听
        this.audioPlayerObj.audioPlayer.addEventListener("ended", this.handleAudioEnded.bind(this))
        this.audioPlayerObj.audioPlayer.play()
      } else {
        console.error("音频加载失败:", response.statusText)
      }
    } catch (error) {
      console.error("音频请求错误:", error)
    }
  }






























  setPause(paused) {
    // 暂停状态变更时，立即处理延迟计时的冻结/恢复
    if (paused === this.isPaused) return; // 状态未变，无需处理
    
    this.isPaused = paused;
    
    if (paused) {
      // 暂停时：冻结延迟计时，清除当前定时器
      this.freezeDelay();
    } else {
      // 恢复时：先resolve暂停的Promise，再恢复延迟计时
      if (this.pauseResolve) {
        this.pauseResolve();
        this.pauseResolve = null;
      }
      this.resumeDelay();
    }
  }

  async checkPause() {
    if (this.isPaused) {
      await new Promise((resolve) => {
        this.pauseResolve = resolve;
      });
    }
  }

  handleLightEle(item, element) {
    if (item.highlight) {
      if (element) {
        this.init.initDarkEle();
        element.style.transition = "box-shadow 0s ease-in-out";
        element.style.boxShadow = "0 0 10px 5px #FFFFA2";
        element.classList.add("boxFlowingCss");
        this.highlightElement.push(element);
      }
    }
  }

  get init() {
    return {
      initDarkEle: () => {
        if (this.highlightElement.length > 0) {
          const lastEle = this.highlightElement[this.highlightElement.length - 1];
          lastEle.style.boxShadow = "none";
          lastEle.classList.remove("boxFlowingCss");
        }
      },
    };
  }

  async controlModelFn(res) {
    this.init.initDarkEle();
    this.highlightElement = [];
    
    for (const [index, item] of res.action_list.entries()) {
      await this.checkPause();
      
      await this.performAction(item);
      if (index < res.action_list.length - 1) {
        await this.delayWithPause(item.delay || 500);
      }
    }
  }

  /**
   * 带暂停功能的延迟函数（修复暂停后提前执行问题）
   * 核心：用elapsedTime记录有效耗时，暂停时冻结，恢复后续算
   */
  async delayWithPause(ms) {
    if (this.isPaused) {
      await this.checkPause();
    }
    
    // 重置延迟状态
    this.delayState = {
      isDelaying: true,
      startTime: Date.now(),
      totalTime: ms,
      elapsedTime: 0,
      resolve: null
    };
    
    return new Promise((resolve) => {
      this.delayState.resolve = resolve;
      this.startDelay();
    });
  }

  /**
   * 开始延迟计时（核心逻辑）
   */
  startDelay() {
    if (!this.delayState.isDelaying || this.isPaused) return;
    
    // 计算剩余有效时间 = 总时间 - 已消耗时间
    const remainingTime = Math.max(0, this.delayState.totalTime - this.delayState.elapsedTime);
    if (remainingTime <= 0) {
      // 剩余时间为0，直接结束延迟
      this.finishDelay();
      return;
    }
    
    // 清除旧定时器，避免重复计时
    if (this.delayTimer) {
      clearTimeout(this.delayTimer);
    }
    
    // 启动新定时器，记录开始时间
    const timerStart = Date.now();
    this.delayTimer = setTimeout(() => {
      // 定时器结束后，更新已消耗时间
      this.delayState.elapsedTime += Date.now() - timerStart;
      this.finishDelay();
    }, remainingTime);
  }

  /**
   * 暂停时冻结延迟计时
   */
  freezeDelay() {
    if (!this.delayState.isDelaying || !this.delayTimer) return;
    
    // 清除当前定时器
    clearTimeout(this.delayTimer);
    this.delayTimer = null;
    
    // 计算到暂停时为止的有效耗时，更新elapsedTime
    if (this.delayState.startTime > 0) {
      this.delayState.elapsedTime += Date.now() - this.delayState.startTime;
    }
  }

  /**
   * 恢复暂停后的延迟计时
   */
  resumeDelay() {
    if (!this.delayState.isDelaying) return;
    
    // 重置startTime为当前时间，后续计时基于此
    this.delayState.startTime = Date.now();
    this.startDelay(); // 重新启动延迟
  }

  /**
   * 结束延迟，触发resolve
   */
  finishDelay() {
    this.delayState.isDelaying = false;
    this.delayTimer = null;
    this.delayState.resolve?.();
    // 清空延迟状态（避免残留）
    this.delayState.resolve = null;
  }

  async performAction(item) {
    await this.checkPause();
    
    let itemId = item.id;
    let element = document.getElementById(itemId);

    this.handleLightEle(item, element);

    if (item.action === "click" && element) {
      element.dispatchEvent(new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
      }));
    }

    if (item.action === "mouseover" && element) {
      console.log(element, 'mouseover事件');
      element.dispatchEvent(new MouseEvent('mouseover', {
        bubbles: true,
        cancelable: true,
        view: window
      }));
    }
  }

  delay(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  stopAllActions() {
    this.pauseResolve = null;
    this.isPaused = false;
    
    // 彻底清除定时器和延迟状态
    if (this.delayTimer) {
      clearTimeout(this.delayTimer);
    }
    this.delayTimer = null;
    this.delayState = {
      isDelaying: false,
      startTime: 0,
      totalTime: 0,
      elapsedTime: 0,
      resolve: null
    };
    
    this.init.initDarkEle();
    this.highlightElement = [];
  }
}

export default RobotMonitor;