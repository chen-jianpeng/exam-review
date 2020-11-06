<template>
  <popover v-model="penStatus">
    <switch-btn
      slot="action"
      v-model="penStatus"
      @change="handlePenStatusChange"
      icon="fa-pencil"
      @click.native="handleDrawing"
    />
    <div class="pencil-toolbar">
      <div
        v-for="(item, index) in penWidths"
        :key="item"
        class="item"
        :class="{ active: item === penWidth }"
        @click="changPenWidth(item)"
      >
        <div
          class="circle"
          :style="{
            width: 10 + index * 5 + 'px',
            height: 10 + index * 5 + 'px'
          }"
        ></div>
      </div>
    </div>
  </popover>
</template>
<script>
import { fabric } from "fabric";
import Popover from "@/components/Popover";
import SwitchBtn from "@/components/SwitchBtn";
export default {
  name: "Pencil",
  components: {
    Popover,
    SwitchBtn
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    canvas: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      penStatus: this.value,
      penWidth: 2,
      penWidths: [2, 4, 6]
    };
  },
  watch: {
    value: {
      handler(val) {
        this.penStatus = val;
        this.canvas.isDrawingMode = this.penStatus;
      }
    }
  },
  mounted() {
    // 初始化画笔
    this.canvas.freeDrawingBrush = new fabric.PencilBrush(this.canvas);
    this.canvas.freeDrawingBrush.color = "red";
    this.canvas.freeDrawingBrush.width = this.penWidth;
  },
  methods: {
    handleDrawing() {
      this.$emit("input", this.penStatus);
      this.$emit("change", this.penStatus);
    },
    changPenWidth(width) {
      this.penWidth = width;
      this.canvas.freeDrawingBrush.width = width;
    },
    handlePenStatusChange(status) {
      this.$emit("change", status);
    }
  }
};
</script>
<style lang="scss" scoped>
.pencil-toolbar {
  display: flex;
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
    &.active {
      background-color: #ddd;
      &:hover {
        background-color: #ccc;
      }
    }
  }
  .circle {
    display: inline-block;
    border-radius: 50%;
    background-color: #999;
    vertical-align: top;
  }
}
</style>
