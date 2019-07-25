import VNode from '../core/vnode'
import { Module } from '../type/module'

export type Classes = Record<string, string>

function updateClass(oldVnode: VNode, vnode: VNode): void {
  let cur: any,
    name: string,
    elm: Element = vnode.elm as Element,
    oldClass = oldVnode.data!.class,
    newClass = vnode.data!.class

  if (!oldClass && !newClass) return
  if (oldClass === newClass) return

  oldClass = oldClass || {}
  newClass = newClass || {}

  for (name in oldClass) {
    if (!newClass[name]) {
      elm.classList.remove(name)
    }
  }
  for (name in newClass) {
    // {className: boolean}
    cur = newClass[name]
    if (cur !== oldClass[name]) {
      elm.classList[cur ? 'add' : 'remove'](name)
    }
  }
}

export const classModlue = {
  create: updateClass,
  update: updateClass
} as Module
export default classModlue
