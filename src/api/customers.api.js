import client from './client'

export const customersApi = {
  getAll: (params) => client.get('/customers', { params }),
}