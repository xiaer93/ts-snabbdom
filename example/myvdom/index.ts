import sdom, {h} from '../../src/index'

let patch = sdom()
let vnode1 = h('p', 'hello world!')
let vnode2 = h('p', [h('em', 'hello world, cjw')])
patch(document.querySelector('.container'), vnode1)

setTimeout(() => {
  patch(vnode1, vnode2)
}, 3000);