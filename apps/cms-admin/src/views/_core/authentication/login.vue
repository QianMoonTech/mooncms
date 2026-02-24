<script lang="ts" setup>
import type { VbenFormSchema } from '@vben/common-ui';

import { defineComponent, h, onMounted, ref } from 'vue';

import { AuthenticationLogin, z } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { getCaptchaApi } from '#/api';
import { useAuthStore } from '#/store';

defineOptions({ name: 'Login' });

const authStore = useAuthStore();

const captchaId = ref('');
const captchaImg = ref('');
const captchaLoading = ref(false);

async function refreshCaptcha() {
  try {
    captchaLoading.value = true;
    const result = await getCaptchaApi(120, 40);
    captchaId.value = result.id;
    captchaImg.value = result.img;
  } catch (error) {
    console.error('Failed to fetch captcha:', error);
    captchaImg.value = '';
    captchaId.value = '';
  } finally {
    captchaLoading.value = false;
  }
}

onMounted(() => {
  refreshCaptcha();
});

const CaptchaImage = defineComponent({
  name: 'CaptchaImage',
  setup() {
    return () => {
      if (captchaImg.value) {
        return h('img', {
          src: captchaImg.value,
          alt: 'captcha',
          class: 'h-9 cursor-pointer rounded border',
          onClick: refreshCaptcha,
        });
      }
      return h('span', { class: 'text-sm text-muted-foreground' }, '加载中...');
    };
  },
});

const formSchema: VbenFormSchema[] = [
  {
    component: 'VbenInput',
    componentProps: {
      placeholder: $t('authentication.usernameTip'),
    },
    fieldName: 'username',
    label: $t('authentication.username'),
    rules: z.string().min(1, { message: $t('authentication.usernameTip') }),
  },
  {
    component: 'VbenInputPassword',
    componentProps: {
      placeholder: $t('authentication.password'),
    },
    fieldName: 'password',
    label: $t('authentication.password'),
    rules: z.string().min(1, { message: $t('authentication.passwordTip') }),
  },
  {
    component: 'VbenInput',
    componentProps: {
      placeholder: $t('authentication.captchaTip') || '请输入验证码',
    },
    fieldName: 'verifyCode',
    label: $t('authentication.captcha') || '验证码',
    rules: z.string().length(4, {
      message: $t('authentication.captchaTip') || '请输入4位验证码',
    }),
    suffix: () => h(CaptchaImage),
  },
];

async function handleSubmit(values: Record<string, any>) {
  await authStore.authLogin({
    ...values,
    captchaId: captchaId.value,
  });
}
</script>

<template>
  <AuthenticationLogin
    :form-schema="formSchema"
    :loading="authStore.loginLoading"
    @submit="handleSubmit"
  />
</template>
