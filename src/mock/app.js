// 模拟应用系统相关接口
import Mock from 'mockjs';

// 加载全部应用系统
Mock.mock('/api/v1/core/base/apps', 'get', () => [
  {
    name: '院人事信息管理系统',
    appId: 'seshr',
  },
  {
    name: '涉密电子会议系统',
    appId: 'sems',
  },
  {
    name: '电子公文系统',
    appId: 'doc',
  },
]);
