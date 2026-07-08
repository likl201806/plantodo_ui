/**
 * UI 原型切换逻辑
 * 左侧列表点击后切换右侧预览面板，并通过 URL hash 记住当前选中项（刷新后保持）
 */
(function () {
  const items = document.querySelectorAll('.ui-gallery__item');
  const panels = document.querySelectorAll('[data-ui-panel]');
  const DEFAULT_UI = 'plan1-mac-todo';

  /** 切换到指定 UI 面板 */
  function switchUi(uiId, updateHash) {
    if (!uiId) return false;

    const targetItem = document.querySelector('.ui-gallery__item[data-ui="' + uiId + '"]');
    const hasPanel = Array.from(panels).some(function (panel) {
      return panel.dataset.uiPanel === uiId;
    });
    if (!targetItem || !hasPanel) return false;

    items.forEach(function (i) {
      i.classList.remove('ui-gallery__item--active');
    });
    targetItem.classList.add('ui-gallery__item--active');

    panels.forEach(function (panel) {
      panel.style.display = panel.dataset.uiPanel === uiId ? '' : 'none';
    });

    if (updateHash !== false) {
      var hash = '#' + uiId;
      if (location.hash !== hash) {
        history.replaceState(null, '', hash);
      }
    }

    return true;
  }

  items.forEach(function (item) {
    item.addEventListener('click', function () {
      var uiId = item.dataset.ui;
      if (!uiId) return;
      switchUi(uiId);
    });
  });

  window.addEventListener('hashchange', function () {
    var uiId = location.hash.slice(1);
    if (uiId) switchUi(uiId, false);
  });

  // 页面加载时根据 hash 恢复上次选中的 UI
  var hashUiId = location.hash.slice(1);
  if (hashUiId && !switchUi(hashUiId, false)) {
    switchUi(DEFAULT_UI);
  }
})();

/**
 * 横向滚动条带：根据可滚动状态展示左右箭头，并支持点击滚动。
 * 用于图1/图4中的文件夹和筛选列表。
 */
(function () {
  var strips = document.querySelectorAll('[data-scroll-strip]');
  if (!strips.length) return;

  function initStrip(strip) {
    var viewport = strip.querySelector('.scroll-strip__viewport');
    var prevBtn = strip.querySelector('.scroll-strip__btn--prev');
    var nextBtn = strip.querySelector('.scroll-strip__btn--next');
    if (!viewport || !prevBtn || !nextBtn) return;

    var SCROLL_TOLERANCE = 1;

    function updateButtons() {
      var maxScrollLeft = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
      var hasOverflow = maxScrollLeft > SCROLL_TOLERANCE;
      var canScrollPrev = viewport.scrollLeft > SCROLL_TOLERANCE;
      var canScrollNext = viewport.scrollLeft < maxScrollLeft - SCROLL_TOLERANCE;

      prevBtn.hidden = !hasOverflow;
      nextBtn.hidden = !hasOverflow;
      prevBtn.disabled = !canScrollPrev;
      nextBtn.disabled = !canScrollNext;
    }

    function scrollByStep(direction) {
      var step = Math.max(120, Math.round(viewport.clientWidth * 0.72));
      viewport.scrollBy({
        left: direction * step,
        behavior: 'smooth'
      });
    }

    prevBtn.addEventListener('click', function () {
      scrollByStep(-1);
    });

    nextBtn.addEventListener('click', function () {
      scrollByStep(1);
    });

    viewport.addEventListener('scroll', updateButtons, { passive: true });
    window.addEventListener('resize', updateButtons);

    if ('ResizeObserver' in window) {
      var resizeObserver = new ResizeObserver(updateButtons);
      resizeObserver.observe(viewport);
      Array.from(viewport.children).forEach(function (child) {
        resizeObserver.observe(child);
      });
    }

    updateButtons();
  }

  strips.forEach(initStrip);
})();

/**
 * 图4-相册：右上角勾选按钮状态切换
 * 默认绿色打钩，点击后切换为红色系打叉，再次点击可恢复。
 */
(function () {
  var toggleBtn = document.querySelector('.plan4-album .album-main__select-btn');
  if (!toggleBtn) return;

  toggleBtn.addEventListener('click', function () {
    var isDanger = toggleBtn.classList.toggle('album-main__select-btn--danger');
    toggleBtn.setAttribute('data-toggle-state', isDanger ? 'close' : 'check');
    toggleBtn.setAttribute('aria-label', isDanger ? '关闭批量选择' : '开启批量选择');
  });
})();
