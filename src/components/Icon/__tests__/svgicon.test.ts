import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import SvgIcon from '../SvgIcon.vue'

describe('SvgIcon.vue', () => {
  it('renders with default props', () => {
    const wrapper = mount(SvgIcon)
    expect(wrapper.props('width')).toBe(24)
    expect(wrapper.props('height')).toBe(24)
    expect(wrapper.props('fill')).toBe('currentColor')
  })

  it('renders with custom props', () => {
    const wrapper = mount(SvgIcon, {
      props: {
        width: 48,
        height: 48,
        fill: '#000',
      },
    })
    expect(wrapper.props('width')).toBe(48)
    expect(wrapper.props('height')).toBe(48)
    expect(wrapper.props('fill')).toBe('#000')
  })

  it('renders slot content', () => {
    const wrapper = mount(SvgIcon, {
      slots: {
        default: '<svg><circle cx="12" cy="12" r="10" /></svg>',
      },
    })
    const html = wrapper.html({ raw: true })
    expect(html).toContain('<svg><circle cx="12" cy="12" r="10"></circle></svg>')
  })

  it('renders a component that extends it', () => {
    const custom = defineComponent({
      name: 'CustomSvgIcon',
      extends: SvgIcon, // Inherit from SvgIcon
      template: `
        <svg
          xmlns="http://www.w3.org/2000/svg"
          :width="width"
          :height="height"
          :fill="fill"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="10" />
        </svg>
      `
    });

    const wrapper = mount(custom)
    const html = wrapper.html({ raw: true })
    expect(html).toContain('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle></svg>')
  })
})
