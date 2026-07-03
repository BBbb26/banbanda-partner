var MY_CATEGORIES = [
  {
    id: 'study',
    icon: '📚',
    name: '学习进修',
    tags: ['学习', '考研', '刷题', '论文', '小组讨论'],
    expanded: true,
    selectedCount: 0
  },
  {
    id: 'sports',
    icon: '🏃',
    name: '运动健身',
    tags: ['运动', '跑步', '篮球', '羽毛球', '健身'],
    expanded: true,
    selectedCount: 0
  },
  {
    id: 'entertainment',
    icon: '🎮',
    name: '娱乐爱好',
    tags: ['游戏', '手游', '主机', '桌游'],
    expanded: true,
    selectedCount: 0
  },
  {
    id: 'places',
    icon: '📍',
    name: '常去场所',
    tags: ['图书馆', '自习室', '操场', '体育馆', '食堂', '咖啡厅'],
    expanded: true,
    selectedCount: 0
  },
  {
    id: 'time',
    icon: '⏰',
    name: '活跃时段',
    tags: ['早晨', '上午', '下午', '晚上', '周末'],
    expanded: true,
    selectedCount: 0
  },
  {
    id: 'personality',
    icon: '💡',
    name: '性格特质',
    tags: ['认真负责', '开朗外向', '安静内敛', '幽默风趣', '细心耐心'],
    expanded: true,
    selectedCount: 0
  }
];

var EXPECTED_CATEGORIES = [
  {
    id: 'interest',
    icon: '🎯',
    name: '兴趣偏好',
    tags: ['学习', '考研', '刷题', '运动', '跑步', '篮球', '羽毛球', '游戏', '电影', '音乐', '美食', '旅行'],
    expanded: true,
    selectedCount: 0
  },
  {
    id: 'personality-pref',
    icon: '💡',
    name: '性格偏好',
    tags: ['认真负责', '开朗外向', '安静内敛', '幽默风趣', '守时靠谱'],
    expanded: true,
    selectedCount: 0
  },
  {
    id: 'filter',
    icon: '🔍',
    name: '筛选条件',
    tags: ['AA制', '男生', '女生', '不限', '同校', '附近学校'],
    expanded: true,
    selectedCount: 0
  }
];

function deepClone(arr) {
  return JSON.parse(JSON.stringify(arr));
}

function computeSelectedCount(categories, tagMap) {
  return categories.map(function (cat) {
    var count = 0;
    cat.tags.forEach(function (t) {
      if (tagMap[t]) count++;
    });
    return Object.assign({}, cat, { selectedCount: count });
  });
}

Page({
  data: {
    currentStep: 'my',
    myTags: [],
    expectedTags: [],
    myTagMap: {},
    expectedTagMap: {},
    myCategories: deepClone(MY_CATEGORIES),
    expectedCategories: deepClone(EXPECTED_CATEGORIES)
  },

  onLoad: function () {
    this._refreshMyCategories();
    this._refreshExpectedCategories();
  },

  toggleCategory: function (e) {
    var id = e.currentTarget.dataset.id;
    var step = e.currentTarget.dataset.step;
    var key = step === 'my' ? 'myCategories' : 'expectedCategories';
    var categories = this.data[key].map(function (cat) {
      if (cat.id === id) {
        return Object.assign({}, cat, { expanded: !cat.expanded });
      }
      return cat;
    });
    this.setData({ [key]: categories });
  },

  toggleMyTag: function (e) {
    var tag = e.currentTarget.dataset.tag;
    var current = this.data.myTags.slice();
    var index = current.indexOf(tag);
    if (index >= 0) {
      current.splice(index, 1);
    } else {
      current.push(tag);
    }
    var map = {};
    current.forEach(function (item) {
      map[item] = true;
    });
    this.setData({
      myTags: current,
      myTagMap: map
    }, function () {
      this._refreshMyCategories();
    });
  },

  toggleExpectedTag: function (e) {
    var tag = e.currentTarget.dataset.tag;
    var current = this.data.expectedTags.slice();
    var index = current.indexOf(tag);
    if (index >= 0) {
      current.splice(index, 1);
    } else {
      current.push(tag);
    }
    var map = {};
    current.forEach(function (item) {
      map[item] = true;
    });
    this.setData({
      expectedTags: current,
      expectedTagMap: map
    }, function () {
      this._refreshExpectedCategories();
    });
  },

  _refreshMyCategories: function () {
    var updated = computeSelectedCount(this.data.myCategories, this.data.myTagMap);
    this.setData({ myCategories: updated });
  },

  _refreshExpectedCategories: function () {
    var updated = computeSelectedCount(this.data.expectedCategories, this.data.expectedTagMap);
    this.setData({ expectedCategories: updated });
  },

  goNext: function () {
    if (this.data.myTags.length < 3) {
      wx.showToast({
        title: '至少选择 3 个标签',
        icon: 'none'
      });
      return;
    }
    this.setData({
      currentStep: 'expected'
    });
  },

  finishSetup: function () {
    var app = getApp();
    app.globalData.hasCompletedTags = true;

    wx.showToast({
      title: '设置完成',
      icon: 'success',
      duration: 1500
    });

    setTimeout(function () {
      wx.switchTab({
        url: '/pages/profile/index',
        success: function () {
          console.log('[Tags] 成功返回个人资料页');
        },
        fail: function (err) {
          console.error('[Tags] 返回个人资料页失败:', err);
          wx.switchTab({ url: '/pages/home/index' });
        }
      });
    }, 1500);
  }
});
