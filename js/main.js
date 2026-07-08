/**
 * UI 原型切换逻辑
 * 左侧列表点击后切换右侧预览面板
 */
(function () {
  const items = document.querySelectorAll('.ui-gallery__item');
  const panels = document.querySelectorAll('[data-ui-panel]');

  items.forEach((item) => {
    item.addEventListener('click', () => {
      const uiId = item.dataset.ui;
      if (!uiId) return;

      items.forEach((i) => i.classList.remove('ui-gallery__item--active'));
      item.classList.add('ui-gallery__item--active');

      panels.forEach((panel) => {
        panel.style.display = panel.dataset.uiPanel === uiId ? '' : 'none';
      });
    });
  });
})();
