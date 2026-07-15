/* ===== سحب للتحديث (Pull to Refresh) - بنيان ===== */

var PullToRefresh = (function() {
    var enabled = false;
    var startY = 0;
    var startX = 0;
    var pulling = false;
    var locked = false;
    var indicator = null;
    var innerEl = null;
    var backdrop = null;
    var ringBar = null;
    var threshold = 250;
    var CIRCUMFERENCE = 276.46;

    function getRingColor() {
        return document.documentElement.classList.contains('light-mode') ? '#2c5f8a' : '#c9a243';
    }

    function getRingTrackColor() {
        return document.documentElement.classList.contains('light-mode') ? 'rgba(44,95,138,0.12)' : 'rgba(201,162,67,0.12)';
    }

    function createIndicator() {
        if (indicator) return;
        indicator = document.createElement('div');
        indicator.id = 'bunean-ptr';
        indicator.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;z-index:99999;display:none;align-items:center;justify-content:center;pointer-events:none;';

        var css = document.createElement('style');
        css.textContent = '@keyframes ptr-spin{to{transform:rotate(360deg)}}';
        document.head.appendChild(css);

        indicator.innerHTML =
            '<div class="ptr-bg" style="position:absolute;inset:0;background:rgba(0,0,0,0);opacity:0;transition:opacity 0.35s ease;"></div>'
            + '<div class="ptr-inner" style="position:relative;z-index:1;display:flex;align-items:center;justify-content:center;opacity:0;transform:scale(0.2);transition:transform 0.4s cubic-bezier(0.34,1.56,0.64,1),opacity 0.35s ease;">'
            + '<div class="ptr-ring-wrap" style="position:relative;width:120px;height:120px;">'
            + '<svg style="width:120px;height:120px;transform:rotate(-90deg);" viewBox="0 0 100 100">'
            + '<circle cx="50" cy="50" r="44" fill="none" stroke="' + getRingTrackColor() + '" stroke-width="5"/>'
            + '<circle class="ptr-ring-bar" cx="50" cy="50" r="44" fill="none" stroke="' + getRingColor() + '" stroke-width="5" stroke-linecap="round" stroke-dasharray="' + CIRCUMFERENCE + '" stroke-dashoffset="' + CIRCUMFERENCE + '"/>'
            + '</svg>'
            + '<img src="logo-small-transparent.png" alt="بنيان" class="ptr-logo" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:72px;height:72px;">'
            + '</div>'
            + '</div>';
        document.body.appendChild(indicator);

        innerEl = indicator.querySelector('.ptr-inner');
        backdrop = indicator.querySelector('.ptr-bg');
        ringBar = indicator.querySelector('.ptr-ring-bar');
    }

    function showIndicator(dist) {
        if (!indicator) createIndicator();
        indicator.style.display = 'flex';
        innerEl.style.transition = 'none';
        backdrop.style.transition = 'none';

        if (dist < 5) {
            innerEl.style.opacity = '0';
            innerEl.style.transform = 'scale(0.2)';
            backdrop.style.opacity = '0';
            if (ringBar) ringBar.style.strokeDashoffset = String(CIRCUMFERENCE);
            return;
        }

        var pct = Math.min(dist / threshold, 1);
        var eased = pct * pct * (3 - 2 * pct);
        var scaleVal = 0.2 + eased * 0.8;
        var opacityVal = Math.min(eased * 1.6, 1);
        var bgOpacity = Math.min(eased * 0.55, 0.55);
        var offset = CIRCUMFERENCE - (pct * CIRCUMFERENCE);

        innerEl.style.opacity = '' + opacityVal;
        innerEl.style.transform = 'scale(' + scaleVal + ')';
        backdrop.style.opacity = '' + bgOpacity;
        if (ringBar) ringBar.style.strokeDashoffset = String(offset);
    }

    function hideIndicator() {
        if (indicator) {
            indicator.style.display = 'none';
            if (innerEl) {
                innerEl.style.transition = 'transform 0.3s cubic-bezier(0.4,0,0.2,1),opacity 0.25s ease';
                innerEl.style.opacity = '0';
                innerEl.style.transform = 'scale(0.2)';
            }
            if (backdrop) {
                backdrop.style.transition = 'opacity 0.3s ease';
                backdrop.style.opacity = '0';
            }
            if (ringBar) ringBar.style.strokeDashoffset = String(CIRCUMFERENCE);
        }
        pulling = false;
        locked = false;
    }

    function doRefresh() {
        locked = true;
        createIndicator();
        indicator.style.display = 'flex';

        innerEl.style.transition = 'none';
        innerEl.style.opacity = '1';
        innerEl.style.transform = 'scale(1)';
        backdrop.style.transition = 'none';
        backdrop.style.opacity = '0.55';

        if (ringBar) {
            var currentOffset = parseFloat(ringBar.style.strokeDashoffset) || CIRCUMFERENCE;
            ringBar.style.transition = 'none';
            ringBar.style.strokeDashoffset = String(currentOffset);
            void ringBar.offsetWidth;
            ringBar.style.transition = 'stroke-dashoffset 1.2s ease-in-out';
            ringBar.style.strokeDashoffset = '0';
        }

        var svgEl = indicator.querySelector('.ptr-ring-wrap svg');
        if (svgEl) {
            svgEl.style.transformOrigin = 'center center';
            svgEl.style.animation = 'ptr-spin 1.2s linear infinite';
        }

        setTimeout(function() { location.reload(); }, 1500);
    }

    function getScrollTop() {
        var el = document.querySelector('.page-content');
        if (el) return el.scrollTop;
        return window.pageYOffset || document.documentElement.scrollTop || 0;
    }

    function isAtTop() {
        return getScrollTop() <= 2;
    }

    function hasOverlay() {
        return !!document.querySelector('.brand-alert-overlay, .project-modal, .image-viewer, #page-loader.show, .notif-overlay');
    }

    function onTouchStart(e) {
        if (!isAtTop() || hasOverlay()) return;
        startY = e.touches[0].clientY;
        startX = e.touches[0].clientX;
        pulling = true;
        locked = false;
    }

    function onTouchMove(e) {
        if (!pulling || locked) return;
        var dy = e.touches[0].clientY - startY;
        var dx = Math.abs(e.touches[0].clientX - startX);
        if (dx > 30 || dy < 0 || !isAtTop()) {
            pulling = false;
            hideIndicator();
            return;
        }
        if (dy > 0) showIndicator(dy);
        if (dy >= threshold) {
            pulling = false;
            doRefresh();
        }
    }

    function onTouchEnd() {
        if (!pulling || locked) return;
        hideIndicator();
    }

    function init() {
        if (enabled) return;
        enabled = true;
        document.addEventListener('touchstart', onTouchStart, { passive: true });
        document.addEventListener('touchmove', onTouchMove, { passive: true });
        document.addEventListener('touchend', onTouchEnd, { passive: true });
    }

    return { init: init };
})();
