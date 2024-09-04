// ==UserScript==
// @name        Grand Combat Autoclicker
// @namespace   Violentmonkey Scripts
// @match       https://app.grandcombat.io/home/*
// @grant       none
// @version     1.0
// @author      -
// @description 9/4/2024
// @icon         https://grandcombat.io/_next/static/media/logo.22ba8d38.svg
// @downloadURL  https://github.com/mudachyo/Grand-Combat/raw/main/grand-combat-autoclicker.user.js
// @updateURL    https://github.com/mudachyo/Grand-Combat/raw/main/grand-combat-autoclicker.user.js
// @homepage     https://github.com/mudachyo/Grand-Combat
// ==/UserScript==

// Настройки задержек и параметров
const settings = {
    clickDelayMin: 100, // Минимальная задержка между кликами в миллисекундах
    clickDelayMax: 200, // Максимальная задержка между кликами в миллисекундах
    lowEnergyPauseMin: 30000, // Минимальная пауза при низком уровне энергии в миллисекундах (30 секунд)
    lowEnergyPauseMax: 60000, // Максимальная пауза при низком уровне энергии в миллисекундах (60 секунд)
    initialDelay: 5000, // Задержка перед запуском автокликера после загрузки страницы (5 секунд)
    energyThreshold: 25, // Порог энергии, при котором запускается пауза
    searchInterval: 1000, // Интервал поиска элементов в миллисекундах (1 секунда)
  };
  
  const styles = {
    success: 'background: #28a745; color: #ffffff; font-weight: bold; padding: 4px 8px; border-radius: 4px;',
    starting: 'background: #8640ff; color: #ffffff; font-weight: bold; padding: 4px 8px; border-radius: 4px;',
    error: 'background: #dc3545; color: #ffffff; font-weight: bold; padding: 4px 8px; border-radius: 4px;',
    info: 'background: #007bff; color: #ffffff; font-weight: bold; padding: 4px 8px; border-radius: 4px;',
  };
  const logPrefix = '%c[Grand-CombatBot] ';
  
  const originalLog = console.log;
  console.log = function () {
    if (typeof arguments[0] === 'string' && arguments[0].includes('[Grand-CombatBot]')) {
      originalLog.apply(console, arguments);
    }
  };
  
  console.error = console.warn = console.info = console.debug = () => { };
  
  console.clear();
  console.log(`${logPrefix}Starting`, styles.starting);
  console.log(`${logPrefix}Created by https://t.me/shopalenka`, styles.starting);
  console.log(`${logPrefix}Github https://github.com/mudachyo/Grand-Combat`, styles.starting);
  
  function triggerEvent(element, eventType, eventClass, coords) {
    let event;
    if (eventClass === TouchEvent) {
      const touch = new Touch({
        identifier: Date.now(),
        target: element,
        clientX: coords.x,
        clientY: coords.y,
        radiusX: coords.width,
        radiusY: coords.height,
        force: coords.pressure,
      });
      event = new TouchEvent(eventType, {
        bubbles: true,
        cancelable: true,
        touches: [touch],
        targetTouches: [touch],
        changedTouches: [touch],
      });
    } else {
      event = new eventClass(eventType, {
        bubbles: true,
        cancelable: true,
        clientX: coords.x,
        clientY: coords.y,
        pointerId: 3,
        width: coords.width,
        height: coords.height,
        pressure: coords.pressure,
      });
    }
    element.dispatchEvent(event);
  }
  
  function randomClick() {
    const element = document.querySelector('.w-full.h-full.relative.will-change-transform');
    if (!element) {
      console.log(`${logPrefix}Элемент для клика не найден, продолжаем поиск...`, styles.error);
      setTimeout(randomClick, settings.searchInterval);
      return;
    }
  
    const energyElement = document.querySelector('.text-center.text-white.text-base.font-semibold');
    if (!energyElement) {
      console.log(`${logPrefix}Элемент энергии не найден, продолжаем поиск...`, styles.error);
      setTimeout(randomClick, settings.searchInterval);
      return;
    }
  
    const energyText = energyElement.textContent.trim();
    const currentEnergy = parseInt(energyText.split(' / ')[0], 10);
  
    if (currentEnergy <= settings.energyThreshold) {
      const pauseTime = Math.random() * (settings.lowEnergyPauseMax - settings.lowEnergyPauseMin) + settings.lowEnergyPauseMin;
      console.log(`${logPrefix}Мало энергии (${currentEnergy}), пауза на ${Math.round(pauseTime / 1000)} секунд.`, styles.info);
      setTimeout(randomClick, pauseTime);
      return;
    }
  
    const rect = element.getBoundingClientRect();
    const x = Math.random() * rect.width + rect.left;
    const y = Math.random() * rect.height + rect.top;
    const coords = { x, y, width: 23, height: 23, pressure: 1 };
  
    const events = [
      { type: 'pointerover', class: PointerEvent },
      { type: 'pointerenter', class: PointerEvent },
      { type: 'pointerdown', class: PointerEvent },
      { type: 'touchstart', class: TouchEvent },
      { type: 'pointerup', class: PointerEvent, modify: { pressure: 0 } },
      { type: 'pointerout', class: PointerEvent },
      { type: 'pointerleave', class: PointerEvent },
      { type: 'touchend', class: TouchEvent },
      { type: 'mousedown', class: MouseEvent },
      { type: 'mouseup', class: MouseEvent },
      { type: 'click', class: PointerEvent, modify: { pressure: 0 } },
    ];
  
    events.forEach(e => triggerEvent(element, e.type, e.class, { ...coords, ...e.modify }));
  
    const nextClickDelay = Math.random() * (settings.clickDelayMax - settings.clickDelayMin) + settings.clickDelayMin;
    setTimeout(randomClick, nextClickDelay);
  }
  
  function waitForElements() {
    const energyElement = document.querySelector('.text-center.text-white.text-base.font-semibold');
    if (!energyElement) {
      console.log(`${logPrefix}Ждем появления элемента энергии...`, styles.info);
      setTimeout(waitForElements, settings.searchInterval);
      return;
    }
    console.log(`${logPrefix}Элемент энергии найден, запускаем автокликер...`, styles.success);
    randomClick();
  }
  
  setTimeout(waitForElements, settings.initialDelay);
  