Page({
  data: {
    tabs: ["全部", "好友", "附近", "兴趣圈"],
    currentTab: 0,
    searchKeyword: "",
    reactions: [
      { emoji: "🥺", label: "想去" },
      { emoji: "😆", label: "求带" },
      { emoji: "🍉", label: "吃瓜" }
    ],
    posts: [
      {
        id: 1,
        name: "张同学",
        time: "2小时前",
        avatarEmoji: "🍜",
        avatarColor: "#FFF0F3",
        content: "今天发现一家超好吃川菜！有人一起吗～味道真的绝了，老板还送了小菜！",
        location: "阿英川菜馆",
        images: ["https://zhaodazi-1424531488.cos.ap-shanghai.myqcloud.com/cat-food.png"],
        likes: 23,
        comments: 5,
        liked: false
      },
      {
        id: 2,
        name: "李同学",
        time: "5小时前",
        avatarEmoji: "📚",
        avatarColor: "#E8EEFF",
        content: "图书馆今天人好少，求一个自习搭子！我一般晚上7点到11点，位置固定在3楼自习区。",
        location: "北大图书馆",
        images: ["https://zhaodazi-1424531488.cos.ap-shanghai.myqcloud.com/cat-study.png"],
        likes: 45,
        comments: 12,
        liked: false
      },
      {
        id: 3,
        name: "王同学",
        time: "昨天",
        avatarEmoji: "🏀",
        avatarColor: "#FFF3E0",
        content: "周末篮球局缺人！明天下午2点体育馆，有没有小伙伴一起？新手也欢迎来玩~",
        location: "校体育馆",
        images: [],
        likes: 31,
        comments: 8,
        liked: false
      },
      {
        id: 4,
        name: "陈同学",
        time: "昨天",
        avatarEmoji: "🎸",
        avatarColor: "#FFF8E1",
        content: "民谣音乐分享会，这周五晚上7点在咖啡厅。有喜欢民谣的朋友吗？一起听歌聊天呀~",
        location: "校园咖啡厅",
        images: ["https://zhaodazi-1424531488.cos.ap-shanghai.myqcloud.com/cat-entertain.png"],
        likes: 67,
        comments: 19,
        liked: true
      }
    ]
  },

  onShow() {
    if (typeof this.getTabBar === "function" && this.getTabBar()) {
      this.getTabBar().setData({ selected: 1 });
    }
  },

  switchTab(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({ currentTab: index });
  },

  onSearchInput(e) {
    this.setData({ searchKeyword: e.detail.value });
  },

  onSearch(e) {
    var keyword = (this.data.searchKeyword || "").trim();
    if (!keyword) return;
    wx.showToast({ title: '搜索: ' + keyword, icon: "none" });
  },

  onSearchEmoji() {
    const keyword = (this.data.searchKeyword || "").trim();
    if (keyword) {
      wx.showToast({ title: '搜索: ' + keyword, icon: "none" });
    } else {
      wx.showToast({ title: "请输入搜索内容", icon: "none" });
    }
  },

  onPublish() {
    wx.navigateTo({
      url: "/subpkg-create/post-create/index"
    });
  },

  onFollow(e) {
    wx.showToast({ title: "已关注", icon: "success" });
  },

  onLike(e) {
    const postId = e.currentTarget.dataset.id;
    const posts = this.data.posts.map(function (p) {
      if (p.id !== postId) return p;
      if (p.liked) {
        return Object.assign({}, p, { liked: false, likes: p.likes - 1 });
      }
      return Object.assign({}, p, { liked: true, likes: p.likes + 1 });
    });
    this.setData({ posts });
  },

  onComment(e) {
    wx.navigateTo({
      url: "/subpkg-chat/chat/index?userId=" + e.currentTarget.dataset.id
    });
  },

  onReact(e) {
    var emoji = e.currentTarget.dataset.emoji;
    var label = e.currentTarget.dataset.label || "";
    wx.showToast({ title: emoji + " " + label, icon: "none" });
  },

  onJoin(e) {
    wx.showModal({
      title: "发起组队",
      content: "确定要加入这个活动吗？",
      confirmText: "确认加入",
      success: function (res) {
        if (res.confirm) {
          wx.showToast({ title: "组队成功~", icon: "success" });
        }
      }
    });
  }
});
