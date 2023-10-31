import request from '@/utils/request'

export function getList(params) {
  // return request.get('/api/lines', params)
  return request({
    url: '/api/admin/system',
    method: 'get',
    params
  })
}

export function report(params) {
  return request({
    url: '/api/user/login_log_report',
    method: 'get',
    params
  })
}
