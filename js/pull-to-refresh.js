/* ===== سحب للتحديث (Pull to Refresh) - بنيان ===== */

var PullToRefresh = (function() {
    var enabled = false;
    var startY = 0;
    var startX = 0;
    var pulling = false;
    var locked = false;
    var indicator = null;
    var threshold = 100;

    function createIndicator() {
        if (indicator) return indicator;
        indicator = document.createElement('div');
        indicator.className = 'ptr-indicator';
        indicator.style.display = 'none';
        document.body.appendChild(indicator);
        return indicator;
    }

    function getScrollTop() {
        var el = document.querySelector('.page-content');
        if (el) return el.scrollTop;
        return window.pageYOffset || document.documentElement.scrollTop || 0;
    }

    function onTouchStart(e) {
        if (getScrollTop() > 2) return;
        startY = e.touches[0].clientY;
        startX = e.touches[0].clientX;
        pulling = true;
        locked = false;
    }

    function onTouchMove(e) {
        if (!pulling) return;
        var dy = e.touches[0].clientY - startY;
        var dx = Math.abs(e.touches[0].clientX - startX);
        if (locked || dx > 30 || dy < 0 || getScrollTop() > 2) {
            pulling = false;
            locked = false;
            hideIndicator();
            return;
        }
        if (dy < 20) return;
        locked = true;
        e.preventDefault();
        var el = createIndicator();
        var progress = Math.min(dy / threshold, 1);
        el.style.opacity = progress;
        el.style.transform = 'translateY(' + Math.min(dy * 0.4, 50) + 'px)';
    }

    function onTouchEnd(e) {
        if (!pulling && !locked) return;
        pulling = false;
        locked = false;
        var dy = e.changedTouches[0].clientY - startY;
        if (dy >= threshold && getScrollTop() <= 2) {
            showRefreshing();
            setTimeout(function() { location.reload(); }, 600);
        } else {
            hideIndicator();
        }
    }

    function showRefreshing() {
        var el = createIndicator();
        el.style.opacity = '1';
        el.style.transform = 'translateY(50px)';
    }

    function hideIndicator() {
        if (indicator) {
            indicator.style.opacity = '0';
            indicator.style.transform = 'translateY(-20px)';
        }
    }

    function init() {
        if (enabled) return;
        enabled = true;
        document.addEventListener('touchstart', onTouchStart, { passive: true });
        document.addEventListener('touchmove', onTouchMove, { passive: false });
        document.addEventListener('touchend', onTouchEnd, { passive: true });
    }

    return { init: init };
})();
