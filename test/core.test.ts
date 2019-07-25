import snabbdom from '../src/index'
import classModule from '../src/module/class'
import { h } from '../src/core/h'

/**
 * Dummy test
 */
describe('Dummy test', () => {
  it('works if true is truthy', () => {
    expect(true).toBeTruthy()
  })
})

/**
 * core
 */
// 1. 检查h函数，重载函数
const patch = snabbdom([classModule])

describe('snabbdom', function() {
  let elm, vnode0: any
  beforeEach(function() {
    elm = document.createElement('div')
    vnode0 = elm
  })

  describe('hyperscript', function() {
    it('can create vnode with proper tag', function() {
      expect(h('div').sel).toBe('div')
      expect(h('a').sel).toBe('a')
    })
    it('can create vnode with children', function() {
      let vnode = h('div', [h('span#hello'), h('b.world')])
      expect(vnode.sel).toBe('div')
      expect(vnode.children![0].sel).toBe('span#hello')
      expect(vnode.children![1].sel).toBe('b.world')
    })
    it('can create vnode with one child vnode', function() {
      let vnode = h('div', h('span#hello'))
      expect(vnode.sel).toBe('div')
      expect(vnode.children![0].sel).toBe('span#hello')
    })
    it('can create vnode with props and one child vnode', function() {
      let vnode = h('div', {}, h('span#hello'))
      expect(vnode.sel).toBe('div')
      expect(vnode.children![0].sel).toBe('span#hello')
    })
    it('can create vnode with text content', function() {
      let vnode = h('a', ['abcde'])
      expect(vnode.children![0].text).toBe('abcde')
    })
    it('can create vnode with text content in string', function() {
      let vnode = h('a', 'abcde')
      expect(vnode.text).toBe('abcde')
    })
    it('can create vnode with props and text content in string', function() {
      let vnode = h('div', {}, 'abcde')
      expect(vnode.text).toBe('abcde')
    })
    it('can create vnode for comment', function() {
      let vnode = h('!', 'test')
      expect(vnode.sel).toBe('!')
      expect(vnode.text).toBe('test')
    })
  })

  describe('created element', function() {
    it('has tag', function() {
      elm = patch(vnode0, h('div')).elm as Element
      expect(elm.tagName).toBe('DIV')
    })
    it('has different tag and id', function() {
      let elm: any = document.createElement('div')
      vnode0.appendChild(elm)
      let vnode1 = h('span#id')
      elm = patch(elm, vnode1).elm
      expect(elm.tagName).toBe('SPAN')
      expect(elm.id).toBe('id')
    })
    it('has id', function() {
      elm = patch(vnode0, h('div', [h('div#unique')])).elm
      console.log(elm)
      // fixme: 写测试，中间的ts也需要处理？？？
      if (elm !== null) {
        expect((elm as Element).firstElementChild.id).toBe('#unique')
      }
    })
    it('receives classes in selector', function() {
      elm = patch(vnode0, h('div', [h('i.am.a.class')])).elm
      expect(elm.firstElementChild.classList).toContain('am')
      expect(elm.firstElementChild.classList).toContain('a')
      expect(elm.firstElementChild.classList).toContain('class')
    })
  })
})
