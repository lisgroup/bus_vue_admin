import request from '@/utils/request'

export function menu() {
  return request.post('/api/wechat/menu')
}
