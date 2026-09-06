/* XEMERA — поведение сайта: шапка, меню, reveal-анимации, медиа-заглушки */
(function () {
  "use strict";

  /* --- шапка: фон при прокрутке --- */
  var header = document.querySelector(".header");
  function onScroll() {
    if (!header) return;
    header.classList.toggle("is-solid", window.scrollY > 40);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* --- мобильное меню --- */
  var burger = document.querySelector(".burger");
  var headerLogo = document.querySelector(".header .logo img");
  function syncLogo() {
    /* в открытом меню фон тёмный — показываем светлую версию логотипа */
    if (!headerLogo) return;
    var open = document.body.classList.contains("menu-open");
    headerLogo.src = headerLogo.src.replace(
      open ? "exemera-logo.svg" : "exemera-logo-light.svg",
      open ? "exemera-logo-light.svg" : "exemera-logo.svg"
    );
  }
  if (burger) {
    burger.addEventListener("click", function () {
      document.body.classList.toggle("menu-open");
      syncLogo();
    });
    document.querySelectorAll(".nav a").forEach(function (a) {
      a.addEventListener("click", function () {
        document.body.classList.remove("menu-open");
        syncLogo();
      });
    });
  }

  /* --- подсветка активного пункта меню --- */
  var page = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav a").forEach(function (a) {
    if (a.getAttribute("href") === page) a.classList.add("is-active");
  });

  /* --- reveal-анимации при прокрутке --- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* --- медиа-заглушки ---
     Каждый <figure class="media"> содержит <img> или <video> с финальным
     именем файла в assets/. Пока файла нет, показываем заглушку (.is-empty).
     Как только файл появится в assets/ — медиа отобразится без правок кода. */
  document.querySelectorAll(".media img").forEach(function (img) {
    function markEmpty() { img.closest(".media").classList.add("is-empty"); }
    if (img.complete && img.naturalWidth === 0) markEmpty();
    img.addEventListener("error", markEmpty);
  });

  document.querySelectorAll(".media video").forEach(function (video) {
    function markEmpty() { video.closest(".media").classList.add("is-empty"); }
    function check() {
      /* NETWORK_NO_SOURCE (3): все источники не загрузились */
      if (video.networkState === 3) markEmpty();
    }
    video.addEventListener("error", markEmpty, true);
    var src = video.querySelector("source");
    if (src) src.addEventListener("error", markEmpty);
    check();
    setTimeout(check, 600);
    setTimeout(check, 2500);
  });

  /* --- форма контактов: собираем письмо через mailto ---
     Бэкенда у статического сайта нет; при подключении хостинга с формами
     (Formspree, Tilda-форма, свой endpoint) замените обработчик. */
  var form = document.querySelector("#contact-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = form.querySelector("[name=name]").value.trim();
      var company = form.querySelector("[name=company]").value.trim();
      var topic = form.querySelector("[name=topic]").value;
      var msg = form.querySelector("[name=message]").value.trim();
      var subject = "Запрос с сайта Exemera — " + topic;
      var body = "Имя: " + name + "\nКомпания: " + company + "\nНаправление: " + topic + "\n\n" + msg;
      /* ЗАМЕНИТЬ: рабочий email компании */
      location.href = "mailto:hello@exemera.com?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    });
  }

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* --- живые счётчики цифр (10+, 25+, 50+) --- */
  function animateCount(el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    var suffix = el.getAttribute("data-suffix") || "";
    if (reduceMotion || !target) { el.textContent = target + suffix; return; }
    var start = null, dur = 1400;
    function tick(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  var counters = document.querySelectorAll("[data-count]");
  if (counters.length && "IntersectionObserver" in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { animateCount(e.target); cio.unobserve(e.target); }
      });
    }, { threshold: 0.35 });
    counters.forEach(function (el) { cio.observe(el); });
    /* страховка: если наблюдатель не сработал (быстрый скролл, старый
       браузер), через 4с показываем финальные значения */
    setTimeout(function () {
      counters.forEach(function (el) {
        var target = el.getAttribute("data-count");
        var suffix = el.getAttribute("data-suffix") || "";
        if (parseInt(el.textContent, 10) === 0 && parseInt(target, 10) !== 0) {
          el.textContent = target + suffix;
        }
      });
    }, 4000);
  } else {
    counters.forEach(function (el) {
      el.textContent = el.getAttribute("data-count") + (el.getAttribute("data-suffix") || "");
    });
  }

  /* --- spotlight-карточки: подсветка следует за курсором --- */
  document.querySelectorAll(".card").forEach(function (card) {
    card.addEventListener("mousemove", function (e) {
      var r = card.getBoundingClientRect();
      card.style.setProperty("--mx", (e.clientX - r.left) + "px");
      card.style.setProperty("--my", (e.clientY - r.top) + "px");
    });
  });

  /* --- лёгкий параллакс фото в hero --- */
  var heroImg = document.querySelector(".hero__img img");
  if (heroImg && !reduceMotion) {
    window.addEventListener("scroll", function () {
      var y = Math.min(window.scrollY, 700);
      heroImg.style.transform = "translateY(" + y * 0.08 + "px) scale(1.06)";
    }, { passive: true });
  }

  /* --- текущий год в футере --- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();

/* --- интро-заставка главной: показ раз за сессию, повторное открытие
   по эмблеме в шапке (#eco), выход по клику/клавише/скроллу --- */
