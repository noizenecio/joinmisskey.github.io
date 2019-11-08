declare global {
  // tslint:disable-next-line: interface-name
  interface Window {
    adsbygoogle: {
      push(a: any): void
    }
  }
}

export const gad = () => {
  document.querySelectorAll("ins.adsbygoogle:not([data-adsbygoogle-status='done'])").forEach(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (e) {
      console.error(e)
    }
  })
}
