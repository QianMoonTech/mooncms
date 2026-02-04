/**
 * 通用组件共同的使用的基础组件，原先放在 adapter/form 内部，限制了使用范围，这里提取出来，方便其他地方使用
 * 可用于 vben-form、vben-modal、vben-drawer 等组件使用,
 */

/* eslint-disable vue/one-component-per-file */

import type { Component } from 'vue';

import type { BaseFormComponentType } from '@vben/common-ui';
import type { Recordable } from '@vben/types';

import {
  computed,
  defineAsyncComponent,
  defineComponent,
  h,
  ref,
  render,
  watch,
} from 'vue';

import {
  ApiComponent,
  globalShareState,
  IconPicker,
  VCropper,
} from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';
import { $t } from '@vben/locales';
import { isEmpty } from '@vben/utils';

import {
  ElAutocomplete,
  ElButton,
  ElCard,
  ElCascader,
  ElCheckbox,
  ElCheckboxButton,
  ElCheckboxGroup,
  ElDatePicker,
  ElDivider,
  ElImage,
  ElInput,
  ElInputNumber,
  ElLoading,
  ElMention,
  ElMessage,
  ElNotification,
  ElRadio,
  ElRadioButton,
  ElRadioGroup,
  ElRate,
  ElSelectV2,
  ElSpace,
  ElSwitch,
  ElTag,
  ElTimePicker,
  ElTreeSelect,
  ElUpload,
} from 'element-plus';

const withDefaultPlaceholder = <T extends Component>(
  component: T,
  type: 'input' | 'select',
  componentProps: Recordable<any> = {},
) => {
  return defineComponent({
    name: component.name,
    inheritAttrs: false,
    setup: (props: any, { attrs, expose, slots }) => {
      const placeholder =
        props?.placeholder ||
        attrs?.placeholder ||
        $t(`ui.placeholder.${type}`);
      // 透传组件暴露的方法
      const innerRef = ref();
      expose(
        new Proxy(
          {},
          {
            get: (_target, key) => innerRef.value?.[key],
            has: (_target, key) => key in (innerRef.value || {}),
          },
        ),
      );
      return () =>
        h(
          component,
          { ...componentProps, placeholder, ...props, ...attrs, ref: innerRef },
          slots,
        );
    },
  });
};

