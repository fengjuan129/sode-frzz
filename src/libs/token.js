// 获取、存储token信息
import localStore from 'store';
import config from '../config';

const TOKEN_KEY = `token_${config.system}`;

function setToken(token) {
  localStore.set(TOKEN_KEY, token);
}

function getToken() {
  return localStore.get(TOKEN_KEY);
}

function clearToken() {
  localStore.remove(TOKEN_KEY);
}

export { setToken, getToken, clearToken };
