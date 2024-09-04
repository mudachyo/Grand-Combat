// ==UserScript==
// @name         Grand-Combat Web
// @version      1.0
// @description  Запуск Grand-Combat в браузере
// @author       mudachyo
// @match        https://web.telegram.org/*/*
// @match        https://app.grandcombat.io/home/*
// @grant        none
// @icon         https://grandcombat.io/_next/static/media/logo.22ba8d38.svg
// @downloadURL  https://github.com/mudachyo/Grand-Combat/raw/main/grand-combat-web.user.js
// @updateURL    https://github.com/mudachyo/Grand-Combat/raw/main/grand-combat-web.user.js
// @homepage     https://github.com/mudachyo/Grand-Combat
// ==/UserScript==

(function() {
    function updateIframeSrc() {
      const iframe = document.querySelector('iframe.payment-verification');

      if (iframe) {
        let src = iframe.src;

        if (src.includes('grandcombat') && !src.includes('tgWebAppPlatform=ios')) {
          if (src.includes('tgWebAppPlatform=weba')) {
            src = src.replace(/tgWebAppPlatform=weba/g, 'tgWebAppPlatform=ios');
          } else if (src.includes('tgWebAppPlatform=web')) {
            src = src.replace(/tgWebAppPlatform=web/g, 'tgWebAppPlatform=ios');
          }

          iframe.src = src;

          console.log('Ссылка обновлена:', src);
        }
      } else {
      }
    }

    setInterval(updateIframeSrc, 2000);
  })();