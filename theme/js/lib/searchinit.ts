// tslint:disable: object-literal-sort-keys
import Pjax from "pjax-api"
import * as qs from "qs"
import onLoad from "./onLoad"
import { cses } from "./vals"
import window from "./window"

const msgs = {
  ja: "「{0}」の検索結果",
  en: "Search result of \"{0}\"",
  fr: "Search result of \"{0}\""
}

const s = (pjax: Pjax) => {
  const locale = window.currentLocale === "false" ? window.locales[0] : window.currentLocale
  const btn = document.getElementById("searchButton") as HTMLButtonElement
  const input = document.getElementById("searchInput") as HTMLInputElement
  const scriptId = "searchScript"
  let script = document.getElementById(scriptId) as HTMLScriptElement
  if (!script || !script.src.endsWith(cses[locale])) {
    if (script) script.remove()
    const newel = document.createElement("script")
    newel.src = `https://cse.google.com/cse.js?cx=${cses[locale]}`
    newel.id = scriptId
    newel.async = true
    script = document.head.appendChild(newel)
  }

  const showResult = () => {
    const h1 = document.querySelector("#main h1")
    h1.textContent = msgs[locale].replace("{0}",
      decodeURIComponent((qs.parse(window.location.search, { ignoreQueryPrefix: true })).q)
    )
    window.google.search.cse.element.go()
  }

  const move = () => {
    if (input.value) pjax.replace(`/${locale}/search/?q=${encodeURIComponent(input.value)}`)
  }

  btn.onclick = () => move()
  input.onkeypress = e => e.charCode === 13 ? move() : void(0)

  if (location.pathname.startsWith(`/${locale}/search/`) && location.search.startsWith(`?q=`)) {
    if (
      "google" in window &&
      "search" in window.google &&
      "cse" in window.google.search &&
      "element" in window.google.search.cse &&
      "render" in window.google.search.cse.element
    ) {
      showResult()
    } else {
      script.onload = () => setTimeout(() => showResult(), 300)
    }
  }

}

export const searchinit = (pjax: Pjax) => {
  onLoad(() => s(pjax))
  window.addEventListener("pjax:load", () => s(pjax))
}
