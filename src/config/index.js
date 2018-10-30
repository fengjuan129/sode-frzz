// 系统配置文件

export default {
  /** 系统名称 */
  system: 'Soda Framework',
  /** 系统版本 */
  version: '2.0.0',
  /** 公司名称 */
  company: '四川久远国基科技有限公司',
  /** 数据模拟相关配置 */
  mock: {
    // 是否启用mock功能
    enabled: false,
    // 模拟数据来源（remote || local）
    // 来源为 remote 时，模拟数据由远程mock server提供，此时必须配置url
    // 来源为 local 时，模拟数据使用项目内 mock 目录下的配置生成
    mode: 'local',
    // 远程模拟数据加载基础路径
    // ! 仅当 mode 为 remote 时生效
    url: 'http://192.168.90.234:3000/mock/29',
  },
  // 内部应用唯一身份标识
  client_id: 'Y2xpZW50XzI6MTIzNDU2',
  // 接口数据缓存有效期（用于防止短时间内重复调用，单位：秒）
  api_expirys: 2,
};
