Page({
  data: {
    title: "校园身份认证",
    verificationMethod: "",
    school: "",
    studentId: "",
    uploadedFile: "",
    isFormValid: false,
    schools: [
      "清华大学", "北京大学", "浙江工业大学", "复旦大学",
      "上海交通大学", "浙江大学", "南京大学", "武汉大学",
      "中山大学", "四川大学", "华中科技大学", "同济大学"
    ]
  },

  _updateFormValid: function () {
    var valid = false;
    if (this.data.verificationMethod === "student-card" && !!this.data.uploadedFile) {
      valid = true;
    }
    if (this.data.verificationMethod === "student-id" && !!this.data.school && !!this.data.studentId) {
      valid = true;
    }
    this.setData({ isFormValid: valid });
  },

  selectMethod: function (e) {
    this.setData({
      verificationMethod: e.currentTarget.dataset.method
    }, function () {
      this._updateFormValid();
    });
  },

  resetMethod: function () {
    this.setData({
      verificationMethod: "",
      school: "",
      studentId: "",
      uploadedFile: "",
      isFormValid: false
    });
  },

  onSchoolChange: function (e) {
    var index = Number(e.detail.value || 0);
    this.setData({
      school: this.data.schools[index]
    }, function () {
      this._updateFormValid();
    });
  },

  onStudentIdInput: function (e) {
    this.setData({
      studentId: e.detail.value
    }, function () {
      this._updateFormValid();
    });
  },

  chooseFile: function () {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ["compressed"],
      sourceType: ["album", "camera"],
      success: function (res) {
        var filePath = res.tempFilePaths[0] || "";
        var fileName = filePath.split("/").pop() || "已选择图片";
        that.setData({
          uploadedFile: fileName
        }, function () {
          that._updateFormValid();
        });
      }
    });
  },

  handleVerify: function () {
    if (!this.data.isFormValid) {
      wx.showToast({
        title: "请先补全认证信息",
        icon: "none"
      });
      return;
    }

    var app = getApp();
    app.globalData.hasCompletedVerification = true;

    wx.showModal({
      title: "认证提交成功",
      content: "是否立即设置兴趣标签？",
      confirmText: "去设置",
      cancelText: "稍后再说",
      success: function (res) {
        if (res.confirm) {
          wx.redirectTo({
            url: "/subpkg-user/tags/index"
          });
        } else {
          wx.navigateBack({
            success: function () {
              wx.showToast({ title: "认证完成", icon: "success" });
            }
          });
        }
      }
    });
  },

  handleSkip: function () {
    wx.redirectTo({
      url: "/subpkg-user/tags/index"
    });
  }
});
