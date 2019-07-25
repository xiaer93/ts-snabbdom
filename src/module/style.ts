import VNode from '../core/vnode'
import { Module } from '../type/module'

//  ['create', 'update', 'remove', 'destroy', 'pre', 'post']

export type VNodeStyle = Record<string, string> & {
  delayed?: Record<string, string>
  remove?: Record<string, string>
  // fixme： 为什么没有destroy
  destroy?: Record<string, string>
}

const raf =
  (typeof window !== 'undefined' && window.requestAnimationFrame.bind(window)) || setTimeout
const nextFrame = (fn: () => void) =>
  raf(function() {
    raf(fn)
  })
let reflowForced = false

// 等待两次requestAnimationFrame之后执行
function setNextFrame(obj: any, prop: string, val: any): void {
  nextFrame(function() {
    obj[prop] = val
  })
}

// 更新样式
// same-node才进行样式更新
function updateStyle(oldVnode: VNode, vnode: VNode): void {
  let cur: any,
    name: string,
    elm = vnode.elm,
    oldStyle = oldVnode.data!.style,
    style = vnode.data!.style

  if (!oldStyle && !style) return
  if (oldStyle === style) return

  oldStyle = oldStyle || ({} as VNodeStyle)
  style = style || ({} as VNodeStyle)
  let oldHasDelayed = 'delayed' in oldStyle

  // 遍历旧的style属性
  for (name in oldStyle) {
    if (!style[name]) {
      if (name[0] === '-' && name[1] === '-') {
        // Node上没有style属性！！！
        ;(elm as any).style.removeProperty(name)
      } else {
        ;(elm as any).style[name] = ''
      }
    }
  }
  // 遍历新的style属性
  for (name in style) {
    cur = style[name]
    if (name === 'delayed' && style.delayed) {
      // delayed动画
      for (let name2 in style.delayed) {
        cur = style.delayed[name2]
        // 1. 老节点没有delayed则直接更新；2. 老节点有delayed属性，则判断同属性的值是否相同，不相同则更新
        if (!oldHasDelayed || cur !== oldStyle.delayed![name2]) {
          setNextFrame((elm as any).style, name2, cur)
        }
      }
    } else if (name !== 'remove' && cur !== oldStyle[name]) {
      // 属性更新
      if (name[0] === '-' && name[1] === '-') {
        ;(elm as any).style.setProperty(name, cur)
      } else {
        ;(elm as any).style[name] = cur
      }
    }
  }
}

function removeStyle(vnode: VNode, rm: () => void) {
  let s = vnode.data!.style
  // 没有设定样式，或没有设定remove函数
  if (!s || !s.remove) {
    rm()
    return
  }

  // 强制重排？？？， 方便开启remove动画????(remove事件，都是发生在移除子节点时候呀，)??
  // fixme: 此处代码有什么用啊？？？？
  if (!reflowForced) {
    getComputedStyle(document.body).transform
    reflowForced = true
  }

  let name: string,
    elm = vnode.elm,
    i = 0,
    compStyle: CSSStyleDeclaration,
    style = s.remove,
    amount = 0,
    applied: Array<string> = []

  // 设定属性
  for (name in style) {
    applied.push(name)
    ;(elm as any).style[name] = style[name]
  }

  compStyle = getComputedStyle(elm as Element)
  let props = (compStyle as any)['transition-property'].split(', ')
  // 属性名称必须相等，如margin属性动画，就不能使用marginTop等
  for (; i < props.length; ++i) {
    if (applied.includes(props[i])) {
      amount++
    }
  }

  // TransitionEvent类型报错？？？
  ;(elm as Element).addEventListener('transitionend', function(evt: Event) {
    if (evt.target === elm) --amount
    if (amount === 0) {
      rm()
    }
  })
}

// 直接设定他等于销毁属性，destroy事件时remove事件触发的。remove的强制更新是初始destroy属性添加上去？
function destroyStyle(vnode: VNode) {
  let style: any,
    name: string,
    elm = vnode.elm,
    s = vnode.data!.style

  if (!s || !(style = s.destroy)) return
  for (name in style) {
    ;(elm as any).style[name] = style[name]
  }
}

function forceReflow() {
  reflowForced = false
}

export const styleModule = {
  pre: forceReflow,
  create: updateStyle,
  update: updateStyle,
  destroy: destroyStyle,
  remove: removeStyle
} as Module

export default styleModule
