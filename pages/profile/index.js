Page({
  data: {
    userProfile: {
      name: "我的昵称",
      avatarEmoji: "🧑‍💻",
      school: "浙江工业大学",
      grade: "大二",
      reliabilityScore: 4.7,
      completedActivities: 12,
      activePartners: 5,
      currentPoints: 1250,
      isVIP: false,
      isVerified: true,       /* 是否已认证 */
      isRealNameAuth: false   /* 是否已实名认证 */
    },
    emergencyContact: "",     /* 紧急联系人信息 */

    menuItems: [
      { label: "我的资料", icon: "👤", path: "" },
      { label: "我的搭子", icon: "🤝", path: "" },
      { label: "我的收藏", icon: "⭐", path: "/subpkg-user/my-favorites/index" },
      { label: "我创建的活动", icon: "📅", path: "" }
    ]
  },

  onShow() {
    if (typeof this.getTabBar === "function" && this.getTabBar()) {
      this.getTabBar().setData({ selected: 3 });
    }
  },

  /* 编辑个人资料 */
  onEditProfile() {
    wx.showToast({ title: "编辑资料开发中", icon: "none" });
  },

  /* 跳转积分商城 */
  toPointsMall() {
    wx.navigateTo({ url: "/subpkg-user/points-mall/index" });
  },

  /* VIP 升级 */
  toVIP() {
    wx.navigateTo({ url: "/subpkg-user/vip/index" });
  },

  /* 菜单点击 */
  onMenuTap(e) {
    const path = e.currentTarget.dataset.path;
    if (path) {
      wx.navigateTo({ url: path });
    } else {
      wx.showToast({ title: "该功能迁移中", icon: "none" });
    }
  },

  /* 实名认证 */
  onAuthVerify() {
    if (this.data.userProfile.isRealNameAuth) {
      wx.showToast({ title: "已完成实名认证", icon: "success" });
      return;
    }
    wx.showModal({
      title: "实名认证",
      content: "实名认证后可获得更多推荐机会，是否前往认证？",
      confirmText: "去认证",
      success: (res) => {
        if (res.confirm) {
          wx.showToast({ title: "跳转至认证页面...", icon: "loading" });
        }
      }
    });
  },

  /* 紧急联系人设置 */
  onEmergencyContact() {
    wx.showModal({
      title: "紧急联系人设置",
      editable: true,
      placeholderText: "请输入紧急联系人电话",
      success: (res) => {
        if (res.confirm && res.content.trim()) {
          const phone = res.content.trim();
          this.setData({
            emergencyContact: phone + (this.data.userProfile.name ? `（${this.data.userProfile.name}的联系人）` : "")
          });
          wx.showToast({ title: "保存成功", icon: "success" });
        }
      }
    });
  }
});
