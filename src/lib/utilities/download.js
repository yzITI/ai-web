export default async function (content, filename, type = 'text/plain;charset=utf-8;') {
  const blob = new Blob([content], { type })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.style = 'visibility: hidden;'
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}