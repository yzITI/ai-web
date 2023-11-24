import { writable } from 'svelte/store'
import srpc from '$lib/srpc.js'
import acent from '$lib/acent.js'
import swal from 'sweetalert2'

export const loading = writable(false)

export const status = writable({ status: 'loading' })

export const balance = writable(0)

const breath = setInterval(async () => {
  const res = await srpc.status(window.sessionStorage.token)
  if (!res.ok) {
    clearInterval(breath)
    return swal.fire('Error', res.err, 'error')
  }
  status.set(res)
}, 2000)

export const getBalance = async () => balance.set(await acent.getBalance(window.sessionStorage.token))
