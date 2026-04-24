Page({
  data: {
    selectedPlan: "quarterly",
    planPriceLine: "¥19.9/季",
    plans: [
      { key: "monthly", label: "月付", price: "9.9", unit: "/月", save: "", popular: false },
      { key: "quarterly", label: "季付", price: "19.9", unit: "/季", save: "省¥10", popular: true },
      { key: "yearly", label: "年付", price: "69.9", unit: "/年", save: "省¥49", popular: false }
    ],
    features: [
      { emoji: "🎯", title: "无限匹配", desc: "每日匹配无上限，自由探索更多搭子", bg: "#E8EEFF" },
      { emoji: "🚫", title: "无广告模式", desc: "浏览体验更纯净，专注找到对的人", bg: "#F0FFF4" },
      { emoji: "⭐", title: "双倍积分", desc: "所有活动获得 2x 积分奖励", bg: "#FFFBEB" },
      { emoji: "👑", title: "VIP 专属标识", desc: "皇冠标识提升吸引力和可信度", bg: "#F5F0FF" },
      { emoji: "🎨", title: "聊天气泡皮肤", desc: "免费使用全部主题聊天气泡", bg: "#FFF0F3" },
      { emoji: "🔒", title: "安全优先", desc: "优先审核，账号安全等级提升", bg: "#E8EEFF" }
    ]
  },
  onLoad() {
    this.syncPlanLine();
  },
  syncPlanLine() {
    const plan = this.data.plans.find((p) => p.key === this.data.selectedPlan);
    if (plan) {
      this.setData({
        planPriceLine: "¥" + plan.price + plan.unit
      });
    }
  },
  selectPlan(e) {
    const key = e.currentTarget.dataset.key;
    this.setData({ selectedPlan: key }, () => this.syncPlanLine());
  },
  subscribe() {
    const plan = this.data.plans.find((p) => p.key === this.data.selectedPlan);
    wx.showModal({
      title: "开通 VIP",
      content:
        "确认开通「" +
        (plan ? plan.label : "") +
        "」" +
        (plan ? "（" + this.data.planPriceLine + "）" : "") +
        "？（演示环境不会真实扣款）",
      success: (res) => {
        if (res.confirm) {
          wx.showToast({ title: "开通成功", icon: "success" });
        }
      }
    });
  },
  onBack() {
    wx.navigateBack();
  }
});
