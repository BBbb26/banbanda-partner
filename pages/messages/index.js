Page({
  data: {
    searchKeyword: "",
    activeTab: "chat",
    showActionSheet: false,
    actionTargetId: null,

    tabs: [
      { key: "chat", label: "私信", count: 3 },
      { key: "notice", label: "通知", count: 2 },
      { key: "system", label: "系统", count: 0 }
    ],

    // 活跃用户故事行（类 Instagram Stories）
    activeUsers: [
      { id: "a1", name: "李同学", avatarEmoji: "📚", online: true, hasNew: true },
      { id: "a2", name: "王同学", avatarEmoji: "🏀", online: false, hasNew: true },
      { id: "a3", name: "张同学", avatarEmoji: "🍜", online: true, hasNew: false }
    ],

    // 对话列表
    conversations: [
      {
        id: 1, name: "李同学", school: "浙江工业大学",
        lastMessage: "太好了，我也是这个时间段。要不明晚一起？",
        time: "14:23", timeLabel: "刚刚", unread: 2,
        reliabilityScore: 4.8, online: true,
        verified: true, readReceipt: false,
        msgType: "text", msgTypeIcon: "",
        tags: ["学习", "图书馆"],
        avatarEmoji: "📚", avatarColor: "#E8EEFF"
      },
      {
        id: 2, name: "王同学", school: "清华大学",
        lastMessage: "周末打篮球吗？",
        time: "昨天", timeLabel: "昨天", unread: 0,
        reliabilityScore: 4.6, online: false,
        verified: false, readReceipt: true,
        msgType: "text", msgTypeIcon: "",
        tags: ["运动", "篮球"],
        avatarEmoji: "🏀", avatarColor: "#FFF3E0"
      },
      {
        id: 3, name: "张同学", school: "北京大学",
        lastMessage: "[图片] 找到一家超好吃的火锅店！",
        time: "2天前", timeLabel: "周二", unread: 1,
        reliabilityScore: 4.9, online: true,
        verified: true, readReceipt: false,
        msgType: "image", msgTypeIcon: "🖼",
        tags: ["美食", "火锅"],
        avatarEmoji: "🍜", avatarColor: "#FFF0F3"
      },
      {
        id: 4, name: "陈同学", school: "复旦大学",
        lastMessage: "[位置] 咱们老地方见～",
        time: "3天前", timeLabel: "周一", unread: 0,
        reliabilityScore: 4.5, online: false,
        verified: false, readReceipt: true,
        msgType: "location", msgTypeIcon: "📍",
        tags: ["音乐", "演出"],
        avatarEmoji: "🎵", avatarColor: "#F3E8FF"
      },
      {
        id: 5, name: "刘同学", school: "上海交大",
        lastMessage: "好的，那我们周六上午10点出发",
        time: "上周", timeLabel: "上周", unread: 0,
        reliabilityScore: 4.7, online: false,
        verified: false, readReceipt: true,
        msgType: "text", msgTypeIcon: "",
        tags: ["旅行", "摄影"],
        avatarEmoji: "📷", avatarColor: "#EDE9FE"
      }
    ],

    filteredConversations: [],

    // 通知列表
    notifications: [
      {
        id: "n1", type: "like", icon: "❤", title: "新的点赞",
        desc: "李同学赞了你的动态「周末一起去看展吗」",
        time: "5分钟前", read: false
      },
      {
        id: "n2", type: "follow", icon: "👤", title: "新关注者",
        desc: "张同学开始关注你了，快去看看吧",
        time: "1小时前", read: false
      },
      {
        id: "n3", type: "comment", icon: "💬", title: "评论回复",
        desc: "王同学回复了你的评论：「好主意！」",
        time: "昨天", read: true
      },
      {
        id: "n4", type: "match", icon: "🎯", title: "匹配成功",
        desc: "你和赵同学匹配成功了，快去打招呼吧",
        time: "2天前", read: true
      },
      {
        id: "n5", type: "system", icon: "⚡", title: "活动提醒",
        desc: "你报名的「校园夜跑」活动将在明天晚上7点开始",
        time: "3天前", read: true
      }
    ],

    // 系统消息列表
    systemMessages: [
      {
        id: "s1", type: "update", typeLabel: "版本更新",
        title: "校园搭子 v2.0 新功能上线啦！",
        content: "全新消息中心、宠物养成系统、积分商城等功能已就绪，快来体验吧~",
        time: "今天", priority: "high", actionText: "立即查看"
      },
      {
        id: "s2", type: "activity", typeLabel: "活动公告",
        title: "春季校园交友周即将开启！",
        content: "参与活动可获双倍积分，还有机会获得限量版虚拟道具哦。",
        time: "3天前", priority: "normal", actionText: "了解详情"
      },
      {
        id: "s3", type: "tips", typeLabel: "使用小贴士",
        title: "如何提升你的靠谱度？",
        content: "保持活跃、及时回复消息、完成约定都能增加靠谱度评分。靠谱度越高越容易被推荐~",
        time: "1周前", priority: "normal", actionText: ""
      }
    ]
  },

  onLoad() {
    this.setData({ filteredConversations: this.data.conversations });
  },

  onShow() {
    if (typeof this.getTabBar === "function" && this.getTabBar()) {
      this.getTabBar().setData({ selected: 2 });
    }
  },

  /* ========== 搜索功能 ========== */
  onSearchInput(e) {
    const keyword = e.detail.value.trim();
    this.setData({ searchKeyword: keyword });
    this.filterConversations(keyword);
  },

  clearSearch() {
    this.setData({
      searchKeyword: "",
      filteredConversations: this.data.conversations
    });
  },

  onSearchConfirm(e) {
    const keyword = e.detail.value.trim();
    this.filterConversations(keyword);
  },

  filterConversations(keyword) {
    if (!keyword) {
      this.setData({ filteredConversations: this.data.conversations });
      return;
    }
    const kw = keyword.toLowerCase();
    const filtered = this.data.conversations.filter(c =>
      c.name.toLowerCase().includes(kw) ||
      c.lastMessage.toLowerCase().includes(kw) ||
      (c.tags && c.tags.some(t => t.toLowerCase().includes(kw)))
    );
    this.setData({ filteredConversations: filtered });
  },

  /* ========== Tab 切换 ========== */
  switchTab(e) {
    const key = e.currentTarget.dataset.key;
    this.setData({ activeTab: key });
  },

  /* ========== 导航跳转 ========== */
  toChat(e) {
    const id = e.currentTarget.dataset.id;
    const conversation = this.data.conversations.find(c => c.id === id);
    
    // 仅当点击"李同学"时才跳转
    if (conversation && conversation.name === "李同学") {
      wx.navigateTo({
        url: "/subpkg-chat/chat/index?userId=" + id
      });
    }
    // 其他消息项不触发跳转，保持当前页面状态
  },

  toHome() {
    wx.switchTab({ url: "/pages/home/index" });
  },

  /* ========== 长按操作面板 ========== */
  onLongPressItem(e) {
    const id = e.currentTarget.dataset.id;
    wx.vibrateShort({ type: "medium" });
    this.setData({ showActionSheet: true, actionTargetId: id });
  },

  hideActionSheet() {
    this.setData({ showActionSheet: false, actionTargetId: null });
  },

  markAsRead() {
    const id = this.data.actionTargetId;
    const list = this.data.filteredConversations.map(c => {
      if (c.id === id) return Object.assign({}, c, { unread: 0 });
      return c;
    });
    // 更新未读总数
    let totalUnread = 0;
    list.forEach(c => { totalUnread += c.unread || 0; });
    const tabs = this.data.tabs.map((t, i) => i === 0 ? Object.assign({}, t, { count: totalUnread }) : t);
    this.setData({
      conversations: this.data.conversations.map(c =>
        c.id === id ? Object.assign({}, c, { unread: 0 }) : c
      ),
      filteredConversations: list,
      tabs: tabs,
      showActionSheet: false
    });
    wx.showToast({ title: "已标记为已读", icon: "none" });
  },

  pinChat() {
    wx.showToast({ title: "置顶聊天开发中", icon: "none" });
    this.hideActionSheet();
  },

  deleteChat() {
    const id = this.data.actionTargetId;
    const list = this.data.filteredConversations.filter(c => c.id !== id);
    const mainList = this.data.conversations.filter(c => c.id !== id);
    this.setData({
      conversations: mainList,
      filteredConversations: list,
      showActionSheet: false
    });
    wx.showToast({ title: "对话已删除", icon: "none" });
  },

  /* ========== 更多操作 ========== */
  showMoreActions() {
    wx.showActionSheet({
      itemList: ["清空所有未读", "添加新好友", "设置消息免打扰"],
      success: (res) => {
        if (res.tapIndex === 0) {
          const list = this.data.conversations.map(c => Object.assign({}, c, { unread: 0 }));
          this.setData({
            conversations: list,
            filteredConversations: list,
            "tabs[0].count": 0
          });
          wx.showToast({ title: "全部已读", icon: "none" });
        } else if (res.tapIndex === 1) {
          wx.switchTab({ url: "/pages/home/index" });
        } else if (res.tapIndex === 2) {
          wx.showToast({ title: "免打扰设置开发中", icon: "none" });
        }
      }
    });
  },

  /* ========== 通知/系统消息操作 ========== */
  handleNotice(e) {
    const id = e.currentTarget.dataset.id;
    const notifs = this.data.notifications.map(n =>
      n.id === id ? Object.assign({}, n, { read: true }) : n
    );
    const unreadCount = notifs.filter(n => !n.read).length;
    const tabs = this.data.tabs.map((t, i) =>
      i === 1 ? Object.assign({}, t, { count: unreadCount }) : t
    );
    this.setData({ notifications: notifs, tabs: tabs });
  },

  handleSystemMsg(e) {
    const item = this.data.systemMessages.find(s => s.id === e.currentTarget.dataset.id);
    if (!item || !item.actionText) return;
  },

  onSystemAction(e) {
    wx.showToast({ title: "正在打开...", icon: "loading" });
  }
});
