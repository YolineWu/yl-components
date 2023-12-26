import { Component, Emit, Model, Prop, Vue } from "vue-property-decorator";
import starGold from "../../static/images/svg/star-gold.svg";
import starGrey from "../../static/images/svg/star-grey.svg";

@Component
export default class hhRating extends Vue {
  /** 当前评分 */
  @Model("input", { type: Number, required: true }) readonly value!: number;
  /** 最高评分（即有多少颗星） */
  @Prop({ type: Number, default: 5 }) readonly count!: number;
  /** 未选中时的图标 `url` */
  @Prop({ default: starGrey })
  readonly inactiveIcon!: string;
  /** 选中时的图标 `url` */
  @Prop({ default: starGold })
  readonly activeIcon!: string;

  /** 获取当前评分 */
  get current(): number {
    return this.value || 0;
  }
  /** 设置获取当前评分 */
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
  @Emit()
  clickStar(rating: number) {
    this.current = rating;
  }
}
