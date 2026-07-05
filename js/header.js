function renderHeader(options) {
    options = options || {};
    var showBack = options.showBack || false;
    var backLink = options.backLink || 'home.html';
    var searchPlaceholder = options.searchPlaceholder || 'ابحث عن مواد أو خدمات...';
    var searchVModel = options.searchVModel || null;
    var cartBadge = options.cartBadge || false;
    var title = options.title || null;

    var backBtn = showBack
        ? '<a href="' + backLink + '" class="nav-back"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg></a>'
        : '';

    var searchHtml = title
        ? '<div style="flex:1;display:flex;align-items:center;justify-content:center;"><span class="header-title" style="font-size:16px;font-weight:700;font-family:Cairo,sans-serif;">' + title + '</span></div>'
        : '<div class="search-bar"><span class="material-symbols-outlined">search</span>'
        + (searchVModel
            ? '<input type="text" v-model="' + searchVModel + '" placeholder="' + searchPlaceholder + '">'
            : '<input type="text" placeholder="' + searchPlaceholder + '">')
        + '</div>';

    var notifHtml = '<a href="notifications.html" class="nav-icon material-symbols-outlined" id="headerNotifBtn">notifications</a>';

    return '<header class="top-nav">'
        + backBtn
        + '<div class="nav-brand">'
        + '<img src="logo-small-transparent.png" alt="بنيان" style="width:44px;height:44px;">'
        + '<span style="font-size:18px;font-weight:700;color:var(--accent-gold);">بنيان</span></div>'
        + searchHtml
        + '<div class="nav-actions">'
        + notifHtml
        + '</div>'
        + '</header>';
}

// ===== تثبيت التطبيق (PWA Install Banner) =====
(function() {
    var deferredPrompt = null;

    window.addEventListener('beforeinstallprompt', function(e) {
        e.preventDefault();
        deferredPrompt = e;
        showInstallBanner();
    });

    window.addEventListener('appinstalled', function() {
        deferredPrompt = null;
        var banner = document.querySelector('.install-banner');
        if (banner) banner.remove();
    });

    function showInstallBanner() {
        if (localStorage.getItem('bunean-install-dismissed')) return;
        if (document.querySelector('.install-banner')) return;

        var banner = document.createElement('div');
        banner.className = 'install-banner';
        banner.innerHTML = '<div class="install-banner-content">'
            + '<div class="install-banner-text">'
            + '<span class="material-symbols-outlined" style="font-size:28px;color:var(--accent-gold);">download</span>'
            + '<div>'
            + '<div style="font-size:14px;font-weight:700;color:var(--text-white);">تثبيت بنيان على جهازك</div>'
            + '<div style="font-size:12px;color:var(--text-muted);">ثبّت التطبيق للوصول السريع من شاشة هاتفك</div>'
            + '</div>'
            + '</div>'
            + '<div class="install-banner-actions">'
            + '<button class="install-banner-btn" onclick="window.__installApp()">تثبيت</button>'
            + '<button class="install-banner-close" onclick="window.__dismissInstall()">×</button>'
            + '</div>'
            + '</div>';

        document.body.appendChild(banner);
        setTimeout(function() { banner.classList.add('show'); }, 100);
    }

    window.__installApp = function() {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then(function() {
            deferredPrompt = null;
            var banner = document.querySelector('.install-banner');
            if (banner) banner.remove();
        });
    };

    window.__dismissInstall = function() {
        localStorage.setItem('bunean-install-dismissed', 'true');
        var banner = document.querySelector('.install-banner');
        if (banner) banner.classList.remove('show');
        setTimeout(function() { if (banner) banner.remove(); }, 300);
    };
})();
