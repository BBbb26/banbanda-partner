Page({
  data: {
    content: "",
    selectedLocation: "",
    showLocationPicker: false,
    images: [],
    nearbyMerchants: [
      { id: 1, name: "星巴克咖啡 - 清华园店", category: "咖啡厅", distance: "200m" },
      { id: 2, name: "海底捞火锅 - 中关村店", category: "火锅", distance: "500m" },
      { id: 3, name: "清华大学图书馆", category: "学习", distance: "100m" },
      { id: 4, name: "浙工大体育馆", category: "运动", distance: "300m" }
    ]
  },
  onContentInput(e) {
    this.setData({ content: e.detail.value });
  },
  chooseImages() {
    const remain = 9 - this.data.images.length;
    if (remain <= 0) return;
    wx.chooseImage({
      count: remain,
      sizeType: ["compressed"],
      sourceType: ["album", "camera"],
      success: (res) => {
        this.setData({
          images: this.data.images.concat(res.tempFilePaths)
        });
      }
    });
  },
  removeImage(e) {
    const index = Number(e.currentTarget.dataset.index);
    const images = this.data.images.slice();
    images.splice(index, 1);
    this.setData({ images });
  },
  toggleLocationPicker() {
    this.setData({
      showLocationPicker: !this.data.showLocationPicker
    });
  },
  selectLocation(e) {
    this.setData({
      selectedLocation: e.currentTarget.dataset.name,
      showLocationPicker: false
    });
  },
  clearLocation() {
    this.setData({ selectedLocation: "" });
  },
  publishPost() {
    if (!this.data.content.trim()) {
      wx.showToast({
        title: "请先输入内容",
        icon: "none"
      });
      return;
    }
    wx.showToast({
      title: "发布成功",
      icon: "success"
    });
    setTimeout(() => {
      wx.switchTab({
        url: "/pages/campus-feed/index"
      });
    }, 500);
  },
  onBack() {
    wx.navigateBack();
  }
});
