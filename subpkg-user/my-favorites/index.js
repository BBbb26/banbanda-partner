const USERS = [
  {
    id: 1,
    name: "李同学",
    avatar: "A",
    school: "清华大学",
    grade: "大二",
    tags: ["学习", "图书馆", "晚上", "认真负责"],
    matchScore: 92,
    reliabilityScore: 4.8
  },
  {
    id: 4,
    name: "陈同学",
    avatar: "D",
    school: "清华大学",
    grade: "研一",
    tags: ["摄影", "旅行", "咖啡"],
    matchScore: 88,
    reliabilityScore: 4.7
  },
  {
    id: 6,
    name: "刘同学",
    avatar: "F",
    school: "清华大学",
    grade: "大三",
    tags: ["健身", "瑜伽", "早起", "自律"],
    matchScore: 90,
    reliabilityScore: 4.8
  },
  {
    id: 9,
    name: "郑同学",
    avatar: "I",
    school: "北京大学",
    grade: "大三",
    tags: ["读书", "哲学", "咖啡馆"],
    matchScore: 87,
    reliabilityScore: 4.9
  }
];

function idsToMap(ids) {
  const map = {};
  ids.forEach((id) => {
    map[String(id)] = true;
  });
  return map;
}

Page({
  data: {
    users: USERS,
    selectedIds: [],
    selectedMap: {},
    compareMode: false,
    compareList: []
  },
  toggleSelect(e) {
    const id = Number(e.currentTarget.dataset.id);
    let next = this.data.selectedIds.slice();
    const idx = next.indexOf(id);
    if (idx >= 0) {
      next.splice(idx, 1);
    } else if (next.length < 3) {
      next.push(id);
    }
    this.setData({
      selectedIds: next,
      selectedMap: idsToMap(next)
    });
  },
  enterCompare() {
    if (this.data.selectedIds.length < 2) return;
    const compareList = USERS.filter((u) => this.data.selectedIds.indexOf(u.id) >= 0);
    this.setData({
      compareMode: true,
      compareList
    });
  },
  exitCompare() {
    this.setData({
      compareMode: false,
      compareList: [],
      selectedIds: [],
      selectedMap: {}
    });
  },
  toChat(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "/subpkg-chat/chat/index?userId=" + id
    });
  },
  onBack() {
    wx.navigateBack();
  }
});
