<template>
  <div class="toolbar">
    <div
      v-for="item in 5"
      :key="item"
      class="item"
      title="拖动分数到答题卡上"
      @mousedown="e => handleAddScore(e, item)"
    >
      +{{ item }}
    </div>
    <div class="item" @click="handleZoom('zoom-in')">
      <i class="fa fa-search-plus"></i>
    </div>
    <div class="item" @click="handleZoom('zoom-out')">
      <i class="fa fa-search-minus"></i>
    </div>
    <pencil v-model="pencilStatus" :canvas="canvas"></pencil>
    <switch-btn
      v-model="removeStatus"
      @change="handleRemove"
      icon="fa-eraser"
    />
    <div class="item" @click="clear"><i class="fa fa-trash-o"></i></div>
  </div>
</template>
<script>
import { fabric } from "fabric";
import SwitchBtn from "@/components/SwitchBtn";
import Pencil from "@/components/Pencil";
export default {
  name: "Toolbar",
  components: {
    SwitchBtn,
    Pencil
  },
  props: {
    canvas: {
      type: Object,
      default: () => ({})
    },
    panelContent: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      toolbarStatus: []
    };
  },
  computed: {
    pencilStatus: {
      get() {
        return this.toolbarStatus.includes("pencil");
      },
      set(status) {
        if (status) {
          this.toolbarStatus = ["pencil"];
        } else {
          let index = this.toolbarStatus.indexOf("pencil");
          if (index >= 0) this.toolbarStatus.splice(index, 1);
        }
      }
    },
    removeStatus: {
      get() {
        return this.toolbarStatus.includes("remove");
      },
      set(status) {
        if (status) {
          this.toolbarStatus = ["remove"];
        } else {
          let index = this.toolbarStatus.indexOf("remove");
          if (index >= 0) this.toolbarStatus.splice(index, 1);
        }
      }
    }
  },
  mounted() {
    this.canvas.on("selection:created", e => {
      if (!this.toolbarStatus.includes("remove")) return;

      if (e.target._objects) {
        //多选删除
        var etCount = e.target._objects.length;
        for (var etindex = 0; etindex < etCount; etindex++) {
          this.canvas.remove(e.target._objects[etindex]);
        }
      } else {
        //单选删除
        this.canvas.remove(e.target);
      }
      this.canvas.discardActiveObject(); //清楚选中框
    });
  },
  methods: {
    handleAddScore(e, score) {
      const scoreTempWidth = 100;
      const scoreTempHeight = 100;

      // 创建所鼠标拖动的临时分数
      let scoreTempWrap = document.createElement("div");
      scoreTempWrap.setAttribute("class", "score-temp-wrap");
      scoreTempWrap.setAttribute(
        "style",
        "position: fixed;transform-origin: left top;z-index: 2;"
      );
      let scoreCanvas = document.createElement("canvas");
      scoreCanvas.id = "scoreCanvas";
      scoreTempWrap.appendChild(scoreCanvas);
      document.body.appendChild(scoreTempWrap);

      this.$nextTick(() => {
        this.testAppend = new fabric.Canvas("scoreCanvas", {
          selection: false
        });
        this.testAppend.setWidth(scoreTempWidth);
        this.testAppend.setHeight(scoreTempHeight);
        const test = new fabric.Text("+" + score, {
          selectable: false,
          hoverCursor: "initial",
          originX: "center",
          originY: "center",
          left: 50,
          top: 50,
          fontSize: 36,
          fill: "red"
        });
        this.testAppend.add(test);

        scoreTempWrap.style.left =
          e.x - (scoreTempWidth * this.panelContent.scale) / 2 + "px";
        scoreTempWrap.style.top =
          e.y - (scoreTempHeight * this.panelContent.scale) / 2 + "px";
        scoreTempWrap.style.transform = `scale(${this.panelContent.scale})`;
      });

      document.onmousemove = e => {
        scoreTempWrap.style.left =
          e.x - (scoreTempWidth * this.panelContent.scale) / 2 + "px";
        scoreTempWrap.style.top =
          e.y - (scoreTempHeight * this.panelContent.scale) / 2 + "px";
      };
      document.onmouseup = e => {
        this.handleDragScore(e, score);
        document.body.removeChild(scoreTempWrap);
        document.onmousemove = null;
        document.onmouseup = null;
      };
    },
    handleDragScore(e, score) {
      this.toolbarStatus = [];

      const canvasPosition = document
        .querySelector("#canvas")
        .getBoundingClientRect();
      const text = new fabric.Text("+" + score, {
        originX: "center",
        originY: "center",
        left: (e.x - canvasPosition.x) / this.panelContent.scale,
        top: (e.y - canvasPosition.y) / this.panelContent.scale,
        fontSize: 36,
        fill: "red"
      });
      this.canvas.add(text);
    },

    clear() {
      // this.canvas.clear(); // 会把背景图也删掉
      this.canvas.getObjects().forEach(item => {
        this.canvas.remove(item);
      });
    },
    handleRemove(status) {
      if (status) {
        this.canvas.discardActiveObject();
      }
    },

    handleZoom(type) {
      if (type === "zoom-in") {
        this.$parent.handleScale({ wheelDelta: 1 });
      }
      if (type === "zoom-out") {
        this.$parent.handleScale({ wheelDelta: -1 });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.toolbar {
  padding: 0 20px;
  display: flex;
  border-radius: 20px;
  box-shadow: 0 1px 2px 0 rgba(32, 33, 36, 0.28);
  background: #fff;
  .item {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 40px;
    height: 40px;
    cursor: pointer;
    user-select: none;
    &:hover {
      background-color: #eee;
    }
  }
}
</style>
