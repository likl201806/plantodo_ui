/**
 * 图1：待办文件夹 / 状态筛选横向滚动
 * - 标题与列表分两行显示
 * - 列表单行展示，超宽时显示左右滚动按钮
 * - 单击步进滚动，长按持续滚动
 */
(function () {
  const SCROLL_STEP = 120;
  const SCROLL_INTERVAL_MS = 40;
  const LONG_PRESS_DELAY_MS = 300;

  function initScrollStrip(strip) {
    const viewport = strip.querySelector('.scroll-strip__viewport');
    const list = viewport && viewport.firstElementChild;
    const prevBtn = strip.querySelector('.scroll-strip__btn--prev');
    const nextBtn = strip.querySelector('.scroll-strip__btn--next');
    const shouldAlwaysShowArrows = strip.dataset.scrollStripShowArrows === 'always';

    if (!viewport || !list || !prevBtn || !nextBtn) return;

    let scrollOffset = 0;
    let longPressTimer = null;
    let scrollTimer = null;

    function getMaxScroll() {
      return Math.max(0, list.scrollWidth - viewport.clientWidth);
    }

    function clampOffset(value) {
      return Math.min(Math.max(0, value), getMaxScroll());
    }

    function applyScroll() {
      scrollOffset = clampOffset(scrollOffset);
      list.style.transform = scrollOffset ? `translateX(-${scrollOffset}px)` : '';
    }

    function updateControls() {
      const maxScroll = getMaxScroll();
      const overflow = maxScroll > 1;

      prevBtn.hidden = !overflow && !shouldAlwaysShowArrows;
      nextBtn.hidden = !overflow && !shouldAlwaysShowArrows;

      if (!overflow) {
        scrollOffset = 0;
        applyScroll();
        prevBtn.disabled = true;
        nextBtn.disabled = true;
        return;
      }

      prevBtn.disabled = scrollOffset <= 0;
      nextBtn.disabled = scrollOffset >= maxScroll - 1;
    }

    function scrollBy(delta) {
      scrollOffset = clampOffset(scrollOffset + delta);
      applyScroll();
      updateControls();
    }

    function stopContinuousScroll() {
      if (longPressTimer) {
        clearTimeout(longPressTimer);
        longPressTimer = null;
      }
      if (scrollTimer) {
        clearInterval(scrollTimer);
        scrollTimer = null;
      }
    }

    function startContinuousScroll(direction) {
      stopContinuousScroll();

      scrollTimer = window.setInterval(() => {
        const before = scrollOffset;
        scrollBy(direction * SCROLL_STEP);
        if (scrollOffset === before) {
          stopContinuousScroll();
        }
      }, SCROLL_INTERVAL_MS);
    }

    function bindScrollButton(button, direction) {
      let activePointerId = null;

      const beginPress = (event) => {
        if (button.disabled || button.hidden) return;

        event.preventDefault();
        activePointerId = event.pointerId;
        button.setPointerCapture(event.pointerId);

        scrollBy(direction * SCROLL_STEP);

        longPressTimer = window.setTimeout(() => {
          startContinuousScroll(direction);
        }, LONG_PRESS_DELAY_MS);
      };

      const endPress = (event) => {
        if (activePointerId === null || event.pointerId !== activePointerId) return;

        stopContinuousScroll();
        activePointerId = null;

        if (button.hasPointerCapture(event.pointerId)) {
          button.releasePointerCapture(event.pointerId);
        }
      };

      button.addEventListener('pointerdown', beginPress);
      button.addEventListener('pointerup', endPress);
      button.addEventListener('pointercancel', endPress);
    }

    bindScrollButton(prevBtn, -1);
    bindScrollButton(nextBtn, 1);

    window.addEventListener('resize', updateControls);

    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(updateControls);
      observer.observe(viewport);
      observer.observe(list);
    }

    updateControls();
  }

  document.querySelectorAll('[data-scroll-strip]').forEach(initScrollStrip);
})();
