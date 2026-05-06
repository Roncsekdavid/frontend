import { describe, expect, test, vi, beforeEach } from 'vitest'
import { shallowMount, flushPromises } from '@vue/test-utils'
import AdminNewsView from '../../adminview/AdminNewsView.vue'

vi.mock('../../services/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn()
  }
}))

import api from '../../services/api'

describe('AdminNewsView komponens', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const mountWrapper = async () => {
    api.get.mockResolvedValueOnce({
      data: [
        {
          id: 1,
          title: 'Admin hír',
          short_text: 'Rövid admin leírás',
          content: 'Admin tartalom',
          icon: 'bi-newspaper',
          is_active: true,
          created_at: '2026-05-04T10:00:00Z',
          news_images: [{ id: 10, url: 'https://example.com/news.jpg', is_primary: true }]
        }
      ]
    })

    const wrapper = shallowMount(AdminNewsView, {
      global: {
        stubs: {
          AdminMenu: true,
          AdminHeader: true
        }
      }
    })

    await flushPromises()
    return wrapper
  }

  test('betölti és megjeleníti az admin híreket', async () => {
    const wrapper = await mountWrapper()

    expect(api.get).toHaveBeenCalledWith('/news/admin')
    expect(wrapper.text()).toContain('Admin hír')
    expect(wrapper.text()).toContain('Rövid admin leírás')
  })

  test('új hír létrehozásakor FormData-val hívja a POST végpontot', async () => {
    const wrapper = await mountWrapper()
    api.post.mockResolvedValueOnce({ data: { news: { id: 2 } } })
    api.get.mockResolvedValueOnce({
      data: {
        id: 2,
        title: 'Új hír',
        short_text: 'Új rövid leírás',
        content: 'Új tartalom',
        icon: 'bi-star',
        is_active: true,
        created_at: '2026-05-04T11:00:00Z',
        news_images: []
      }
    })

    const inputs = wrapper.findAll('input')
    await inputs[0].setValue('Új hír')
    await inputs[1].setValue('bi-star')
    await inputs[2].setValue('Új rövid leírás')
    await wrapper.find('textarea').setValue('Új tartalom')

    const createButton = wrapper.findAll('button').find((button) => button.text() === 'Hír létrehozása')
    await createButton.trigger('click')
    await flushPromises()

    expect(api.post).toHaveBeenCalledWith(
      '/news',
      expect.any(FormData),
      expect.objectContaining({
        headers: expect.objectContaining({ 'Content-Type': 'multipart/form-data' })
      })
    )
    expect(api.get).toHaveBeenCalledWith('/news/2')
    expect(wrapper.text()).toContain('Új hír')
  })
})
