"use client"

export function GTMNoScript() {
  const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID
  const ENABLE_ANALYTICS = process.env.NEXT_PUBLIC_ENABLE_ANALYTICS !== 'false'

  if (!GTM_ID || !ENABLE_ANALYTICS) {
    return null
  }

  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height="0"
        width="0"
        style={{ display: 'none', visibility: 'hidden' }}
      />
    </noscript>
  )
}