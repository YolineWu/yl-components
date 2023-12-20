import { Component, Model, Prop, Vue } from "vue-property-decorator";
import starGold from "../../static/images/svg/star-gold.svg";
import starGrey from "../../static/images/svg/star-grey.svg";

@Component
export default class hhRating extends Vue {
  /** 当前选择了多少颗星 */
  @Model("input", { type: Number }) value!: number | undefined;
  /** 一共多少颗星，默认5颗 */
  @Prop({ type: Number, default: 5 }) count!: number | undefined;
  /** 未选中时的图标 `url` */
  @Prop({ default: starGrey })
  readonly inactiveIcon!: any;
  /** 选中时的图标 `url` */
  @Prop({ default: starGold })
  readonly activeIcon!: any;

  /** 获取当前选择了多少颗星 */
  get current(): number {
    return this.value || 0;
  }
  /** 设置当前选择了多少颗星 */
  set current(value: number) {
    this.$emit("input", value || 0);
  }

  /** 评分图标数组 */
  get ratingIcons(): any[] {
    if (!this.count) return [];
    const icons = [];
    for (let i = 0; i < this.count; i++) {
      icons.push(i < this.current ? this.activeIcon : this.inactiveIcon);
    }
    return icons;
  }

  /** 点击星星时调用 */
  clickStar(index: number) {
    this.current = index + 1;
  }
}
