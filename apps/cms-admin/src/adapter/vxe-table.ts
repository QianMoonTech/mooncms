import type { VxeTableGridOptions } from '@vben/plugins/vxe-table';
import type { Recordable } from '@vben/types';

import { h, ref } from 'vue';

import { IconifyIcon } from '@vben/icons';
import { $te } from '@vben/locales';
import { setupVbenVxeTable, useVbenVxeGrid } from '@vben/plugins/vxe-table';
import { get, isFunction, isString } from '@vben/utils';

import { objectOmit } from '@vueuse/core';
import { ElButton, ElImage, ElPopover, ElSwitch, ElTag } from 'element-plus';

import { $t } from '#/locales';

import { useVbenForm } from './form';

setupVbenVxeTable({
  configVxeTable: (vxeUI) => {
    vxeUI.setConfig({
      grid: {
        align: 'center',
        border: false,
        columnConfig: {
          resizable: true,
        },
        minHeight: 180,
        formConfig: {
          // 全局禁用vxe-table的表单配置，使用formOptions
          enabled: false,
        },
        proxyConfig: {
          autoLoad: true,
          response: {
            result: 'items',
            total: 'total',
            list: 'items',
          },
          showActiveMsg: true,
          showResponseMsg: false,
        },
        round: true,
        showOverflow: true,
        size: 'small',
      } as VxeTableGridOptions,
    });

    /**
     * 解决vxeTable在热更新时可能会出错的问题
     */
    vxeUI.renderer.forEach((_item, key) => {
      if (key.startsWith('Cell')) {
        vxeUI.renderer.delete(key);
      }
    });

    // 表格配置项可以用 cellRender: { name: 'CellImage' },
    vxeUI.renderer.add('CellImage', {
      renderTableDefault(renderOpts, params) {
        const { props } = renderOpts;
        const { column, row } = params;
        const src = row[column.field];
        return h(ElImage, { src, previewSrcList: [src], ...props });
      },
    });

    // 表格配置项可以用 cellRender: { name: 'CellLink' },
    vxeUI.renderer.add('CellLink', {
      renderTableDefault(renderOpts) {
        const { props } = renderOpts;
        return h(
          ElButton,
          { size: 'small', link: true, type: 'primary' },
          { default: () => props?.text },
        );
      },
    });

    // 单元格渲染： Tag
    vxeUI.renderer.add('CellTag', {
      renderTableDefault({ options, props }, { column, row }) {
        const value = get(row, column.field);
        const tagOptions = options ?? [
          { type: 'success', label: $t('common.enabled'), value: 1 },
          { type: 'error', label: $t('common.disabled'), value: 0 },
        ];
        const tagItem = tagOptions.find((item) => item.value === value);
        return h(
          ElTag,
          {
            ...props,
            ...objectOmit(tagItem ?? {}, ['label']),
          },
          { default: () => tagItem?.label ?? value },
        );
      },
    });

    vxeUI.renderer.add('CellSwitch', {
      renderTableDefault({ attrs, props }, { column, row }) {
        const loadingKey = `__loading_${column.field}`;
        const finallyProps = {
          activeText: $t('common.enabled'),
          activeValue: 1,
          inactiveText: $t('common.disabled'),
          inactiveValue: 0,
          inlinePrompt: true,
          ...props,
          modelValue: row[column.field],
          loading: row[loadingKey] ?? false,
          'onUpdate:modelValue': onChange,
        };
        async function onChange(newVal: any) {
          row[loadingKey] = true;
          try {
            const result = await attrs?.beforeChange?.(newVal, row);
            if (result !== false) {
              row[column.field] = newVal;
            }
          } finally {
            row[loadingKey] = false;
          }
        }
        return h(ElSwitch, finallyProps);
      },
    });

    /**
     * 注册表格的操作按钮渲染器
     */
    vxeUI.renderer.add('CellOperation', {
      renderTableDefault({ attrs, options, props }, { column, row }) {
        const defaultProps = {
          size: 'small',
          link: true,
          type: 'primary',
          ...props,
        };
        let align = 'end';
        switch (column.align) {
          case 'center': {
            align = 'center';
            break;
          }
          case 'left': {
            align = 'start';
            break;
          }
          default: {
            align = 'end';
            break;
          }
        }
        const presets: Recordable<Recordable<any>> = {
          delete: {
            type: 'danger',
            text: $t('common.delete'),
          },
          edit: {
            text: $t('common.edit'),
          },
        };
        const operations: Array<Recordable<any>> = (
          options || ['edit', 'delete']
        )
          .map((opt) => {
            if (isString(opt)) {
              return presets[opt]
                ? { code: opt, ...defaultProps, ...presets[opt] }
                : {
                    code: opt,
                    ...defaultProps,
                    text: $te(`common.${opt}`) ? $t(`common.${opt}`) : opt,
                  };
            } else {
              return { ...defaultProps, ...presets[opt.code], ...opt };
            }
          })
          .map((opt) => {
            const optBtn: Recordable<any> = {};
            Object.keys(opt).forEach((key) => {
              optBtn[key] = isFunction(opt[key]) ? opt[key](row) : opt[key];
            });
            return optBtn;
          })
          .filter((opt) => opt.show !== false);

        function renderBtn(opt: Recordable<any>, listen = true) {
          const { text: _text, ...btnProps } = opt;
          return h(
            ElButton,
            {
              ...props,
              ...btnProps,
              icon: undefined,
              onClick: listen
                ? () =>
                    attrs?.onClick?.({
                      code: opt.code,
                      row,
                    })
                : undefined,
            },
            {
              default: () => {
                const content = [];
                if (opt.icon) {
                  content.push(
                    h(IconifyIcon, { class: 'size-5', icon: opt.icon }),
                  );
                }
                content.push(opt.text);
                return content;
              },
            },
          );
        }

        function renderConfirm(opt: Recordable<any>) {
          let viewportWrapper: HTMLElement | null = null;
          const popoverRef = ref<any>(null);
          return h(
            ElPopover,
            {
              /**
               * 当popover用在固定列中时，将固定列作为弹窗的容器时可能会因为固定列较窄而无法容纳弹窗
               * 将表格主体区域作为弹窗容器时又会因为固定列的层级较高而遮挡弹窗
               * 将body或者表格视口区域作为弹窗容器时又会导致弹窗无法跟随表格滚动。
               * 鉴于以上各种情况，一种折中的解决方案是弹出层展示时，禁止操作表格的滚动条。
               * 这样既解决了弹窗的遮挡问题，又不至于让弹窗随着表格的滚动而跑出视口区域。
               */
              ref: popoverRef,
              teleported: true,
              placement: 'top-start',
              title: $t('ui.actionTitle.delete', [attrs?.nameTitle || '']),
              width: 200,
              trigger: 'click',
              ...props,
              ...opt,
              onShow: () => {
                if (!viewportWrapper) {
                  viewportWrapper = document.querySelector(
                    '.vxe-table--viewport-wrapper',
                  );
                }
                // 当弹窗打开时，禁止表格的滚动
                viewportWrapper?.style.setProperty('pointer-events', 'none');
              },
              onHide: () => {
                // 弹窗关闭时恢复表格滚动
                viewportWrapper?.style.removeProperty('pointer-events');
              },
            },
            {
              reference: () => renderBtn({ ...opt }, false),
              default: () =>
                h('div', { class: 'flex flex-col gap-2' }, [
                  h(
                    'div',
                    { class: 'truncate text-sm' },
                    $t('ui.actionMessage.deleteConfirm', [
                      row[attrs?.nameField || 'name'],
                    ]),
                  ),
                  h('div', { class: 'flex justify-end gap-2' }, [
                    h(
                      ElButton,
                      {
                        size: 'small',
                        onClick: () => {
                          popoverRef.value?.hide();
                        },
                      },
                      () => $t('common.cancel'),
                    ),
                    h(
                      ElButton,
                      {
                        size: 'small',
                        type: 'primary',
                        onClick: () => {
                          popoverRef.value?.hide();
                          attrs?.onClick?.({
                            code: opt.code,
                            row,
                          });
                        },
                      },
                      () => $t('common.confirm'),
                    ),
                  ]),
                ]),
            },
          );
        }

        const btns = operations.map((opt) =>
          opt.code === 'delete' ? renderConfirm(opt) : renderBtn(opt),
        );
        return h(
          'div',
          {
            class: 'flex table-operations',
            style: { justifyContent: align },
          },
          btns,
        );
      },
    });

    // 这里可以自行扩展 vxe-table 的全局配置，比如自定义格式化
    // vxeUI.formats.add
  },
  useVbenForm,
});

export { useVbenVxeGrid };

export type * from '@vben/plugins/vxe-table';

// 导出 OnActionClickFn 和 OnActionClickParams 类型
export type OnActionClickFn<T = any> = (params: OnActionClickParams<T>) => void;

export interface OnActionClickParams<T = any> {
  code: string;
  row: T;
}
