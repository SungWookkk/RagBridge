// lib/api.ts
import axios from "axios"

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: false,
  timeout: 15000,
})

// 요청/응답 인터셉터(선택)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    // 공통 에러 처리(토스트/로그)
    return Promise.reject(err)
  }
)
