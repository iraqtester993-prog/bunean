(function() {
    var el = null, imgs = [], idx = 0, sc = 1, px = 0, py = 0;
    var pinch = false, sx = 0, sy = 0, d0 = 0, tap = 0;

    function style(el, obj) { for (var k in obj) el.style[k] = obj[k]; }

    function build() {
        if (el) return;
        el = document.createElement('div');
        style(el, {
            position:'fixed', inset:'0', zIndex:'9999', background:'rgba(0,0,0,0.95)',
            display:'none', alignItems:'center', justifyContent:'center', flexDirection:'column'
        });
        var html = '<div id="gv-close-btn" style="position:absolute;top:16px;left:16px;width:40px;height:40px;border-radius:50%;background:rgba(255,255,255,0.15);border:none;color:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:10;font-size:24px;font-family:sans-serif;">✕</div>';
        html += '<div id="gv-prev-btn" style="position:absolute;top:50%;right:16px;transform:translateY(-50%);width:44px;height:44px;border-radius:50%;background:rgba(255,255,255,0.12);border:none;color:#fff;display:none;align-items:center;justify-content:center;cursor:pointer;z-index:10;font-size:28px;font-family:sans-serif;">‹</div>';
        html += '<div id="gv-wrap" style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;padding:60px 16px;position:relative;">';
        html += '<img id="gv-main-img" style="max-width:100%;max-height:100%;object-fit:contain;user-select:none;">';
        html += '</div>';
        html += '<div id="gv-next-btn" style="position:absolute;top:50%;left:16px;transform:translateY(-50%);width:44px;height:44px;border-radius:50%;background:rgba(255,255,255,0.12);border:none;color:#fff;display:none;align-items:center;justify-content:center;cursor:pointer;z-index:10;font-size:28px;font-family:sans-serif;">›</div>';
        html += '<div id="gv-counter" style="position:absolute;bottom:24px;left:50%;transform:translateX(-50%);color:rgba(255,255,255,0.7);font-size:14px;font-weight:600;background:rgba(0,0,0,0.5);padding:6px 16px;border-radius:20px;display:none;"></div>';
        el.innerHTML = html;
        document.body.appendChild(el);

        document.getElementById('gv-close-btn').onclick = close;
        document.getElementById('gv-prev-btn').onclick = prev;
        document.getElementById('gv-next-btn').onclick = next;
        document.getElementById('gv-wrap').onclick = function(e) { if (e.target === this) close(); };

        el.addEventListener('touchstart', function(e) {
            if (e.touches.length === 2) { pinch = true; d0 = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY); return; }
            pinch = false; sx = e.touches[0].clientX; sy = e.touches[0].clientY;
            var n = Date.now(); if (n - tap < 300) { sc = sc > 1.1 ? 1 : 2.5; px = 0; py = 0; render(); } tap = n;
        }, { passive: true });
        el.addEventListener('touchmove', function(e) {
            if (e.touches.length === 2 && pinch) {
                var d = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
                sc = Math.max(1, Math.min(5, sc * (1 + ((d / (d0||1)) - 1) * 0.5))); d0 = d; render(); return;
            }
            if (sc > 1.1) { px += e.touches[0].clientX - sx; py += e.touches[0].clientY - sy; sx = e.touches[0].clientX; sy = e.touches[0].clientY; render(); }
        }, { passive: true });
        el.addEventListener('touchend', function(e) {
            if (pinch) { pinch = false; return; }
            if (sc > 1.1) return;
            var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
            if (Math.abs(dy) > Math.abs(dx) && dy > 80) close();
            else if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) { var n = idx + (dx < 0 ? 1 : -1); if (n >= 0 && n < imgs.length) { idx = n; sc = 1; px = 0; py = 0; render(); } }
        });
    }

    function render() {
        var img = document.getElementById('gv-main-img');
        if (img && imgs[idx]) { img.src = imgs[idx]; img.style.transform = 'scale(' + sc + ') translate(' + (px/sc) + 'px, ' + (py/sc) + 'px)'; }
        var counter = document.getElementById('gv-counter');
        if (counter) { counter.textContent = imgs.length > 1 ? (idx + 1) + ' / ' + imgs.length : ''; counter.style.display = imgs.length > 1 ? '' : 'none'; }
        var p = document.getElementById('gv-prev-btn'), n = document.getElementById('gv-next-btn');
        if (p) p.style.display = imgs.length > 1 ? 'flex' : 'none';
        if (n) n.style.display = imgs.length > 1 ? 'flex' : 'none';
    }

    function open(imgEl) {
        if (!imgEl) return;
        var src = imgEl.getAttribute('src');
        if (!src) return;

        // Collect nearby images for swipe navigation (if inside a gallery)
        var gallery = imgEl.closest('[data-viewer-gallery]');
        if (gallery) {
            var found = -1, urls = [], seen = {};
            var all = gallery.querySelectorAll('img');
            for (var i = 0; i < all.length; i++) {
                var u = all[i].getAttribute('src');
                if (!u || seen[u]) continue;
                seen[u] = true;
                urls.push(u);
                if (u === src) found = urls.length - 1;
            }
            if (found < 0) { urls.push(src); found = urls.length - 1; }
            imgs = urls; idx = found;
        } else {
            imgs = [src]; idx = 0;
        }
        sc = 1; px = 0; py = 0;
        render();
        el.style.display = 'flex';
    }

    function close() { if (el) { el.style.display = 'none'; } }
    function next() { if (idx < imgs.length - 1) { idx++; sc = 1; px = 0; py = 0; render(); } }
    function prev() { if (idx > 0) { idx--; sc = 1; px = 0; py = 0; render(); } }

    document.addEventListener('click', function(e) {
        var t = e.target;
        if (t.tagName !== 'IMG') return;
        if (t.closest('#gv-wrap, #gv-close-btn, #gv-prev-btn, #gv-next-btn')) return;
        if (t.closest('button, a, [onclick]')) return;
        if (t.closest('nav, .top-nav, .bottom-nav, #bottomNav')) return;
        if (t.closest('.image-viewer, .viewer-image-wrap, .viewer-close, .viewer-nav')) return;
        if (t.closest('.idea-project-card, .project-card, .work-card, .ad-slider-slide, .prod-card, .prod-gallery-slide, .mkt-product-card, .partner-item, .ideas-cat-square, .section-header, .exec-cat-card, .exec-company-card, .exec-slider-slide, [data-viewer-ignore]')) return;
        if (t.matches('img[class*="logo"], img[class*="avatar"], img[class*="icon"], .company-cover, .company-logo img')) return;
        if (t.offsetWidth < 40 || t.offsetHeight < 40) return;
        build();
        open(t);
    });

    document.addEventListener('keydown', function(e) {
        if (!el || el.style.display === 'none') return;
        if (e.key === 'Escape') close();
        if (e.key === 'ArrowLeft') prev();
        if (e.key === 'ArrowRight') next();
    });
})();
