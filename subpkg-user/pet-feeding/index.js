Page({
  data: {
    petLevel: 3,
    currentPoints: 350,
    nextLevelPoints: 500,
    petEmojis: ["🥚", "🐣", "🐤", "🐱", "😺", "😻"],
    petNames: ["神秘蛋", "小新芽", "搭子幼苗", "搭子小喵", "快乐搭子", "超级搭子"],
    foods: [
      { emoji: "🥛", name: "牛奶", pts: 10, cls: "food-green" },
      { emoji: "🐟", name: "小鱼干", pts: 20, cls: "food-yellow" },
      { emoji: "🍖", name: "肉骨头", pts: 35, cls: "food-red" },
      { emoji: "🎂", name: "生日蛋糕", pts: 50, cls: "food-purple" }
    ],
    tasks: [
      { id: 1, title: "发送 10 条消息", reward: 20, completed: true },
      { id: 2, title: "完成一次线下见面", reward: 50, completed: false },
      { id: 3, title: "连续聊天 3 天", reward: 30, completed: false },
      { id: 4, title: "分享位置信息", reward: 15, completed: true }
    ]
  },
  feedPet(e) {
    const pts = Number(e.currentTarget.dataset.pts);
    const foodIndex = e.currentTarget.dataset.index;
    
    // 添加动画效果
    this.setData({
      [`foods[${foodIndex}].animating`]: true
    });
    
    setTimeout(() => {
      this.setData({
        [`foods[${foodIndex}].animating`]: false
      });
    }, 600);
    
    let next = this.data.currentPoints + pts;
    let level = this.data.petLevel;
    if (next >= this.data.nextLevelPoints) {
      level += 1;
      next = 0;
      wx.showToast({
        title: "升级成功!",
        icon: "success"
      });
    }
    this.setData({
      currentPoints: next,
      petLevel: level
    });
  },
  toPointsMall() {
    wx.navigateTo({
      url: "/subpkg-user/points-mall/index"
    });
  },
  onBack() {
    wx.navigateBack();
  }
});
