const PRODUCTS = [
  { id: 1, name: "对话气泡 - 星空主题", icon: "💬", points: 200, category: "气泡皮肤", stock: "无限" },
  { id: 2, name: "对话气泡 - 樱花主题", icon: "🌸", points: 200, category: "气泡皮肤", stock: "无限" },
  { id: 3, name: "星巴克咖啡券", icon: "☕", points: 500, category: "优惠券", stock: "剩余 50" },
  { id: 4, name: "海底捞火锅券", icon: "🍲", points: 800, category: "优惠券", stock: "剩余 30" },
  { id: 5, name: "VIP会员 7天体验", icon: "👑", points: 300, category: "会员特权", stock: "无限" },
  { id: 6, name: "电影兑换券", icon: "🎬", points: 600, category: "娱乐", stock: "剩余 20" }
];

Page({
  data: {
    currentPoints: 1250,
    products: PRODUCTS,
    categories: ["全部", "气泡皮肤", "优惠券", "会员特权", "娱乐"],
    selectedCategory: "全部",
    filteredList: PRODUCTS,
    earnTips: [
      { emoji: "💬", title: "完成每日聊天任务", desc: "每日最多 50 积分" },
      { emoji: "🤝", title: "参与线下活动", desc: "每次活动 100 积分" },
      { emoji: "👥", title: "邀请好友注册", desc: "每位好友 200 积分" }
    ]
  },
  onLoad() {
    this.applyFilter();
  },
  onCategoryTap(e) {
    const cat = e.currentTarget.dataset.cat;
    this.setData({ selectedCategory: cat }, () => this.applyFilter());
  },
  applyFilter() {
    const cat = this.data.selectedCategory;
    const list =
      cat === "全部" ? PRODUCTS : PRODUCTS.filter((p) => p.category === cat);
    this.setData({ filteredList: list });
  },
  onExchange(e) {
    const points = Number(e.currentTarget.dataset.points);
    if (this.data.currentPoints < points) {
      wx.showToast({ title: "积分不足", icon: "none" });
      return;
    }
    wx.showModal({
      title: "确认兑换",
      content: "将消耗 " + points + " 积分",
      success: (res) => {
        if (res.confirm) {
          this.setData({
            currentPoints: this.data.currentPoints - points
          });
          wx.showToast({ title: "兑换成功", icon: "success" });
        }
      }
    });
  },
  onBack() {
    wx.navigateBack();
  }
});
