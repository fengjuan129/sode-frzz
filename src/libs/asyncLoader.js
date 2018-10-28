import Loading from '../components/Loading.vue';
import Error from '../components/Error.vue';

/**
 * 组件动态加载器
 * @param {Function} asyncComponent 异步加载组件的方法，应当返回一个Promise对象
 * @returns {Object} 含有render渲染方法的一个对象
 */
export default asyncComponent => {
  const Com = () => ({
    // 需要加载的组件（应当是一个Promise对象）
    component: asyncComponent(),
    // 异步组件加载时显示的组件
    loading: Loading,
    // 组件加载失败时显示的组件
    error: Error,
    // 超过3秒视为加载失败
    timeout: 3000,
  });
  return {
    render(h) {
      return h(Com, {});
    },
  };
};
