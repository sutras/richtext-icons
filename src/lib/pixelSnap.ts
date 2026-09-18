import { onBeforeUnmount, onMounted, watch, type Ref } from 'vue'

/**
 * 像素吸附：把 [data-pixel-snap] 元素的渲染位置校正到整数 CSS 像素。
 *
 * 背景：图标笔画普遍不足 2px，当布局把图标落在小数像素上时
 * （1fr 网格轨道、字体行高等都会产生小数坐标），抗锯齿会把
 * 边缘涂抹到相邻像素上 —— 斜线和圆弧看起来发虚、有毛边。
 * 吸附后描边边缘可以落在完整的物理像素上，观感明显更锐利。
 *
 * 原理：测量元素相对文档的布局位置（剔除滚动偏移，滚动不改变布局），
 * 用 transform 补偿到最近的整数像素。transform 不参与布局，不会引起回流。
 */
const SEL = '[data-pixel-snap]'

let observer: ResizeObserver | null = null
let raf = 0

function snapOne(el: HTMLElement) {
  el.style.transform = ''
  const r = el.getBoundingClientRect()
  // 视口坐标 + 各级可滚动祖先的滚动量 = 文档布局坐标
  let sx = window.scrollX
  let sy = window.scrollY
  for (let p = el.parentElement; p; p = p.parentElement) {
    if (p.scrollWidth > p.clientWidth || p.scrollHeight > p.clientHeight) {
      sx += p.scrollLeft
      sy += p.scrollTop
    }
  }
  const dx = Math.round(r.x + sx) - (r.x + sx)
  const dy = Math.round(r.y + sy) - (r.y + sy)
  if (dx || dy) el.style.transform = `translate(${dx}px, ${dy}px)`
}

function snapAll() {
  cancelAnimationFrame(raf)
  raf = requestAnimationFrame(() => {
    document.querySelectorAll<HTMLElement>(SEL).forEach(snapOne)
  })
}

/** 供 App.vue 使用的便捷封装：挂载后自动吸附，并监听状态变化重新吸附 */
export function usePixelSnap(triggers: Array<Ref<unknown> | (() => unknown)> = []) {
  onMounted(() => {
    if (!observer) {
      observer = new ResizeObserver(snapAll)
      observer.observe(document.body)
      document.fonts?.ready.then(snapAll).catch(() => {})
      window.addEventListener('resize', snapAll)
    }
    snapAll()
  })

  if (triggers.length) watch(triggers, () => snapAll())

  onBeforeUnmount(() => {
    observer?.disconnect()
    observer = null
    window.removeEventListener('resize', snapAll)
    cancelAnimationFrame(raf)
  })
}
