export const API_BASE_URL = 'http://localhost:3001/api';

export const API_ENDPOINTS = {
  grades: {
    list: `${API_BASE_URL}/admin/grades/list`,
    create: `${API_BASE_URL}/admin/grade`,
    edit: `${API_BASE_URL}/admin/grade`,
    single: `${API_BASE_URL}/admin/grade/data`
  },
  books: {
    list: `${API_BASE_URL}/admin/books/list`,
    create: `${API_BASE_URL}/admin/book`,
    edit: `${API_BASE_URL}/admin/book`,
    editBookStatus: `${API_BASE_URL}/admin/book/status`
  },
  students: {
    dataExists: `${API_BASE_URL}/student/data/verify`,
    onboard: `${API_BASE_URL}/student/onboard`,
    books: `${API_BASE_URL}/student/books`,
    bookStatus: `${API_BASE_URL}/student/book/data`
  },
  auth: {
    googleLogin: `${API_BASE_URL}/auth/g-login`,
    logout: `${API_BASE_URL}/auth/logout`
  },
  google: {
    oauth2: 'https://www.googleapis.com/oauth2/v3/userinfo',
    books: 'https://www.googleapis.com/books/v1/volumes'
  }
};