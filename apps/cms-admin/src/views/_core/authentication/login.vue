<script lang="ts" setup>
import type { VbenFormSchema } from '@vben/common-ui';
import type { BasicOption } from '@vben/types';

import { computed, defineComponent, h, onMounted, ref } from 'vue';

import { AuthenticationLogin, z } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { getCaptchaApi } from '#/api';
import { useAuthStore } from '#/store';

defineOptions({ name: 'Login' });

const authStore = useAuthStore();

const captchaId = ref('');
const captchaImg = ref('');
const captchaLoading = ref(false);

const MOCK_USER_OPTIONS: BasicOption[] = [
  {
    label: 'Super',
    value: 'vben',
  },
  {
    label: 'Admin',
    value: 'admin',
  },
  {
    label: 'User',
    value: 'jack',
  },
];

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

const formSchema = computed((): VbenFormSchema[] => {
  return [
    {
      component: 'VbenSelect',
      componentProps: {
        options: MOCK_USER_OPTIONS,
        placeholder: $t('authentication.selectAccount'),
      },
      fieldName: 'selectAccount',
      label: $t('authentication.selectAccount'),
      rules: z
        .string()
        .min(1, { message: $t('authentication.selectAccount') })
        .optional()
        .default('vben'),
    },
    {
      component: 'VbenInput',
      componentProps: {
        placeholder: $t('authentication.usernameTip'),
      },
      dependencies: {
        trigger(values, form) {
          if (values.selectAccount) {
            const findUser = MOCK_USER_OPTIONS.find(
              (item) => item.value === values.selectAccount,
            );
            if (findUser) {
              form.setValues({
                password: '123456',
                username: findUser.value,
              });
            }
          }
        },
        triggerFields: ['selectAccount'],
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
});

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
