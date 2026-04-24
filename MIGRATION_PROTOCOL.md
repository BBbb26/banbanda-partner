# React TSX -> WeChat Miniprogram Protocol

## 1) Tag Mapping

- `div` / `section` -> `view`
- `span` / `p` -> `text`
- `img` -> `image`
- `button` -> `button` (or `view` + `bindtap` for custom style)
- `input` / `textarea` -> Miniprogram native `input` / `textarea`

## 2) Unit Mapping

- All `px` values must be mapped to `rpx`.
- Baseline scale: `1px ~= 2rpx` (assuming 375px design draft).
- Tailwind spacing examples:
  - `p-2` (8px) -> `16rpx`
  - `p-3` (12px) -> `24rpx`
  - `p-4` (16px) -> `32rpx`
  - `p-6` (24px) -> `48rpx`
  - `rounded-lg` (8px) -> `16rpx`
  - `rounded-xl` (12px) -> `24rpx`

## 3) De-React Rules

- Remove React-only code:
  - `"use client"`
  - `useState`, `useEffect`, `useMemo`, `useNavigate`, etc.
  - React Router (`Navigate`, `Routes`, `Route`)
- Replace state updates with `this.setData(...)`.
- Replace route jumps with `wx.navigateTo`, `wx.redirectTo`, `wx.switchTab`.
- Replace Lucide and Radix UI dependencies:
  - Use native `<icon>` when possible.
  - Otherwise use `view` placeholders and map to iconfont later.

## 4) Event and Data Mapping

- `onClick` -> `bindtap`
- `onChange` -> `bindinput` / `bindchange`
- JSX interpolation -> Mustache template (`{{value}}`)
- `.map(...)` render -> `wx:for`
- conditional render -> `wx:if` / `wx:elif` / `wx:else`

## 5) Page Migration Checklist

1. Build static WXML layout (mapped tags only).
2. Convert class utility styles into WXSS using global variables from `app.wxss`.
3. Port component state to `data` and `setData`.
4. Replace navigation and side effects with WeChat APIs.
5. Replace external icon/component libraries with native equivalents.
