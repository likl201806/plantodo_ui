/**
 * 图1：左侧栏空间列表底部渐变提示
 * - 内容超出且未滚到底部时，显示底部渐变透明效果
 */
(function () {
  function initNavScroll(scrollRoot) {
    const viewport = scrollRoot.querySelector('.nav-sidebar__scroll-viewport');
    const list = viewport && viewport.firstElementChild;

    if (!viewport || !list) return;

    function updateFade() {
      const maxScroll = Math.max(0, viewport.scrollHeight - viewport.clientHeight);
      const hasMoreBelow = maxScroll > 1 && viewport.scrollTop < maxScroll - 1;
      scrollRoot.classList.toggle('nav-sidebar__scroll--fade-bottom', hasMoreBelow);
    }

    viewport.addEventListener('scroll', updateFade);
    window.addEventListener('resize', updateFade);

    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(updateFade);
      observer.observe(viewport);
      observer.observe(list);
    }

    updateFade();
  }

  document.querySelectorAll('.plan1-mac-todo [data-nav-scroll]').forEach(initNavScroll);
})();
