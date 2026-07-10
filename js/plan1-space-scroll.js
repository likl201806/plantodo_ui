/**
 * Mac 左侧栏空间列表底部渐变提示
 * - 内容超出且未滚到底部时，显示底部渐变透明效果
 * - 兼容图1的滚动容器，以及图2-图9的普通空间列表结构
 */
(function () {
  function initSpaceFade(scrollRoot, viewport) {
    if (!scrollRoot || !viewport) return;

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
    }

    updateFade();
  }

  document.querySelectorAll('.nav-sidebar__scroll').forEach(function (scrollRoot) {
    initSpaceFade(scrollRoot, scrollRoot.querySelector('.nav-sidebar__scroll-viewport'));
  });

  document.querySelectorAll('.nav-sidebar > .nav-sidebar__section').forEach(function (section) {
    const isSpaceSection = Boolean(section.querySelector('.nav-sidebar__add-space-btn'));
    const spaceList = isSpaceSection ? section.querySelector('.nav-sidebar__list') : null;

    if (isSpaceSection) {
      section.classList.add('nav-sidebar__section--space');
    }

    initSpaceFade(section, spaceList);
  });
})();
