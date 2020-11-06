<template>
  <div ref="drawer" class="home">
    <div class="panel" ref="panel" :style="panelStyle" @dblclick="handleScale">
      <div ref="panelContent" class="content" :style="panelContentStyle">
        <canvas id="canvas" class="canvas-main"></canvas>
      </div>
    </div>

    <div class="toolbar-wrap">
      <toolbar
        v-if="canvas"
        :canvas="canvas"
        :panelContent="panelContent"
      ></toolbar>
    </div>
  </div>
</template>

<script>
import { fabric } from "fabric";
import Toolbar from "./Toolbar";
export default {
  name: "Home",
  components: {
    Toolbar
  },
  data() {
    return {
      canvas: null,
      panelContent: {
        scale: 1,
        x: 0,
        y: 0,
        cursor: "",
        transition: ""
      }
    };
  },
  computed: {
    panelContentStyle() {
      return {
        transform: `translate(${this.panelContent.x}px, ${this.panelContent.y}px) scale(${this.panelContent.scale})`,
        transition: this.panelContent.transition
      };
    },
    panelStyle() {
      return {
        cursor: this.panelContent.cursor + " !important"
      };
    }
  },
  mounted() {
    this.loadimg();

    document.onkeypress = e => {
      if (e.keyCode === 32) {
        this.$refs.panel.onmousedown = this.handleMove;
        this.panelContent.cursor = "grab";

        // 拖动时，禁止绘图
        this.canvas.isDrawingMode = false;
      }
    };
    document.onkeyup = () => {
      this.$refs.panel.onmousedown = null;
      this.panelContent.cursor = "";

      // 恢复绘图状态
      this.canvas.isDrawingMode = this.penStatus;
    };

    this.$refs.drawer.onmousewheel = e => {
      if (e.ctrlKey) {
        this.handleScale(e);
      }
    };
  },
  destroyed() {
    document.onkeypress = null;
    document.onkeyup = null;
  },
  methods: {
    loadimg() {
      let newImg = new Image();
      newImg.src = "/examPaper.jpg";
      newImg.onload = e => {
        this.imageSize = {
          width: e.path[0].width,
          height: e.path[0].height
        };
        this.canvas = new fabric.Canvas("canvas");
        this.canvas.setWidth(this.imageSize.width);
        this.canvas.setHeight(this.imageSize.height);
        this.sizeContain();

        this.canvas.setBackgroundImage(
          "/examPaper.jpg",
          this.canvas.renderAll.bind(this.canvas)
        );
      };
    },
    sizeContain() {
      const panelWidth = this.$refs.panel.clientWidth;
      const panelHeight = this.$refs.panel.clientHeight;
      const { width: imageWidth, height: imageHeight } = this.imageSize;
      const xScale = panelWidth / imageWidth;
      const yScale = panelHeight / imageHeight;
      this.panelContent.scale = xScale < yScale ? xScale : yScale;
    },
    handleMove() {
      this.panelContent.transition = "";
      document.onmousemove = e => {
        this.canvas.selection = false;
        this.panelContent.x += e.movementX;
        this.panelContent.y += e.movementY;
      };
      document.onmouseup = () => {
        document.onmousemove = null;
        document.onmouseup = null;
        this.canvas.selection = true;
      };
    },
    handleScale(e) {
      e.preventDefault && e.preventDefault();

      const STEP = 0.05;
      const MAX_SCALE = 2;
      const MIN_SCALE = 0.01;

      let scale = this.panelContent.scale;

      if (e.type === "dblclick") {
        if (scale + STEP * 4 > MAX_SCALE) {
          return;
        }
        scale += STEP * 4;
      } else {
        if (e.wheelDelta > 0) {
          if (scale + STEP > MAX_SCALE) {
            return;
          }
          scale += STEP;
        } else {
          if (scale - STEP < MIN_SCALE) {
            return;
          }
          scale -= STEP;
        }
      }
      scale = Number(Number(scale).toFixed(2));

      // 以鼠标为中心缩放
      if (e.clientX && e.clientY) {
        let {
          width,
          height,
          left,
          top
        } = this.$refs.panelContent.getBoundingClientRect();
        let x = e.clientX - left - width / 2;
        let y = height / 2 - (e.clientY - top);
        this.panelContent.x -=
          (x / this.panelContent.scale) * (scale - this.panelContent.scale);
        this.panelContent.y +=
          (y / this.panelContent.scale) * (scale - this.panelContent.scale);
      }

      this.panelContent.transition = "all 0.2s";
      this.panelContent.scale = scale;
    }
  }
};
</script>

<style lang="scss" scoped>
.home {
  width: 100%;
  height: 100%;
  overflow: hidden;
  .toolbar-wrap {
    bottom: 80px;
    width: 100%;
    position: fixed;
    display: flex;
    justify-content: center;
    z-index: 1;
  }
  .panel {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    .content {
      position: relative;
      transform-origin: center;
      .canvas-main {
        position: absolute;
        top: 0;
        left: 0;
      }
    }
  }
}
</style>

<style lang="scss">
.panel {
  .canvas-container {
    .canvas-main {
      cursor: inherit !important;
    }
  }
}
</style>
