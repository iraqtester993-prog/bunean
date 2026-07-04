/* ===== مشترك: نافذة المشروع + معرض الصور معzoom ===== */

/* استخدام: createProjectModal(opts) يرجع { state, modalTouch, viewerTouch, openViewer, closeModal, closeViewer }
   opts: { slide, pullY, images (ref) }
*/
function createProjectModal(opts) {
  var s = {
    slide: opts.slide,
    pullY: opts.pullY || null,
    images: opts.images || null,
    viewerOpen: Vue.ref(false),
    viewerIndex: Vue.ref(0),
    viewerScale: Vue.ref(1),
    viewerPanX: Vue.ref(0),
    viewerPanY: Vue.ref(0),
    viewerImages: Vue.ref([])
  };

  /* === Modal Touch (swipe + pull-to-close) === */
  var modalSX = 0, modalSY = 0;
  var modalTouch = {
    onTouchStart: function(e) {
      modalSX = e.touches[0].clientX;
      modalSY = e.touches[0].clientY;
      if (s.pullY) s.pullY.value = 0;
    },
    onTouchMove: function(e) {
      if (!s.pullY) return;
      var dy = e.touches[0].clientY - modalSY;
      if (dy > 0) s.pullY.value = dy * 0.5;
    },
    onTouchEnd: function(e, onClose) {
      var dx = e.changedTouches[0].clientX - modalSX;
      var dy = e.changedTouches[0].clientY - modalSY;
      if (Math.abs(dy) > Math.abs(dx) && dy > 100) {
        if (onClose) onClose();
      } else if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
        var len = s.images ? s.images.value.length : 0;
        if (len < 2) return;
        var next = s.slide.value + (dx < 0 ? 1 : -1);
        if (next >= 0 && next < len) s.slide.value = next;
      } else {
        if (s.pullY) s.pullY.value = 0;
      }
    }
  };

  /* === Viewer Touch (swipe + zoom + double-tap) === */
  var v = { sx: 0, sy: 0, lastTap: 0, dist0: 0, isPinch: false };
  var viewerTouch = {
    onTouchStart: function(e) {
      if (e.touches.length === 2) {
        v.isPinch = true;
        v.dist0 = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
        return;
      }
      v.isPinch = false;
      v.sx = e.touches[0].clientX;
      v.sy = e.touches[0].clientY;
      /* double-tap */
      var now = Date.now();
      if (now - v.lastTap < 300) {
        if (s.viewerScale.value > 1.1) {
          s.viewerScale.value = 1; s.viewerPanX.value = 0; s.viewerPanY.value = 0;
        } else {
          s.viewerScale.value = 2.5;
          s.viewerPanX.value = 0; s.viewerPanY.value = 0;
        }
      }
      v.lastTap = now;
    },
    onTouchMove: function(e) {
      if (e.touches.length === 2 && v.isPinch) {
        var d = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
        var scale = d / (v.dist0 || 1);
        s.viewerScale.value = Math.max(1, Math.min(5, s.viewerScale.value * (1 + (scale - 1) * 0.5)));
        v.dist0 = d;
        return;
      }
      if (s.viewerScale.value > 1.1) {
        s.viewerPanX.value += (e.touches[0].clientX - v.sx);
        s.viewerPanY.value += (e.touches[0].clientY - v.sy);
        v.sx = e.touches[0].clientX;
        v.sy = e.touches[0].clientY;
        return;
      }
    },
    onTouchEnd: function(e, onClose) {
      if (v.isPinch) { v.isPinch = false; return; }
      if (s.viewerScale.value > 1.1) return;
      var dx = e.changedTouches[0].clientX - v.sx;
      var dy = e.changedTouches[0].clientY - v.sy;
      if (Math.abs(dy) > Math.abs(dx) && dy > 80) {
        if (onClose) onClose();
      } else if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
        var len = s.viewerImages.value.length;
        if (len < 2) return;
        var next = s.viewerIndex.value + (dx < 0 ? 1 : -1);
        if (next >= 0 && next < len) { s.viewerIndex.value = next; s.viewerScale.value = 1; s.viewerPanX.value = 0; s.viewerPanY.value = 0; }
      }
    }
  };

  function openViewer(idx) {
    if (!s.images || !s.images.value) return;
    s.viewerImages.value = s.images.value;
    s.viewerIndex.value = idx || 0;
    s.viewerScale.value = 1; s.viewerPanX.value = 0; s.viewerPanY.value = 0;
    s.viewerOpen.value = true;
  }

  function closeViewer() { s.viewerOpen.value = false; s.viewerScale.value = 1; s.viewerPanX.value = 0; s.viewerPanY.value = 0; }

  return {
    state: s,
    modalTouch: modalTouch,
    viewerTouch: viewerTouch,
    openViewer: openViewer,
    closeViewer: closeViewer
  };
}
