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
    var installHtml = '<button class="nav-icon material-symbols-outlined install-btn" onclick="window.__installApp()" title="تثبيت التطبيق">download</button>';

    return '<header class="top-nav">'
        + backBtn
        + '<div class="nav-brand">'
        + '<img src="logo-small-transparent.png" alt="بنيان" style="width:44px;height:44px;">'
        + '<span style="font-size:18px;font-weight:700;color:var(--accent-gold);">بنيان</span></div>'
        + searchHtml
        + '<div class="nav-actions">'
        + installHtml
        + notifHtml
        + '</div>'
        + '</header>';
}

// ===== تثبيت التطبيق (PWA Install) =====
(function() {
    var deferredPrompt = null;

    window.addEventListener('beforeinstallprompt', function(e) {
        e.preventDefault();
        deferredPrompt = e;
        showBtn();
    });

    function showBtn() {
        var btn = document.querySelector('.install-btn');
        if (btn) {
            btn.style.display = 'flex';
        } else {
            setTimeout(showBtn, 200);
        }
    }

    window.addEventListener('appinstalled', function() {
        deferredPrompt = null;
        var btn = document.querySelector('.install-btn');
        if (btn) btn.style.display = 'none';
    });

    window.__installApp = function() {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then(function() {
                deferredPrompt = null;
            });
        } else {
            var btn = document.querySelector('.install-btn');
            if (btn) btn.style.display = 'none';
        }
    };
})();
