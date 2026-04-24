/**
 * 解码 HTML 实体和特殊字符编码
 * 支持：&lt; &gt; &amp; &quot; &#1234; &#xABCD; 等格式
 */
function decodeHtmlEntities(str) {
  if (!str) return str;
  // 创建临时 textarea 利用浏览器/小程序的解码能力
  const entities = {
    '&lt;': '<', '&gt;': '>', '&amp;': '&', '&quot;': '"',
    '&#39;' : "'", '&nbsp;': ' ', '&copy;': '©',
    '&#8857;': '⚠', // 特殊编码
    '&#8250;': '›', '&#8249;': '‹'
  };
  let result = String(str);
  // 替换命名实体
  result = result.replace(/&[a-zA-Z]+;/g, match => entities[match] || match);
  // 替换数字实体 &#NNNN; 或 &#xHHHH;
  result = result.replace(/&#(\d+);/g, (match, code) => {
    try { return String.fromCodePoint(parseInt(code, 10)); } catch (e) { return match; }
  });
  result = result.replace(/&#[xX]([0-9a-fA-F]+);/g, (match, code) => {
    try { return String.fromCodePoint(parseInt(code, 16)); } catch (e) { return match; }
  });
  return result;
}

Page({
  // ===== 滚动相关内部状态 =====
  _scrollTop: 0,           // 当前 scrollTop 值（用于递增滚动）
  _isAtBottom: true,       // 是否处于底部
  _scrollLock: false,      // 滚动锁，防止事件循环
  _lastScrollTop: -1,      // 上一次 scrollTop，用于判断方向
  _keyboardHeight: 0,      // 键盘高度
  _page: 1,                // 当前页码（分页）
  _pageSize: 50,           // 每页条数
  _hasMore: true,          // 是否有更多历史

  data: {
    userId: "",
    showUserInfo: false,
    message: "",
    showQuickMessages: false,
    messageCount: 0,
    showPetTip: false,

    /* ===== 核心滚动数据 ===== */
    scrollTop: 0,              // scroll-view 的 scrollTop 属性值
    scrollAnim: true,           // 是否带动画滚动
    displayMessages: [],       // 实际渲染的消息数组（分页/虚拟）
    messages: [],              // 全量消息（数据源）
    loadingHistory: false,     // 是否正在加载历史
    showScrollDownBtn: false,  // 显示回到最新按钮
    unreadCount: 0,            // 未读数

    myAvatar: { src: "" },
    partnerInfo: {
      name: "李同学",
      avatarEmoji: "📚",
      avatarColor: "#E8EEFF",
      school: "浙江工业大学",
      reliabilityScore: 4.8,
      commonTags: ["学习", "图书馆", "晚上"]
    },
    quickMessageList: [
      { text: "你好👋", emoji: "👋" },
      { text: "一起加油！", emoji: "💪" },
      { text: "什么时候有空？", emoji: "📅" },
      { text: "期待见面！", emoji: "😊" }
    ]
  },

  onLoad(options) {
    const self = this;
    this.setData({ userId: options.userId || "" });

    // 初始化模拟数据
    const initMsgs = [
      { id: 1, sender: "other", text: "你好！看到我们都喜欢晚上去图书馆学习 😊", time: "14:20", showTime: true, dateLabel: "今天 14:20" },
      { id: 2, sender: "me", text: "是的！我一般晚上7点到11点在图书馆", time: "14:22" },
      { id: 3, sender: "other", text: "太好了，我也是这个时间段。要不明晚一起？", time: "14:23" }
    ];
    this.setData({
      messages: initMsgs,
      displayMessages: initMsgs
    }, () => {
      // 首次进入滚到底部
      wx.nextTick(() => self.scrollToBottom(true));
    });

    // 监听键盘高度变化 → 自适应布局
    if (wx.onKeyboardHeightChange) {
      wx.onKeyboardHeightChange((res) => {
        this._keyboardHeight = res.height;
        this._adjustLayoutForKeyboard();
      });
    }

    // input 聚焦时也触发自适应
    if (wx.onInputFocus) {
      wx.onInputFocus(() => {
        setTimeout(() => this.scrollToBottom(false), 100);
      });
    }
  },

  onUnload() {
    // 移除键盘监听
    if (wx.offKeyboardHeightChange) {
      wx.offKeyboardHeightChange();
    }
  },

  // ==================== 滚动核心方法 ====================

  /**
   * 滚动事件监听 —— 追踪用户位置
   */
  onScroll(e) {
    if (this._scrollLock) return;

    const scrollTop = e.detail.scrollTop;
    const scrollHeight = e.detail.scrollHeight;
    // 视口高度估算（scroll-view 内部高度）
    const viewHeight = e.detail.scrollTop + (e.detail.clientHeight || 600);

    // 判断是否接近底部（距离底部 < 80px）
    const distBottom = scrollHeight - viewHeight;
    this._isAtBottom = distBottom < 80;
    this._lastScrollTop = scrollTop;

    // 更新按钮状态和未读计数
    this._updateScrollState();
  },

  /**
   * 滚动到底部事件
   */
  onScrollToLower() {
    this._isAtBottom = true;
    this.setData({ showScrollDownBtn: false, unreadCount: 0 });
  },

  /**
   * 滚动到顶部 → 加载历史消息
   */
  onScrollToUpper() {
    if (this.data.loadingHistory || !this._hasMore) return;
    this.loadMoreHistory();
  },

  /**
   * 滚动到底部（主方法）
   * @param {boolean} anim - 是否带动画，默认 true
   */
  scrollToBottom(anim) {
    if (anim === undefined) anim = true;
    this._scrollTop += 1;         // 递增确保每次都能触发
    this._isAtBottom = true;
    this._scrollLock = true;       // 加锁防止 onScroll 循环
    this.setData({
      scrollTop: this._scrollTop,
      scrollAnim: anim,
      showScrollDownBtn: false,
      unreadCount: 0
    }, () => {
      // 解锁
      setTimeout(() => { this._scrollLock = false; }, 300);
    });
  },

  /**
   * 更新滚动状态（是否显示回底按钮、未读数）
   * @private
   */
  _updateScrollState() {
    if (this._isAtBottom) {
      if (this.data.showScrollDownBtn || this.data.unreadCount > 0) {
        this.setData({ showScrollDownBtn: false, unreadCount: 0 });
      }
    } else {
      this.setData({ showScrollDownBtn: true });
    }
  },

  /**
   * 新消息到达时的滚动策略
   * @private
   */
  _onNewMessageArrived() {
    if (this._isAtBottom) {
      // 在底部 → 自动滚下去
      this.scrollToBottom(true);
    } else {
      // 不在底部 → 累加未读数
      this.setData({
        unreadCount: this.data.unreadCount + 1,
        showScrollDownBtn: true
      });
    }
  },

  // ==================== 历史消息分页加载 ====================

  /**
   * 加载更早的历史消息（从顶部插入，保持位置）
   */
  loadMoreHistory() {
    if (this.data.loadingHistory || !this._hasMore) return;

    this.setData({ loadingHistory: true });

    const self = this;

    // 记录加载前的滚动偏移（用于保持位置）
    const query = wx.createSelectorQuery().in(this);
    query.select('#msg-scroll').boundingClientRect();
    query.select('.msg-list').boundingClientRect();
    query.exec((res) => {
      const scrollView = res[0];
      const listView = res[1];
      // 模拟异步请求
      setTimeout(() => {
        // TODO: 替换为真实 API 请求获取历史
        // 这里模拟无更多历史了
        self._hasMore = false;

        self.setData({ loadingHistory: false }, () => {
          // 保持当前可见内容不跳动：
          // 加载完成后重新计算 scrollTop 补偿新插入的高度差
          wx.nextTick(() => {
            query.select('#msg-scroll').scrollOffset((scrollRes) => {
              // 如果有新增内容，补偿偏移量
              // 实际项目中需要记录旧 scrollHeight 与新 scrollHeight 的差
            }).exec();
          });
        });

        if (!self._hasMore) {
          wx.showToast({ title: '没有更多消息了', icon: 'none' });
        }
      }, 600);
    });
  },

  // ==================== 键盘适配 ====================

  /**
   * 键盘弹起时调整布局
   * @private
   */
  _adjustLayoutForKeyboard() {
    if (this._keyboardHeight <= 0) return;

    // 让消息区域缩小，避免被键盘遮挡
    // 小程序中 scroll-view 会自动处理 adjust-position
    // 此处额外确保滚到底部看到最新消息
    setTimeout(() => this.scrollToBottom(false), 150);
  },

  // ==================== 业务方法（保持原有功能）====================

  toggleUserInfo() {
    this.setData({ showUserInfo: !this.data.showUserInfo });
  },

  toggleQuickMessages() {
    this.setData({ showQuickMessages: !this.data.showQuickMessages });
  },

  onInput(e) {
    this.setData({ message: e.detail.value });
  },

  sendQuickMessage(e) {
    const text = e.currentTarget.dataset.text;
    this.setData({ message: text }, () => this.sendMessage());
    this.setData({ showQuickMessages: false });
  },

  sendMessage() {
    const text = (this.data.message || "").trim();
    if (!text) return;

    const decodedText = decodeHtmlEntities(text);
    const list = this.data.messages.slice();
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    const newId = Date.now();

    const lastMsg = list[list.length - 1];
    let showTime = list.length === 0;
    if (!showTime && lastMsg && lastMsg.time) {
      const parts = lastMsg.time.split(":");
      const lastMin = parseInt(parts[0]) * 60 + parseInt(parts[1]);
      const nowMin = now.getHours() * 60 + now.getMinutes();
      showTime = (nowMin - lastMin) > 5;
    }

    const month = now.getMonth() + 1;
    const day = now.getDate();
    const dateLabel = month + "月" + day + "日 " + hh + ":" + mm;

    const newMsg = {
      id: newId,
      sender: "me",
      text: decodedText,
      time: hh + ":" + mm,
      showTime: showTime,
      dateLabel: dateLabel
    };

    // 性能优化：消息超过阈值时只保留最近 N 条用于渲染
    const MAX_RENDER = 200;
    const updatedAll = [...list, newMsg];
    const displayList = updatedAll.length > MAX_RENDER
      ? updatedAll.slice(-MAX_RENDER)
      : updatedAll;

    const nextCount = (this.data.messageCount || 0) + 1;

    this.setData({
      messages: updatedAll,
      displayMessages: displayList,
      message: '',
      messageCount: nextCount,
      showPetTip: nextCount >= 3 ? true : this.data.showPetTip
    }, () => {
      // 发送后自动滚到底部
      this._onNewMessageArrived();
    });
  },

  addMessage(text) {
    this.setData({ message: text }, () => this.sendMessage());
  },

  closePetTip() {
    this.setData({ showPetTip: false });
  },

  toPetFeeding() {
    wx.navigateTo({ url: "/subpkg-user/pet-feeding/index" });
  },

  onBack() {
    wx.navigateBack();
  }
});

// 导出解码函数供其他模块引用
module.exports = { decodeHtmlEntities };