const withPreviewUpload = () => {
  // 检查是否为图片文件的辅助函数
  const isImageFile = (file: any): boolean => {
    const imageExtensions = new Set([
      'bmp',
      'gif',
      'jpeg',
      'jpg',
      'png',
      'svg',
      'webp',
    ]);
    if (file.url) {
      try {
        const pathname = new URL(file.url, 'http://localhost').pathname;
        const ext = pathname.split('.').pop()?.toLowerCase();
        return ext ? imageExtensions.has(ext) : false;
      } catch {
        const ext = file.url?.split('.').pop()?.toLowerCase();
        return ext ? imageExtensions.has(ext) : false;
      }
    }
    if (!file.type && file.name) {
      const ext = file.name?.split('.').pop()?.toLowerCase();
      return ext ? imageExtensions.has(ext) : false;
    }
    return file.type?.startsWith('image/') ?? false;
  };

  // 创建默认的上传按钮插槽
  const createDefaultSlotsWithUpload = (
    listType: string,
    placeholder: string,
  ) => {
    switch (listType) {
      case 'picture-card': {
        return {
          default: () =>
            h(
              'div',
              { class: 'flex flex-col items-center justify-center' },
              [
                h(IconifyIcon, {
                  icon: 'ant-design:plus-outlined',
                  class: 'mb-1 size-5',
                }),
                h('span', { class: 'text-xs' }, placeholder),
              ],
            ),
        };
      }
      default: {
        return {
          default: () =>
            h(
              ElButton,
              {
                type: 'primary',
              },
              () => [
                h(IconifyIcon, {
                  icon: 'ant-design:upload-outlined',
                  class: 'mr-1 size-4',
                }),
                placeholder,
              ],
            ),
        };
      }
    }
  };

  // 图片裁剪操作
  const cropImage = (file: File, aspectRatio: string | undefined) => {
    return new Promise((resolve, reject) => {
      const container: HTMLElement | null = document.createElement('div');
      document.body.append(container);

      // 用于追踪组件是否已卸载
      let isUnmounted = false;
      let objectUrl: null | string = null;

      const open = ref<boolean>(true);
      const cropperRef = ref<InstanceType<typeof VCropper> | null>(null);

      const closeModal = () => {
        open.value = false;
        // 延迟清理，确保动画完成
        setTimeout(() => {
          if (!isUnmounted && container) {
            if (objectUrl) {
              URL.revokeObjectURL(objectUrl);
            }
            isUnmounted = true;
            render(null, container);
            container.remove();
          }
        }, 300);
      };

      const CropperWrapper = {
        setup() {
          return () => {
            if (isUnmounted) return null;
            if (!objectUrl) {
              objectUrl = URL.createObjectURL(file);
            }
            return h(
              ElDialog,
              {
                modelValue: open.value,
                title: `${$t('ui.crop.title')}${aspectRatio ? ` ${$t('ui.crop.titleTip', [aspectRatio])}` : ''}`,
                width: '548px',
                closeOnClickModal: false,
                closeOnPressEscape: false,
                showClose: false,
                destroyOnClose: true,
              },
              {
                default: () =>
                  h(VCropper, {
                    ref: (ref: any) => (cropperRef.value = ref),
                    img: objectUrl as string,
                    aspectRatio,
                  }),
                footer: () =>
                  h(
                    'div',
                    { class: 'flex justify-end gap-2' },
                    [
                      h(
                        ElButton,
                        {
                          onClick: () => {
                            resolve('');
                            closeModal();
                          },
                        },
                        () => $t('common.cancel'),
                      ),
                      h(
                        ElButton,
                        {
                          type: 'primary',
                          onClick: async () => {
                            const cropper = cropperRef.value;
                            if (!cropper) {
                              reject(new Error('Cropper not found'));
                              closeModal();
                              return;
                            }
                            try {
                              const dataUrl = await cropper.getCropImage();
                              resolve(dataUrl);
                            } catch {
                              reject(new Error($t('ui.crop.errorTip')));
                            } finally {
                              closeModal();
                            }
                          },
                        },
                        () => $t('ui.crop.confirm'),
                      ),
                    ],
                  ),
              },
            );
          };
        },
      };

      render(h(CropperWrapper), container);
    });
  };

  // 导入 ElDialog
  const ElDialog = defineAsyncComponent(() =>
    Promise.all([
      import('element-plus/es/components/dialog/index'),
      import('element-plus/es/components/dialog/style/css'),
    ]).then(([res]) => res.ElDialog),
  );

  return defineComponent({
    name: 'Upload',
    emits: ['update:modelValue'],
    setup: (
      props: any,
      { attrs, slots, emit }: { attrs: any; emit: any; slots: any },
    ) => {
      const fileList = ref<any[]>(attrs?.fileList || attrs?.['file-list'] || []);

      const maxSize = computed(() => attrs?.maxSize ?? attrs?.['max-size']);
      const aspectRatio = computed(
        () => attrs?.aspectRatio ?? attrs?.['aspect-ratio'],
      );

      const handleBeforeUpload = async (rawFile: File) => {
        if (maxSize.value && rawFile.size / 1024 / 1024 > maxSize.value) {
          ElMessage.error($t('ui.formRules.sizeLimit', [maxSize.value]));
          return false;
        }
        // 裁剪功能
        if (attrs.crop && !attrs.multiple && isImageFile({ ...rawFile, name: rawFile.name, type: rawFile.type })) {
          const blob = await cropImage(rawFile, aspectRatio.value);
          if (!blob) {
            return false;
          }
          // 将裁剪后的数据转换为 File
          const response = await fetch(blob as string);
          const blobData = await response.blob();
          const croppedFile = new File([blobData], rawFile.name, { type: rawFile.type });
          return croppedFile;
        }

        return attrs.beforeUpload?.(rawFile) ?? true;
      };

      const handleChange = (uploadFile: any, uploadFiles: any[]) => {
        try {
          // 行内写法 handleChange: (event) => {}
          attrs.handleChange?.({ file: uploadFile, fileList: uploadFiles });
          // template写法 @handle-change="(event) => {}"
          attrs.onHandleChange?.({ file: uploadFile, fileList: uploadFiles });
        } catch (error) {
          // Avoid breaking internal v-model sync on user handler errors
          console.error(error);
        }
        fileList.value = uploadFiles.filter(
          (file) => file.status !== 'removed',
        );
        emit(
          'update:modelValue',
          uploadFiles?.length ? fileList.value : undefined,
        );
      };

      const handlePreview = async (uploadFile: any) => {
        // 如果当前文件不是图片，直接打开
        if (!isImageFile(uploadFile)) {
          if (uploadFile.url) {
            window.open(uploadFile.url, '_blank');
          } else if (uploadFile.response?.url) {
            window.open(uploadFile.response.url, '_blank');
          } else {
            ElMessage.error($t('ui.formRules.previewWarning'));
          }
          return;
        }

        // 对于图片文件，使用预览
        const imageFiles = fileList.value.filter((file) => isImageFile(file));
        const currentIndex = imageFiles.findIndex(
          (f) => f.uid === uploadFile.uid,
        );

        // 简单的图片预览实现
        const previewContainer = document.createElement('div');
        document.body.append(previewContainer);

        let isUnmounted = false;
        const previewVisible = ref(true);

        const PreviewWrapper = {
          setup() {
            return () =>
              h(
                ElDialog,
                {
                  modelValue: previewVisible.value,
                  width: '80%',
                  destroyOnClose: true,
                  'onUpdate:modelValue': (val: boolean) => {
                    previewVisible.value = val;
                    if (!val) {
                      setTimeout(() => {
                        if (!isUnmounted && previewContainer) {
                          isUnmounted = true;
                          render(null, previewContainer);
                          previewContainer.remove();
                        }
                      }, 300);
                    }
                  },
                },
                {
                  default: () =>
                    h(
                      'div',
                      { class: 'flex justify-center' },
                      imageFiles.map((imgFile, index) =>
                        h(ElImage, {
                          key: imgFile.uid,
                          src: imgFile.url || imgFile.response?.url,
                          class: index === currentIndex ? '' : 'hidden',
                          previewSrcList: imageFiles.map(
                            (f) => f.url || f.response?.url,
                          ),
                          initialIndex: currentIndex,
                          previewTeleported: true,
                        }),
                      ),
                    ),
                },
              );
          },
        };

        render(h(PreviewWrapper), previewContainer);
      };

      const renderUploadButton = (): any => {
        const isDisabled = attrs.disabled;
        const listType = attrs?.listType || attrs?.['list-type'] || 'text';

        // 如果禁用，不渲染上传按钮
        if (isDisabled) {
          return null;
        }

        // 否则渲染默认上传按钮
        return isEmpty(slots)
          ? createDefaultSlotsWithUpload(
              listType,
              attrs?.placeholder || $t(`ui.placeholder.upload`),
            )
          : slots;
      };

      // 可以监听到表单API设置的值
      watch(
        () => attrs.modelValue,
        (res) => {
          fileList.value = res || [];
        },
      );

      return () =>
        h(
          ElUpload,
          {
            ...props,
            ...attrs,
            fileList: fileList.value,
            beforeUpload: handleBeforeUpload,
            onChange: handleChange,
            onPreview: handlePreview,
          },
          renderUploadButton(),
        );
    },
  });
};

