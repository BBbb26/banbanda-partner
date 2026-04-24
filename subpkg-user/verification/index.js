Page({
  data: {
    title: "校园身份认证",
    verificationMethod: "",
    school: "",
    studentId: "",
    uploadedFile: "",
    schools: ["清华大学", "北京大学", "浙江工业大学", "复旦大学", "上海交通大学"]
  },
  selectMethod(e) {
    this.setData({
      verificationMethod: e.currentTarget.dataset.method
    });
  },
  resetMethod() {
    this.setData({
      verificationMethod: "",
      school: "",
      studentId: "",
      uploadedFile: ""
    });
  },
  onSchoolChange(e) {
    const index = Number(e.detail.value || 0);
    this.setData({
      school: this.data.schools[index]
    });
  },
  onStudentIdInput(e) {
    this.setData({
      studentId: e.detail.value
    });
  },
  chooseFile() {
    wx.chooseImage({
      count: 1,
      sizeType: ["compressed"],
      sourceType: ["album", "camera"],
      success: (res) => {
        const filePath = res.tempFilePaths[0] || "";
        const fileName = filePath.split("/").pop() || "已选择图片";
        this.setData({
          uploadedFile: fileName
        });
      }
    });
  },
  handleVerify() {
    const readyForCard = this.data.verificationMethod === "student-card" && !!this.data.uploadedFile;
    const readyForId =
      this.data.verificationMethod === "student-id" && !!this.data.school && !!this.data.studentId;
    if (!readyForCard && !readyForId) {
      wx.showToast({
        title: "请先补全认证信息",
        icon: "none"
      });
      return;
    }
    wx.showModal({
      title: "认证提交成功",
      content: "是否立即领取 7 天 VIP 体验？",
      confirmText: "立即领取",
      cancelText: "暂不领取",
      success: () => {
        wx.redirectTo({
          url: "/subpkg-user/tags/index"
        });
      }
    });
  },
  handleSkip() {
    wx.redirectTo({
      url: "/subpkg-user/tags/index"
    });
  }
});
