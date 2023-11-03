import request from '@/utils/request'

export function search(params) {
  return request.post('/api/bus/search', params)
}

export function line(params) {
  return request.post('/api/bus/line', params)
}

export function notice_setting(params) {
  return request.post('/api/notice/add', params)
}
