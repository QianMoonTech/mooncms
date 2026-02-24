import { baseRequestClient, requestClient } from '#/api/request';

export namespace AuthApi {
  /** 登录接口参数 */
  export interface LoginParams {
    password?: string;
    username?: string;
    captchaId: string;
    verifyCode: string;
  }

  /** 登录接口返回值 */
  export interface LoginResult {
    token: string;
  }

  export interface RefreshTokenResult {
    data: string;
    status: number;
  }

  export interface CaptchaResult {
    img: string;
    id: string;
  }
}

/**
 * 登录
 */
export async function loginApi(data: AuthApi.LoginParams) {
  return requestClient.post<AuthApi.LoginResult>('/auth/login', data, {
    withCredentials: true,
  });
}

/**
 * 刷新accessToken
 */
export async function refreshTokenApi() {
  return baseRequestClient.post<AuthApi.RefreshTokenResult>(
    '/auth/refresh',
    null,
    {
      withCredentials: true,
    },
  );
}

/**
 * 退出登录
 */
export async function logoutApi() {
  return baseRequestClient.get('/account/logout', {
    withCredentials: true,
  });
}

/**
 * 获取用户权限码
 */
export async function getAccessCodesApi() {
  return requestClient.get<string[]>('/account/permissions');
}

/**
 * 获取图片验证码
 */
export async function getCaptchaApi(width = 100, height = 50) {
  return requestClient.get<AuthApi.CaptchaResult>('/auth/captcha/img', {
    params: { width, height },
  });
}