(function () {
  var splash = document.getElementById("splash");
  if (!splash) return;
  var seen = false;
  try { seen = sessionStorage.getItem("exemera-intro") === "1"; } catch (e) {}
  var closed = true;

  function bindDismissOnScroll() {
    window.addEventListener("wheel", close, { once: true, passive: true });
    window.addEventListener("touchmove", close, { once: true, passive: true });
  }
  function open() {
    splash.hidden = false;
    /* перезапуск CSS-переходов */
    void splash.offsetWidth;
    splash.classList.remove("is-leaving");
    /* мгновенная видимость: базовый transition задерживает visibility на 0.7с */
    splash.style.visibility = "visible";
    document.body.classList.add("splash-open");
    closed = false;
    bindDismissOnScroll();
    splash.focus({ preventScroll: true });
  }
  function close() {
    if (closed) return;
    closed = true;
    try { sessionStorage.setItem("exemera-intro", "1"); } catch (e) {}
    splash.style.visibility = "";
    splash.classList.add("is-leaving");
    document.body.classList.remove("splash-open");
    /* чистим #eco из адреса, чтобы обновление страницы не открывало выбор заново */
    if (location.hash === "#eco" && history.replaceState) {
      history.replaceState(null, "", location.pathname + location.search);
    }
    window.scrollTo(0, 0);
    setTimeout(function () { if (closed) splash.hidden = true; }, 800);
  }

  /* порталы: верхний ведёт в лендинг, «скоро»-порталы показывают подсказку */
  var toast = splash.querySelector(".splash__toast");
  var toastTimer = null;
  splash.querySelectorAll(".splash__orb[data-soon]").forEach(function (b) {
    b.addEventListener("click", function (e) {
      e.stopPropagation();
      if (!toast) return;
      toast.textContent = "Сайт скоро откроется — следите за новостями";
      toast.classList.add("is-on");
      clearTimeout(toastTimer);
      toastTimer = setTimeout(function () { toast.classList.remove("is-on"); }, 2200);
    });
  });
  splash.addEventListener("click", close);
  splash.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " " || e.key === "Escape") { e.preventDefault(); close(); }
  });

  /* эмблема в шапке открывает заставку заново (на главной — без перезагрузки) */
  var eco = document.querySelector(".eco-link");
  if (eco) {
    eco.addEventListener("click", function (e) {
      e.preventDefault();
      document.body.classList.remove("menu-open");
      open();
    });
  }

  if (location.hash === "#eco") {
    open();
  } else if (seen) {
    splash.hidden = true;
  } else {
    open();
  }
})();
