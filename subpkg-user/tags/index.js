Page({
  data: {
    currentStep: "my",
    myTags: [],
    expectedTags: [],
    myTagMap: {},
    expectedTagMap: {},
    myTagOptions: [
      "学习", "考研", "刷题", "论文", "小组讨论",
      "运动", "跑步", "篮球", "羽毛球", "健身",
      "游戏", "手游", "主机", "桌游",
      "图书馆", "自习室", "操场", "体育馆", "食堂", "咖啡厅",
      "早晨", "上午", "下午", "晚上", "周末",
      "认真负责", "开朗外向", "安静内敛", "幽默风趣", "细心耐心"
    ],
    expectedTagOptions: [
      "学习", "考研", "刷题", "运动", "跑步", "篮球", "羽毛球",
      "游戏", "电影", "音乐", "美食", "旅行",
      "认真负责", "开朗外向", "安静内敛", "幽默风趣", "守时靠谱",
      "AA制", "男生", "女生", "不限", "同校", "附近学校"
    ]
  },

  toggleMyTag(e) {
    const tag = e.currentTarget.dataset.tag;
    const current = this.data.myTags.slice();
    const index = current.indexOf(tag);
    if (index >= 0) {
      current.splice(index, 1);
    } else {
      current.push(tag);
    }
    const map = {};
    current.forEach((item) => {
      map[item] = true;
    });
    this.setData({
      myTags: current,
      myTagMap: map
    });
  },

  toggleExpectedTag(e) {
    const tag = e.currentTarget.dataset.tag;
    const current = this.data.expectedTags.slice();
    const index = current.indexOf(tag);
    if (index >= 0) {
      current.splice(index, 1);
    } else {
      current.push(tag);
    }
    const map = {};
    current.forEach((item) => {
      map[item] = true;
    });
    this.setData({
      expectedTags: current,
      expectedTagMap: map
    });
  },

  goNext() {
    if (this.data.myTags.length < 3) {
      wx.showToast({
        title: "至少选择 3 个标签",
        icon: "none"
      });
      return;
    }
    this.setData({
      currentStep: "expected"
    });
  },

  finishSetup() {
    // 更新全局标签完成状态
    const app = getApp();
    app.globalData.hasCompletedTags = true;

    wx.showToast({
      title: "设置完成",
      icon: "success",
      duration: 1500
    });

    // 延迟返回个人资料页
    setTimeout(() => {
      wx.switchTab({
        url: "/pages/profile/index",
        success: () => {
          console.log("[Tags] 成功返回个人资料页");
        },
        fail: (err) => {
          console.error("[Tags] 返回个人资料页失败:", err);
          // 降级到首页
          wx.switchTab({ url: "/pages/home/index" });
        }
      });
    }, 1500);
  }

});