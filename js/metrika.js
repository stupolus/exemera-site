/* Яндекс Метрика, счётчик 112327224.
   Вынесено из inline-скрипта в отдельный файл сознательно: на сайте действует
   Content-Security-Policy без 'unsafe-inline', а nonce на статике GitHub Pages
   выдать некому — он требует генерации на сервере при каждом запросе.
   Файл со своего домена проходит по script-src 'self', и политику
   не приходится ослаблять разрешением встроенных скриптов. */
(function (m, e, t, r, i, k, a) {
  m[i] = m[i] || function () { (m[i].a = m[i].a || []).push(arguments) };
  m[i].l = 1 * new Date();
  for (var j = 0; j < document.scripts.length; j++) { if (document.scripts[j].src === r) { return; } }
  k = e.createElement(t), a = e.getElementsByTagName(t)[0], k.async = 1, k.src = r, a.parentNode.insertBefore(k, a)
})(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js?id=112327224', 'ym');

ym(112327224, 'init', { ssr: true, webvisor: true, clickmap: true, ecommerce: "dataLayer", referrer: document.referrer, url: location.href, accurateTrackBounce: true, trackLinks: true });
