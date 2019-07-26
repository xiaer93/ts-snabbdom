import VNode from '../core/vnode'

export type On = {
  [N in keyof HTMLElementEventMap]?: (ev: HTMLBodyElementEventMap[N]) => void
} & {
  [event: string]: EventListener
}

function updateEventListeners(oldVnode: VNode, vnode?: VNode) {
  let oldOn = oldVnode.data!.on,
    oldListener = oldVnode.listener,
    oldElm: Element = oldVnode.elm as Element,
    on = vnode && vnode.data!.on,
    elm: Element = vnode && (vnode.elm as Element),
    name: string

  if (oldOn === on) {
    return
  }

  if (oldOn && oldListener) {
    if (!on) {
      for (name in oldOn) {
        oldElm.removeEventListener(name, oldListener, false)
      }
    } else {
      for (name in oldOn) {
        if (!on[name]) {
          oldElm.removeEventListener(name, oldListener, false)
        }
      }
    }
  }

  if (on) {
    let listener = (vnode.listener = oldListener.listener || createListener())
    listener.vnode = vnode

    if (!oldOn) {
      for (name in on) {
        elm.addEventListener(name, listener, false)
      }
    } else {
      for (name in on) {
        if (!oldOn[name]) {
          elm.addEventListener(name, listener, false)
        }
      }
    }
  }
}

// 创建监听器
function createListener() {
  return function handler(e: Event) {
    // 传递vnode
    // fixme: 在vue中，通过绑定属性传递值非常多，这是一种好的方式吗？
    handleEvent(e, (handler as any).vnode)
  }
}

// 执行器handleEvent
function handleEvent(e: Event, vnode: VNode) {
  let name = e.type,
    on = vnode.data.on

  if (on && on[name]) {
    invokeHandler(on[name], vnode, e)
  }
}

// 执行具体绑定的事件
function invokeHandler(handler: any, vnode: VNode, e?: Event) {
  if (typeof handler === 'function') {
    handler.call(vnode, event, vnode)
  } else if (typeof handler === 'object') {
    if (typeof handler[0] === 'function') {
      if (handler.length === 2) {
        handler[0].call(vnode, handler[1], event, vnode)
      } else {
        let args = handler.slice(1)
        args.push(event)
        args.push(vnode)
        handler[0].apply(vnode, args)
      }
    } else {
      // 递归执行handler
      for (let i = 0; i < handler.length; ++i) {
        invokeHandler(handler[i], vnode, event)
      }
    }
  }
}
