Page({
  data: {
    currentSchool: "清华大学",
    searchKeyword: "",
    favorites: {},
    filterTabs: ["推荐", "最新", "热门"],
    currentFilter: "推荐",
    showSchoolPicker: false,
    schoolSearchKey: "",
    schools: [
      { name: "清华大学" },
      { name: "北京大学" },
      { name: "浙江大学" },
      { name: "复旦大学" },
      { name: "上海交通大学" },
      { name: "南京大学" },
      { name: "中国科学技术大学" },
      { name: "武汉大学" },
      { name: "华中科技大学" },
      { name: "中山大学" },
      { name: "四川大学" },
      { name: "浙江工业大学" },
      { name: "浙江工业大学之江校区" },
      { name: "杭州电子科技大学" },
      { name: "浙江理工大学" },
      { name: "浙江工商大学" },
      { name: "中国美术学院" },
      { name: "同济大学" },
      { name: "华东师范大学" },
      { name: "东南大学" },
      { name: "厦门大学" }
    ],
    filteredSchools: [],
    categories: [
      { name: "学习", icon: "https://zhaodazi-1424531488.cos.ap-shanghai.myqcloud.com/cat-study.png" },
      { name: "运动", icon: "https://zhaodazi-1424531488.cos.ap-shanghai.myqcloud.com/cat-sports.png" },
      { name: "美食", icon: "https://zhaodazi-1424531488.cos.ap-shanghai.myqcloud.com/cat-food.png" },
      { name: "娱乐", icon: "https://zhaodazi-1424531488.cos.ap-shanghai.myqcloud.com/cat-entertain.png" }
    ],
    ongoingActivities: [
      {
        id: 1,
        badge: "组队中",
        badgeColor: "#3B82F6",
        type: "运动",
        name: "周末篮球局",
        time: "本周六 15:00",
        location: "紫荆篮球场",
        memberCount: 4,
        maxCount: 6,
        members: ["#FFB347", "#87CEEB", "#98FB98", "#DDA0DD"],
        urgent: false
      },
      {
        id: 2,
        badge: "招募",
        badgeColor: "#10B981",
        type: "学习",
        name: "图书馆学习小组",
        time: "每天 19:00",
        location: "新图书馆",
        memberCount: 3,
        maxCount: 5,
        members: ["#F08080", "#90EE90", "#87CEFA"],
        urgent: true
      },
      {
        id: 3,
        badge: "拼单",
        badgeColor: "#F59E0B",
        type: "美食",
        name: "海底捞优惠",
        time: "今晚 18:00",
        location: "中关村店",
        memberCount: 2,
        maxCount: 4,
        members: ["#FFD700", "#FF69B4"],
        urgent: false
      },
      {
        id: 4,
        badge: "活动",
        badgeColor: "#8B5CF6",
        type: "娱乐",
        name: "电影放映会",
        time: "明晚 20:00",
        location: "学生活动中心",
        memberCount: 8,
        maxCount: 20,
        members: ["#FFB347", "#87CEEB", "#98FB98", "#DDA0DD", "#F08080"],
        urgent: false
      }
    ],
    leftItems: [],
    rightItems: []
  },

  onLoad() {
    this._distributeItems();
    this.setData({
      filteredSchools: this.data.schools
    });
  },

  onShow() {
    if (typeof this.getTabBar === "function" && this.getTabBar()) {
      this.getTabBar().setData({ selected: 0 });
    }
  },

  _distributeItems() {
    const allItems = [
      {
        id: 1,
        type: "user",
        name: "李同学",
        school: "清华大学",
        grade: "大二",
        avatarEmoji: "📚",
        coverColor: "#FFE5E1",
        tags: ["学习", "图书馆", "考研"],
        matchScore: 92,
        matchReason: "你们都喜欢晚上去图书馆学习",
        reliabilityScore: 4.8,
        socialCount: 7,
        socialAvatars: ["#FFB347", "#87CEEB", "#98FB98"]
      },
      {
        id: "ad-1",
        type: "ad",
        merchant: "星巴克咖啡",
        logo: "☕",
        offer: "新生专属7折优惠",
        description: "清华园店·凭学生证享受优惠",
        location: "清华大学东门",
        bgColor: "#F0FDF4"
      },
      {
        id: 2,
        type: "user",
        name: "王同学",
        school: "清华大学",
        grade: "大三",
        avatarEmoji: "🏀",
        coverColor: "#FFF3E0",
        tags: ["运动", "篮球", "开朗"],
        matchScore: 85,
        matchReason: "都喜欢周末打篮球",
        reliabilityScore: 4.6,
        socialCount: 5,
        socialAvatars: ["#DDA0DD", "#F08080", "#90EE90"]
      },
      {
        id: 3,
        type: "user",
        name: "张同学",
        school: "北京大学",
        grade: "大一",
        avatarEmoji: "🍜",
        coverColor: "#FFF0F3",
        tags: ["美食", "探店", "AA制"],
        matchScore: 78,
        matchReason: "都喜欢探索新餐厅",
        reliabilityScore: 4.9,
        socialCount: 12,
        socialAvatars: ["#FFD700", "#87CEFA", "#FFB347"]
      },
      {
        id: "ad-2",
        type: "ad",
        merchant: "海底捞火锅",
        logo: "🍲",
        offer: "学生专享8.8折",
        description: "双人套餐更优惠",
        location: "中关村店",
        bgColor: "#FFF3E0"
      },
      {
        id: 4,
        type: "user",
        name: "陈同学",
        school: "清华大学",
        grade: "研一",
        avatarEmoji: "📷",
        coverColor: "#F0FFF4",
        tags: ["摄影", "旅行", "咖啡"],
        matchScore: 88,
        matchReason: "同样喜欢周末拍照",
        reliabilityScore: 4.7,
        socialCount: 9,
        socialAvatars: ["#98FB98", "#DDA0DD", "#87CEEB"]
      },
      {
        id: 5,
        type: "user",
        name: "赵同学",
        school: "北京大学",
        grade: "大二",
        avatarEmoji: "🎸",
        coverColor: "#FFF8E1",
        tags: ["音乐", "吉他", "民谣"],
        matchScore: 81,
        matchReason: "同样喜欢民谣音乐",
        reliabilityScore: 4.5,
        socialCount: 4,
        socialAvatars: ["#F08080", "#FFD700", "#87CEEB"]
      },
      {
        id: 6,
        type: "user",
        name: "刘同学",
        school: "清华大学",
        grade: "大三",
        avatarEmoji: "🏋️",
        coverColor: "#E8EEFF",
        tags: ["健身", "瑜伽", "自律"],
        matchScore: 90,
        matchReason: "都习惯早起运动",
        reliabilityScore: 4.8,
        socialCount: 6,
        socialAvatars: ["#98FB98", "#FFB347", "#DDA0DD"]
      }
    ];

    const left = [];
    const right = [];
    allItems.forEach((item, index) => {
      if (index % 2 === 0) {
        left.push(item);
      } else {
        right.push(item);
      }
    });

    this.setData({
      leftItems: left,
      rightItems: right
    });
  },

  onCategoryTap(e) {
    const name = e.currentTarget.dataset.name;
    wx.showToast({ title: `筛选${name}`, icon: "none" });
  },

  onFilterTap(e) {
    const filter = e.currentTarget.dataset.filter;
    this.setData({ currentFilter: filter });
  },

  onToggleFavorite(e) {
    const id = String(e.currentTarget.dataset.id);
    const favorites = Object.assign({}, this.data.favorites);
    favorites[id] = !favorites[id];
    this.setData({ favorites });
  },

  onApplyMatch(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "/subpkg-chat/chat/index?userId=" + id
    });
  },

  onActivityTap(e) {
    const id = e.currentTarget.dataset.id;
    wx.showToast({ title: "查看活动详情", icon: "none" });
  },

  onCardTap(e) {
    const id = e.currentTarget.dataset.id;
    const type = e.currentTarget.dataset.type;
    console.log("点击卡片:", type, id);
  },

  onAdTap(e) {
    const id = e.currentTarget.dataset.id;
    wx.showToast({ title: "广告跳转", icon: "none" });
  },

  onSearch(e) {
    const keyword = e.detail.value || this.data.searchKeyword;
    if (keyword) {
      wx.showToast({ title: "搜索: " + keyword, icon: "none" });
    }
  },

  onSearchInput(e) {
    this.setData({ searchKeyword: e.detail.value });
  },

  onSearchEmoji() {
    const keyword = this.data.searchKeyword;
    if (keyword && keyword.trim()) {
      wx.showToast({ title: "搜索: " + keyword.trim(), icon: "none" });
    } else {
      wx.showToast({ title: "请输入搜索内容", icon: "none" });
    }
  },

  onSelectSchool() {
    this.setData({
      showSchoolPicker: true,
      schoolSearchKey: "",
      filteredSchools: this.data.schools
    });
  },

  onCloseSchoolPicker() {
    this.setData({
      showSchoolPicker: false,
      schoolSearchKey: ""
    });
  },

  onSchoolSearch(e) {
    const key = e.detail.value;
    const filtered = this.data.schools.filter(school => 
      school.name.includes(key)
    );
    this.setData({
      schoolSearchKey: key,
      filteredSchools: filtered
    });
  },

  onSelectSchoolItem(e) {
    const name = e.currentTarget.dataset.name;
    this.setData({
      currentSchool: name,
      showSchoolPicker: false,
      schoolSearchKey: ""
    });
    wx.showToast({ title: "已选择: " + name, icon: "none" });
  },

  preventBubble() {},

  toCampusFeed() {
    wx.switchTab({
      url: "/pages/campus-feed/index"
    });
  },

  toActivityCreate() {
    wx.navigateTo({
      url: "/subpkg-create/activity-create/index"
    });
  }
});
