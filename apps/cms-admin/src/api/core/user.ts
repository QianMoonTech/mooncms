import type { UserInfo } from '@vben/types';

import { requestClient } from '#/api/request';

export interface AccountInfo {
  username: string;
  nickname: string;
  email: string;
  phone: string;
  remark: string;
  avatar: string;
}

/**
 * 获取用户信息
 */
export async function getUserInfoApi(): Promise<UserInfo> {
  const accountInfo = await requestClient.get<AccountInfo>('/account/profile');
  return {
    userId: accountInfo.username,
    username: accountInfo.username,
    realName: accountInfo.nickname,
    avatar: accountInfo.avatar,
    desc: accountInfo.remark,
    email: accountInfo.email,
    phone: accountInfo.phone,
    homePath: '/dashboard',
    roles: [],
  };
}
