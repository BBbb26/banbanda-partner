Component({
  data: {
    selected: 0,
    animIndex: -1,
    color: "#8A7B6A",
    selectedColor: "#FF6F61",
    list: [
      {
        pagePath: "/pages/home/index",
        text: "首页",
        icon: "https://zhaodazi-1424531488.cos.ap-shanghai.myqcloud.com/tab-home.png",
        activeIcon: "https://zhaodazi-1424531488.cos.ap-shanghai.myqcloud.com/tab-home.png"
      },
      {
        pagePath: "/pages/campus-feed/index",
        text: "校园圈",
        icon: "https://zhaodazi-1424531488.cos.ap-shanghai.myqcloud.com/tab-campus.png",
        activeIcon: "https://zhaodazi-1424531488.cos.ap-shanghai.myqcloud.com/tab-campus.png"
      },
      {
        pagePath: "/pages/messages/index",
        text: "消息",
        icon: "https://zhaodazi-1424531488.cos.ap-shanghai.myqcloud.com/tab-messages.png",
        activeIcon: "https://zhaodazi-1424531488.cos.ap-shanghai.myqcloud.com/tab-messages.png"
      },
      {
        pagePath: "/pages/profile/index",
        text: "我的",
        icon: "https://zhaodazi-1424531488.cos.ap-shanghai.myqcloud.com/tab-profile.png",
        activeIcon: "https://zhaodazi-1424531488.cos.ap-shanghai.myqcloud.com/tab-profile.png"
      }
    ]
  },

  methods: {
    switchTab(e) {
      const index = Number(e.currentTarget.dataset.index);

      // 触发弹跳动画
      this.setData({ animIndex: index });

      // 动画结束后清除（400ms 与 CSS keyframe 时长一致）
      if (this._animTimer) clearTimeout(this._animTimer);
      this._animTimer = setTimeout(() => {
        this.setData({ animIndex: -1 });
      }, 420);

      // 切换页面
      if (this.data.selected !== index) {
        this.setData({ selected: index });
        wx.switchTab({ url: this.data.list[index].pagePath });
      } else {
        // 已在当前页也触发刷新效果
        wx.switchTab({ url: this.data.list[index].pagePath });
      }
    }
  }
});
