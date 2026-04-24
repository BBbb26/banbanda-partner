// index.js
Page({
  data: {
    current: 0
  },

  // 监听滑动切换
  handleSwiperChange(e) {
    this.setData({
      current: e.detail.current
    });
  },

  // 第一页的按钮动作：跳转到下一页
  nextSlide() {
    this.setData({
      current: 1 // 手动设置 current 也可以触发滑动，但在小程序swiper中建议使用 current 变量绑定
    });
  },

  // 最后一页的"进入"动作：跳转到标签选择页
  startApp() {
    wx.navigateTo({
      url: '/subpkg-user/tags/index',
    });
  }
})
