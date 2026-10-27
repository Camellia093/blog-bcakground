import type { RouteMeta } from 'vue-router'
// 1. 修复包路径
import { Icon } from '@/components'

export const useRenderMenuTitle = () => {
  const renderMenuTitle = (meta: RouteMeta) => {
    const { title = 'Please set title', icon } = meta

    // 3. 直接把 title 渲染出来，去掉 t()
    return icon ? (
      <>
        <Icon icon={meta.icon}></Icon>
        <span class="v-menu__title truncate">{title as string}</span>
      </>
    ) : (
      <span class="v-menu__title truncate">{title as string}</span>
    )
  }

  return {
    renderMenuTitle
  }
}