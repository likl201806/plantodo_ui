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
