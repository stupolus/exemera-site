// Страница «Миссия»: появление сцен и подсветка активной главы.
(function () {
  'use strict';

  var scenes = Array.prototype.slice.call(document.querySelectorAll('.scene'));
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.chapter-nav a[data-chapter]'));

  function setChapter(name) {
    navLinks.forEach(function (a) {
      a.classList.toggle('is-active', a.getAttribute('data-chapter') === name);
    });
  }

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('is-on');
          var ch = e.target.getAttribute('data-chapter');
          if (ch) setChapter(ch);
        }
      });
    }, { threshold: 0.45 });
    scenes.forEach(function (s) { io.observe(s); });
  } else {
    scenes.forEach(function (s) { s.classList.add('is-on'); });
  }
})();
