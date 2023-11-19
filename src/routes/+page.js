import { goto } from '$app/navigation'

export function load (ctx) { // login with token
  const token = ctx.url.searchParams.get('token')
  if (token) window.sessionStorage.token = token
  if (window.sessionStorage.token) goto('/home')
}
