import request from '@/utils/request'

export function getList(params) {
  // return request.get('/api/lines', params)
  return request({
    url: '/api/notice/list',
    method: 'get',
    params
  })
}

export function postAdd(params) {
  return request.post('/api/notice/add', params)
}

export function edit(id) {
  return request.get('/api/notice/' + id)
}

export function postEdit(id, params) {
  return request.post('/api/notice/update', params)
}

export function deleteAct(id) {
  return request.post('/api/notice/delete', {id})
}
