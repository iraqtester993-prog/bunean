(function() {
    // Create loader overlay
    var overlay = document.createElement('div');
    overlay.id = 'page-loader';
    overlay.innerHTML =
        '<div class="pl-logo-wrap">' +
            '<img src="logo-small-transparent.png" alt="بنيان" class="pl-logo">' +
            '<div class="pl-ring">' +
                '<svg width="100" height="100" viewBox="0 0 100 100">' +
                    '<circle cx="50" cy="50" r="44" fill="none" stroke="rgba(201,162,67,0.1)" stroke-width="4"/>' +
                    '<circle class="pl-ring-bar" cx="50" cy="50" r="44" fill="none" stroke="var(--accent-gold,#c9a243)" stroke-width="4" stroke-linecap="round" stroke-dasharray="276.46" stroke-dashoffset="276.46"/>' +
                '</svg>' +
            '</div>' +
        '</div>';

    // Inject styles
    var style = document.createElement('style');
    style.textContent =
        '#page-loader{position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;' +
        'background:#0b1a2e;opacity:0;visibility:hidden;transition:opacity 0.35s ease,visibility 0.35s ease;pointer-events:none;}' +
        '#page-loader.show{opacity:1;visibility:visible;pointer-events:all;}' +
        '.pl-logo-wrap{position:relative;display:flex;align-items:center;justify-content:center;width:120px;height:120px;}' +
        '.pl-logo{width:64px;height:64px;animation:pl-bounce 1.2s ease-in-out infinite;}' +
        '.pl-ring{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;}' +
        '.pl-ring svg{transform:rotate(-90deg);}' +
        '.pl-ring-bar{animation:pl-dash 1.2s linear infinite;}' +
        '@keyframes pl-bounce{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}' +
        '@keyframes pl-dash{0%{stroke-dashoffset:276.46;}50%{stroke-dashoffset:69;}100%{stroke-dashoffset:276.46;}}';
    document.head.appendChild(style);
    document.body.appendChild(overlay);

    // Show loader
    function showLoader() {
        overlay.classList.add('show');
    }

    // Hide loader
    function hideLoader() {
        overlay.classList.remove('show');
    }

    // Hide on page load
    window.addEventListener('load', function() {
        setTimeout(hideLoader, 200);
    });

    // Intercept link clicks for page transitions
    document.addEventListener('click', function(e) {
        var link = e.target.closest('a[href]');
        if (!link) return;

        var href = link.getAttribute('href');
        if (!href) return;

        // Skip: external links, anchors, javascript:, mailto:, tel:, blank target
        if (href.indexOf('http') === 0 || href.indexOf('#') === 0 ||
            href.indexOf('javascript:') === 0 || href.indexOf('mailto:') === 0 ||
            href.indexOf('tel:') === 0 || link.target === '_blank') return;

        // Skip if same page
        var currentPath = window.location.pathname.split('/').pop() || 'index.html';
        var targetPath = href.split('?')[0].split('#').pop();
        if (targetPath === currentPath) return;

        // Show loader before navigation
        showLoader();
    });

    // Also show on back/forward navigation
    window.addEventListener('pageshow', function(e) {
        if (e.persisted) {
            showLoader();
            setTimeout(hideLoader, 300);
        }
    });
})();
