// filepath: src/components/Icon/test_SvgIcon.vue
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SvgIcon from '../SvgIcon.vue'

describe('SvgIcon.vue', () => {
  it('renders with default props', () => {
    const wrapper = mount(SvgIcon)
    expect(wrapper.props('width')).toBe(24)
    expect(wrapper.props('height')).toBe(24)
    expect(wrapper.props('fill')).toBe('currentColor')
    expect(wrapper.props('classes')).toBe('')
    expect(wrapper.props('styles')).toEqual({})
  })

  it('renders with custom props', () => {
    const wrapper = mount(SvgIcon, {
      props: {
        width: 48,
        height: 48,
        fill: '#000',
        classes: 'custom-class',
        styles: { color: 'red' },
      },
    })
    expect(wrapper.props('width')).toBe(48)
    expect(wrapper.props('height')).toBe(48)
    expect(wrapper.props('fill')).toBe('#000')
    expect(wrapper.props('classes')).toBe('custom-class')
    expect(wrapper.props('styles')).toEqual({ color: 'red' })
  })

  it('renders slot content', () => {
    const wrapper = mount(SvgIcon, {
      slots: {
        default: '<svg><circle cx="12" cy="12" r="10" /></svg>',
      },
    })
    const html = wrapper.html().replace(/>\s+</g, '><') // wrapper may add some spaces between tags
    expect(html).toContain('<svg><circle cx="12" cy="12" r="10"></circle></svg>')
  })
})
