/* eslint-disable import/prefer-default-export */
import request from '@/libs/request';

/**
 * 查询模版三员列表
 */
export function loadPemplateroles() {
  return request(`/v1/core/base/templateroles`, {
    methods: 'get',
  }).then(res => res || []);
}
