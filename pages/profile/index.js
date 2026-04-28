const app = getApp();

// 手机号正则
const PHONE_REGEX = /^1[3-9]\d{9}$/;

Page({
  data: {
    // 认证状态
    isAuthenticated: false,

    // 登录/注册模式
    authMode: 'login', // 'login' | 'register'

    // 登录表单
    loginPhone: '',
    loginCode: '',

    // 注册表单
    regPhone: '',
    regCode: '',
    regNickname: '',

    // 表单有效性
    isLoginValid: false,
    isRegValid: false,

    // 验证码倒计时
    countdown: 0,
    countdownTimer: null,

    // 用户协议同意状态
    agreed: true,

    // 用户信息
    userProfile: {
      name: '我的昵称',
      avatarEmoji: '🧑‍💻',
      school: '浙江工业大学',
      grade: '大二',
      reliabilityScore: 4.7,
      completedActivities: 12,
      activePartners: 5,
      currentPoints: 1250,
      isVIP: false,
      isVerified: true,
      isRealNameAuth: false
    },
    emergencyContact: '',

    menuItems: [
      { label: '我的资料', icon: '👤', path: '' },
      { label: '我的搭子', icon: '🤝', path: '' },
      { label: '我的收藏', icon: '⭐', path: '/subpkg-user/my-favorites/index' },
      { label: '我创建的活动', icon: '📅', path: '' }
    ]
  },

  onLoad() {
    // 页面加载时同步全局登录状态
    this.setData({
      isAuthenticated: app.globalData.isAuthenticated || false
    });
  },

  onShow() {
    // 更新 TabBar 状态
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 3 });
    }
    // 同步登录状态
    this.setData({
      isAuthenticated: app.globalData.isAuthenticated || false
    });
  },

  onUnload() {
    // 清理倒计时定时器
    if (this.data.countdownTimer) {
      clearInterval(this.data.countdownTimer);
    }
  },

  /* ================================
     登录/注册模式切换
     ================================ */
  switchAuthMode(e) {
    const mode = e.currentTarget.dataset.mode;
    if (mode === this.data.authMode) return;

    this.setData({
      authMode: mode,
      // 清空表单
      loginPhone: '',
      loginCode: '',
      regPhone: '',
      regCode: '',
      regNickname: '',
      isLoginValid: false,
      isRegValid: false
    });
  },

  /* ================================
     登录表单输入处理
     ================================ */
  onLoginPhoneInput(e) {
    const value = e.detail.value;
    this.setData({
      loginPhone: value,
      isLoginValid: PHONE_REGEX.test(value) && this.data.loginCode.length === 6
    });
  },

  onLoginCodeInput(e) {
    const value = e.detail.value;
    this.setData({
      loginCode: value,
      isLoginValid: PHONE_REGEX.test(this.data.loginPhone) && value.length === 6
    });
  },

  /* ================================
     注册表单输入处理
     ================================ */
  onRegPhoneInput(e) {
    const value = e.detail.value;
    this.setData({
      regPhone: value,
      isRegValid: PHONE_REGEX.test(value) && this.data.regCode.length === 6 && this.data.regNickname.trim().length >= 2
    });
  },

  onRegCodeInput(e) {
    const value = e.detail.value;
    this.setData({
      regCode: value,
      isRegValid: PHONE_REGEX.test(this.data.regPhone) && value.length === 6 && this.data.regNickname.trim().length >= 2
    });
  },

  onRegNicknameInput(e) {
    const value = e.detail.value;
    this.setData({
      regNickname: value,
      isRegValid: PHONE_REGEX.test(this.data.regPhone) && this.data.regCode.length === 6 && value.trim().length >= 2
    });
  },

  /* ================================
     验证码发送
     ================================ */
  sendLoginCode() {
    this._sendCode(this.data.loginPhone, 'loginPhone');
  },

  sendRegCode() {
    this._sendCode(this.data.regPhone, 'regPhone');
  },

  _sendCode(phone, fieldName) {
    if (this.data.countdown > 0) return;

    if (!PHONE_REGEX.test(phone)) {
      wx.showToast({ title: '请输入正确的手机号', icon: 'none' });
      return;
    }

    // 模拟发送验证码
    wx.showLoading({ title: '发送中...', mask: true });

    setTimeout(() => {
      wx.hideLoading();
      wx.showToast({ title: '验证码已发送', icon: 'success' });

      // 开始倒计时
      this.setData({ countdown: 60 });
      const timer = setInterval(() => {
        const next = this.data.countdown - 1;
        if (next <= 0) {
          clearInterval(timer);
          this.setData({ countdown: 0, countdownTimer: null });
        } else {
          this.setData({ countdown: next });
        }
      }, 1000);
      this.setData({ countdownTimer: timer });
    }, 800);
  },

  /* ================================
     用户协议
     ================================ */
  toggleAgreement() {
    this.setData({ agreed: !this.data.agreed });
  },

  openUserAgreement() {
    wx.showModal({
      title: '用户协议',
      content: '这里是用户协议内容...',
      showCancel: false
    });
  },

  openPrivacyPolicy() {
    wx.showModal({
      title: '隐私政策',
      content: '这里是隐私政策内容...',
      showCancel: false
    });
  },

  /* ================================
     登录处理
     ================================ */
  handleLogin() {
    if (!this.data.isLoginValid) return;
    if (!this.data.agreed) {
      wx.showToast({ title: '请先同意用户协议', icon: 'none' });
      return;
    }

    wx.showLoading({ title: '登录中...', mask: true });

    // 模拟登录请求
    setTimeout(() => {
      wx.hideLoading();

      // 更新全局状态
      app.globalData.isAuthenticated = true;

      // 更新页面状态
      this.setData({
        isAuthenticated: true,
        'userProfile.name': this._maskPhone(this.data.loginPhone)
      }, () => {
        wx.showToast({ title: '登录成功', icon: 'success' });

        // 延迟跳转到认证页面
        setTimeout(() => {
          this._navigateToVerification();
        }, 600);
      });
    }, 1200);
  },

  /* ================================
     注册处理
     ================================ */
  handleRegister() {
    if (!this.data.isRegValid) return;
    if (!this.data.agreed) {
      wx.showToast({ title: '请先同意用户协议', icon: 'none' });
      return;
    }

    wx.showLoading({ title: '注册中...', mask: true });

    // 模拟注册请求
    setTimeout(() => {
      wx.hideLoading();

      // 更新全局状态
      app.globalData.isAuthenticated = true;

      // 更新页面状态
      this.setData({
        isAuthenticated: true,
        'userProfile.name': this.data.regNickname || this._maskPhone(this.data.regPhone)
      }, () => {
        wx.showToast({ title: '注册成功', icon: 'success' });

        // 延迟跳转到认证页面
        setTimeout(() => {
          this._navigateToVerification();
        }, 600);
      });
    }, 1500);
  },

  /* ================================
     微信一键登录
     ================================ */
  handleWechatLogin() {
    if (!this.data.agreed) {
      wx.showToast({ title: '请先同意用户协议', icon: 'none' });
      return;
    }

    wx.showLoading({ title: '微信登录中...', mask: true });

    wx.login({
      success: (res) => {
        if (res.code) {
          // 模拟获取用户信息并登录
          setTimeout(() => {
            wx.hideLoading();

            app.globalData.isAuthenticated = true;

            this.setData({
              isAuthenticated: true,
              'userProfile.name': '微信用户',
              'userProfile.avatarEmoji': '💬'
            }, () => {
              wx.showToast({ title: '登录成功', icon: 'success' });

              setTimeout(() => {
                this._navigateToVerification();
              }, 600);
            });
          }, 1000);
        } else {
          wx.hideLoading();
          wx.showToast({ title: '登录失败，请重试', icon: 'none' });
        }
      },
      fail: () => {
        wx.hideLoading();
        wx.showToast({ title: '登录失败，请重试', icon: 'none' });
      }
    });
  },

  /* ================================
     页面跳转：登录/注册 -> 认证
     ================================ */
  _navigateToVerification() {
    wx.navigateTo({
      url: '/subpkg-user/verification/index',
      success: () => {
        console.log('[Profile] 成功跳转到认证页面');
      },
      fail: (err) => {
        console.error('[Profile] 跳转认证页面失败:', err);
        wx.showToast({ title: '页面跳转失败', icon: 'none' });
      }
    });
  },

  /* ================================
     手机号脱敏
     ================================ */
  _maskPhone(phone) {
    if (!phone || phone.length !== 11) return '用户';
    return phone.substring(0, 3) + '****' + phone.substring(7);
  },

  /* ================================
     已登录状态功能
     ================================ */

  /* 编辑个人资料 */
  onEditProfile() {
    wx.showToast({ title: '编辑资料开发中', icon: 'none' });
  },

  /* 跳转积分商城 */
  toPointsMall() {
    wx.navigateTo({ url: '/subpkg-user/points-mall/index' });
  },

  /* VIP 升级 */
  toVIP() {
    wx.navigateTo({ url: '/subpkg-user/vip/index' });
  },

  /* 菜单点击 */
  onMenuTap(e) {
    const path = e.currentTarget.dataset.path;
    if (path) {
      wx.navigateTo({ url: path });
    } else {
      wx.showToast({ title: '该功能迁移中', icon: 'none' });
    }
  },

  /* 实名认证 */
  onAuthVerify() {
    if (this.data.userProfile.isRealNameAuth) {
      wx.showToast({ title: '已完成实名认证', icon: 'success' });
      return;
    }
    wx.showModal({
      title: '实名认证',
      content: '实名认证后可获得更多推荐机会，是否前往认证？',
      confirmText: '去认证',
      success: (res) => {
        if (res.confirm) {
          wx.navigateTo({ url: '/subpkg-user/verification/index' });
        }
      }
    });
  },

  /* 紧急联系人设置 */
  onEmergencyContact() {
    wx.showModal({
      title: '紧急联系人设置',
      editable: true,
      placeholderText: '请输入紧急联系人电话',
      success: (res) => {
        if (res.confirm && res.content.trim()) {
          const phone = res.content.trim();
          this.setData({
            emergencyContact: phone + (this.data.userProfile.name ? `（${this.data.userProfile.name}的联系人）` : '')
          });
          wx.showToast({ title: '保存成功', icon: 'success' });
        }
      }
    });
  },

  /* 退出登录 */
  handleLogout() {
    wx.showModal({
      title: '确认退出',
      content: '退出后需要重新登录才能使用完整功能',
      confirmText: '确认退出',
      confirmColor: '#EF4444',
      success: (res) => {
        if (res.confirm) {
          // 清理全局状态
          app.globalData.isAuthenticated = false;

          // 清理页面状态
          this.setData({
            isAuthenticated: false,
            authMode: 'login',
            loginPhone: '',
            loginCode: '',
            regPhone: '',
            regCode: '',
            regNickname: '',
            isLoginValid: false,
            isRegValid: false,
            userProfile: {
              name: '我的昵称',
              avatarEmoji: '🧑‍💻',
              school: '浙江工业大学',
              grade: '大二',
              reliabilityScore: 4.7,
              completedActivities: 12,
              activePartners: 5,
              currentPoints: 1250,
              isVIP: false,
              isVerified: true,
              isRealNameAuth: false
            }
          });

          wx.showToast({ title: '已退出登录', icon: 'success' });
        }
      }
    });
  }
});