// 这里需要自行根据业务组件库进行适配，需要用到的组件都需要在这里类型说明
export type ComponentType =
  | 'ApiCascader'
  | 'ApiSelect'
  | 'ApiTreeSelect'
  | 'AutoComplete'
  | 'Cascader'
  | 'Card'
  | 'Checkbox'
  | 'CheckboxGroup'
  | 'DatePicker'
  | 'DefaultButton'
  | 'Divider'
  | 'IconPicker'
  | 'Input'
  | 'InputNumber'
  | 'InputPassword'
  | 'Mentions'
  | 'PrimaryButton'
  | 'Radio'
  | 'RadioGroup'
  | 'RangePicker'
  | 'Rate'
  | 'Select'
  | 'Space'
  | 'Spin'
  | 'Switch'
  | 'Tag'
  | 'Textarea'
  | 'TimePicker'
  | 'TreeSelect'
  | 'Upload'
  | BaseFormComponentType;

async function initComponentAdapter() {
  const components: Partial<Record<ComponentType, Component>> = {
    // 如果你的组件体积比较大，可以使用异步加载
    // Button: () =>
    // import('xxx').then((res) => res.Button),

    ApiCascader: withDefaultPlaceholder(
      {
        ...ApiComponent,
        name: 'ApiCascader',
      },
      'select',
      {
        component: ElCascader,
        props: { label: 'label', value: 'value', children: 'children' },
        loadingSlot: 'loading',
        modelPropName: 'modelValue',
        visibleEvent: 'onVisibleChange',
      },
    ),
    ApiSelect: withDefaultPlaceholder(
      {
        ...ApiComponent,
        name: 'ApiSelect',
      },
      'select',
      {
        component: ElSelectV2,
        loadingSlot: 'loading',
        visibleEvent: 'onVisibleChange',
      },
    ),
    ApiTreeSelect: withDefaultPlaceholder(
      {
        ...ApiComponent,
        name: 'ApiTreeSelect',
      },
      'select',
      {
        component: ElTreeSelect,
        props: { label: 'label', children: 'children' },
        nodeKey: 'value',
        loadingSlot: 'loading',
        optionsPropName: 'data',
        visibleEvent: 'onVisibleChange',
      },
    ),
    AutoComplete: withDefaultPlaceholder(ElAutocomplete, 'input'),
    Card: ElCard,
    Cascader: withDefaultPlaceholder(ElCascader, 'select'),
    Checkbox: ElCheckbox,
    CheckboxGroup: (props, { attrs, slots }) => {
      let defaultSlot;
      if (Reflect.has(slots, 'default')) {
        defaultSlot = slots.default;
      } else {
        const { options, isButton } = attrs;
        if (Array.isArray(options)) {
          defaultSlot = () =>
            options.map((option) =>
              h(isButton ? ElCheckboxButton : ElCheckbox, option),
            );
        }
      }
      return h(
        ElCheckboxGroup,
        { ...props, ...attrs },
        { ...slots, default: defaultSlot },
      );
    },
    DatePicker: (props, { attrs, slots }) => {
      const { name, id, type } = props;
      const extraProps: Recordable<any> = {};
      if (type && type.includes('range')) {
        if (name && !Array.isArray(name)) {
          extraProps.name = [name, `${name}_end`];
        }
        if (id && !Array.isArray(id)) {
          extraProps.id = [id, `${id}_end`];
        }
      }
      return h(
        ElDatePicker,
        {
          ...props,
          ...attrs,
          ...extraProps,
        },
        slots,
      );
    },
    // 自定义默认按钮
    DefaultButton: (props, { attrs, slots }) => {
      return h(ElButton, { ...props, ...attrs, type: 'info' }, slots);
    },
    Divider: ElDivider,
    IconPicker: withDefaultPlaceholder(IconPicker, 'select', {
      iconSlot: 'append',
      modelValueProp: 'modelValue',
      inputComponent: ElInput,
    }),
    Input: withDefaultPlaceholder(ElInput, 'input'),
    InputNumber: withDefaultPlaceholder(ElInputNumber, 'input'),
    InputPassword: withDefaultPlaceholder(
      {
        ...ElInput,
        name: 'InputPassword',
      },
      'input',
      { type: 'password', showPassword: true },
    ),
    Mentions: withDefaultPlaceholder(ElMention, 'input'),
    // 自定义主要按钮
    PrimaryButton: (props, { attrs, slots }) => {
      return h(ElButton, { ...props, ...attrs, type: 'primary' }, slots);
    },
    Radio: ElRadio,
    RadioGroup: (props, { attrs, slots }) => {
      let defaultSlot;
      if (Reflect.has(slots, 'default')) {
        defaultSlot = slots.default;
      } else {
        const { options } = attrs;
        if (Array.isArray(options)) {
          defaultSlot = () =>
            options.map((option) =>
              h(attrs.isButton ? ElRadioButton : ElRadio, option),
            );
        }
      }
      return h(
        ElRadioGroup,
        { ...props, ...attrs },
        { ...slots, default: defaultSlot },
      );
    },
    RangePicker: (props, { attrs, slots }) => {
      const { name, id } = props;
      const extraProps: Recordable<any> = {};
      if (name && !Array.isArray(name)) {
        extraProps.name = [name, `${name}_end`];
      }
      if (id && !Array.isArray(id)) {
        extraProps.id = [id, `${id}_end`];
      }
      return h(
        ElDatePicker,
        {
          ...props,
          ...attrs,
          type: 'daterange',
          ...extraProps,
        },
        slots,
      );
    },
    Rate: ElRate,
    Select: (props, { attrs, slots }) => {
      return h(ElSelectV2, { ...props, ...attrs }, slots);
    },
    Space: ElSpace,
    Spin: ElLoading,
    Switch: ElSwitch,
    Tag: ElTag,
    Textarea: withDefaultPlaceholder(
      {
        ...ElInput,
        name: 'Textarea',
      },
      'input',
      { type: 'textarea' },
    ),
    TimePicker: (props, { attrs, slots }) => {
      const { name, id, isRange } = props;
      const extraProps: Recordable<any> = {};
      if (isRange) {
        if (name && !Array.isArray(name)) {
          extraProps.name = [name, `${name}_end`];
        }
        if (id && !Array.isArray(id)) {
          extraProps.id = [id, `${id}_end`];
        }
      }
      return h(
        ElTimePicker,
        {
          ...props,
          ...attrs,
          ...extraProps,
        },
        slots,
      );
    },
    TreeSelect: withDefaultPlaceholder(ElTreeSelect, 'select'),
    Upload: withPreviewUpload(),
  };

  // 将组件注册到全局共享状态中
  globalShareState.setComponents(components);

  // 定义全局共享状态中的消息提示
  globalShareState.defineMessage({
    // 复制成功消息提示
    copyPreferencesSuccess: (title, content) => {
      ElNotification({
        title,
        message: content,
        position: 'bottom-right',
        duration: 0,
        type: 'success',
      });
    },
  });
}

export { initComponentAdapter };
