import sdom, {h} from '../../src/index'

let patch = sdom()
let vnode1 = h('p', 'hello world!')
patch(document.querySelector('.container'), vnode1)