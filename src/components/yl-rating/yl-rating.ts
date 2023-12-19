import { Component, Model, Prop, Vue } from "vue-property-decorator";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

// 添加 awesome star 图标
library.add(faStar);

@Component({ components: { FontAwesomeIcon } })
export default class hhRating extends Vue {
  /** 当前选择了多少颗星 */
  @Model("input", { type: Number }) value!: number;
  /** 一共多少颗星，默认5颗 */
  @Prop({ type: Number, default: 5 }) readonly count!: number;

  /** 获取当前选择了多少颗星 */
  get current(): number {
    return this.value;
  }
  /** 设置当前选择了多少颗星 */
  set current(value: number) {
    this.$emit("input", value);
  }

  /** 点击星星时调用 */
  clickStar(n: number) {
    console.log("-------------clickStar n=", n);
    this.current = n;
  }
}
