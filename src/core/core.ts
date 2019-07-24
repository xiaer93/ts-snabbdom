// import { VNode } from "../type";
import VNode from './vnode'
import api from './domApi'
import { isVNode, isUndef, isDef, isArray, isPrimitive } from '../helper/is'
import { createDiffieHellman } from 'crypto'

export default function() {
  let insertedVnodeQueue: Array<VNode> = []

  return function patch(oldVnode: VNode | Element, vnode: VNode) {
    if (oldVnode === null) {
      return
    }

    if (!isVNode(oldVnode)) {
      oldVnode = emptyNodeAt(oldVnode as Element)
    }

    createElm(vnode, insertedVnodeQueue)
    console.log(vnode)

    const elm = oldVnode.elm as Node
    const parent = api.parentNode(elm)

    if (parent !== null) {
      api.insertBefore(parent, vnode.elm!, api.nextSibling(elm))
    }

    return vnode
  }
}

// node->vnode
function emptyNodeAt(elm: Element): VNode {
  const id = elm.id ? `#${elm.id}` : ''
  const cls = elm.className ? elm.className.split(' ').join('.') : ''
  // 类型不符合？
  return new VNode(api.tagName(elm) + id + cls, {}, [], elm)
}

// 创建真实dom并挂载
function createElm(vnode: VNode, insertedVnodeQueue: Array<VNode>) {
  let children = vnode.children,
    sel = vnode.sel

  if (sel === '!') {
    // 注释节点
    if (isUndef(vnode.text)) {
      vnode.text = ''
    }
    vnode.elm = api.createComment(vnode.text)
  } else if (sel !== undefined) {
    // 元素节点
    const hashIdx = sel.indexOf('#')
    const dotIdx = sel.indexOf('.', hashIdx)
    const hash = hashIdx > 0 ? hashIdx : sel.length
    const dot = dotIdx > 0 ? dotIdx : sel.length
    const tag = hashIdx !== -1 || dotIdx !== -1 ? sel.slice(0, Math.min(hash, dot)) : sel
    const elm = (vnode.elm = api.createElement(tag))

    if (hash < dot) elm.setAttribute('id', sel.slice(hash + 1, dot))
    if (dotIdx > 0) elm.setAttribute('class', sel.slice(dot + 1).replace(/\./gi, ' '))

    if (isArray(vnode.children)) {
      for (let ch of vnode.children!) {
        if (ch !== null) {
          // fixme: vh可能是字符串呀
          api.appendChild(elm, createElm(ch, insertedVnodeQueue))
        }
      }
    } else if (isPrimitive(vnode.text)) {
      api.appendChild(elm, api.createTextNode(vnode.text))
    }
  } else {
    // 文本节点
    vnode.elm = api.createTextNode(vnode.text!)
  }

  return vnode.elm
}
