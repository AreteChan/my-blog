import { customRef } from "vue";

export default function debounceRef(value, delay = 500) {
  let timeout
  return customRef((track, trigger) => {
    return {
      get() {
        track() // 依赖收集
        return value
      },
      set(newValue) {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
          value = newValue
          trigger() // 触发依赖更新
        }, delay)
      },
    }
  })
}

