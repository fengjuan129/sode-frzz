import Vue from 'vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import * as solid from '@fortawesome/free-solid-svg-icons';
import * as brands from '@fortawesome/free-brands-svg-icons';
import * as regular from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

// 添加字体图标
[solid, brands, regular].forEach(icons => {
  Object.keys(icons).forEach(item => {
    if (icons[item].icon) {
      library.add(icons[item]);
    }
  });
});

Vue.component('font-awesome-icon', FontAwesomeIcon);
