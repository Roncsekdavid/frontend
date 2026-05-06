import { describe, expect, test, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import NewsSlider from '../../components/NewsSlider.vue'

vi.mock('../../services/api', () => ({
  default: {
    get: vi.fn()
  }
}))

import api from '../../services/api'

const newsResponse = [
  {
    id: 1,
    title: 'Felhasználói hír',
    short_text: 'Rövid leírás',
    content: 'Hosszabb tartalom a modalban.',
    icon: 'bi-newspaper',
    created_at: '2026-05-04T10:00:00Z',
    news_images: [
      { id: 11, url: 'https://example.com/primary.jpg', is_primary: true },
      { id: 12, url: 'https://example.com/second.jpg', is_primary: false }
    ]
  }
]

describe('NewsSlider komponens', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    document.body.style.overflow = ''
  })

  const mountWrapper = async () => {
    api.get.mockResolvedValueOnce({ data: newsResponse })
    const wrapper = mount(NewsSlider)
    await flushPromises()
    return wrapper
  }

  test('API-ból tölti be és kártyán megjeleníti a hírt', async () => {
    const wrapper = await mountWrapper()

    expect(api.get).toHaveBeenCalledWith('/news')
    expect(wrapper.text()).toContain('Felhasználói hír')
    expect(wrapper.text()).toContain('Rövid leírás')
    expect(wrapper.find('article img').attributes('src')).toBe('https://example.com/primary.jpg')
  })

  test('kártyára kattintva modal nyílik, a bezáró gomb a kép fölé kerül', async () => {
    const wrapper = await mountWrapper()

    await wrapper.find('article').trigger('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Hosszabb tartalom a modalban.')
    expect(document.body.style.overflow).toBe('hidden')

    const closeButton = wrapper.find('.fixed button')
    expect(closeButton.classes()).toContain('z-30')
  })
})
