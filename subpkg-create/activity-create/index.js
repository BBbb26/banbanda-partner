Page({
  data: {
    activityType: "single",
    scenario: "",
    costSharing: "",
    title: "",
    date: "",
    time: "",
    location: "",
    peopleLimit: "",
    remark: "",
    scenarios: ["学习", "运动", "餐饮", "娱乐", "出行", "其他"],
    costOptions: ["AA制", "我请客", "免费"],
    today: ""
  },

  onLoad() {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    this.setData({ today: `${y}-${m}-${d}` });
  },
  selectType(e) {
    this.setData({
      activityType: e.currentTarget.dataset.type
    });
  },
  selectScenario(e) {
    this.setData({
      scenario: e.currentTarget.dataset.value
    });
  },
  selectCost(e) {
    this.setData({
      costSharing: e.currentTarget.dataset.value
    });
  },
  onInput(e) {
    const key = e.currentTarget.dataset.key;
    this.setData({
      [key]: e.detail.value
    });
  },
  onDateChange(e) {
    this.setData({ date: e.detail.value });
  },
  onTimeChange(e) {
    this.setData({ time: e.detail.value });
  },
  publishActivity() {
    if (!this.data.scenario || !this.data.title || !this.data.date || !this.data.time || !this.data.location) {
      wx.showToast({
        title: "请补全必填项",
        icon: "none"
      });
      return;
    }
    wx.showToast({
      title: "活动已发布",
      icon: "success"
    });
    setTimeout(() => {
      wx.switchTab({
        url: "/pages/home/index"
      });
    }, 500);
  },
  onBack() {
    wx.navigateBack();
  }
});
