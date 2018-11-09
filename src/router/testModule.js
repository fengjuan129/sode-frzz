import asyncLoader from '../libs/asyncLoader';
import TestModules from '../views/test_modules';

export default [
  {
    path: '/page1',
    name: 'page1',
    component: asyncLoader(() => TestModules.page1),
    meta: {
      /**
       * !mate 为自定义属性，标记路由为什么类型
       */
      type: 'protected',
    },
  },
  {
    path: '/page2',
    name: 'page2',
    component: asyncLoader(() => TestModules.page2),
    meta: {
      type: 'protected',
    },
  },
  {
    path: '/page3',
    name: 'page3',
    component: asyncLoader(() => TestModules.page3),
    meta: {
      type: 'protected',
    },
  },
  {
    path: '/page4',
    name: 'page4',
    component: asyncLoader(() => TestModules.page4),
    meta: {
      type: 'protected',
    },
  },
  {
    path: '/page5',
    name: 'page5',
    component: asyncLoader(() => TestModules.page5),
    meta: {
      type: 'protected',
    },
  },
];
