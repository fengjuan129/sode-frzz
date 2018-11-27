/**
 * 应用状态管理
 */
export default {
  namespaced: true,
  state: {
    // 首页布局
    layout: {
      mode: 'vertical', // 导航模式（vertical / horizontal）
      'background-color': '#ffffff', // 菜单的背景色（仅支持 hex 格式）
      'text-color': '#303133', // 菜单的文字颜色（仅支持 hex 格式）
      'active-text-color': '#409EFF', // 当前激活菜单的文字颜色（仅支持 hex 格式）
      'unique-opened': false, // 是否只保持一个子菜单的展开
      fixedHeader: false, // 是否锁定顶部导航
      'collapse-transition': false, // 是否开启折叠动画
      collapse: false, // 是否水平折叠收起菜单（仅在 mode 为 vertical 时可用）
      fixSiderbar: false, // 是否固定侧边导航菜单（仅在 mode 为 vertical 时可用）
      'menu-trigger': 'hover', // 子菜单打开的触发方式(hover / click， 仅在 mode 为 horizontal 时有效)
      autoHideHeader: false, // 是否在下滑滚动时自动隐藏顶部导航（仅在 mode 为 horizontal 时有效）
      contentWidth: 'fixed', // 内容区域宽度（fixed / auto， 仅在 mode 为 horizontal 时有效）
    },
  },
  mutations: {
    // 切换侧栏展开状态
    toggleCollapse(state) {
      state.layout.collapse = !state.layout.collapse;
    },
  },
  actions: {},
  getters: {
    // 菜单配置
    menuConfig(state) {
      return {
        'background-color': state.layout['background-color'],
        'text-color': state.layout['text-color'],
        'active-text-color': state.layout['active-text-color'],
        'unique-opened': state.layout['unique-opened'],
        'collapse-transition': state.layout['collapse-transition'],
        collapse: state.layout.collapse,
      };
    },
    // 侧栏宽度
    asideWidth(state) {
      return state.layout.collapse ? '64px' : '265px';
    },
  },
};
