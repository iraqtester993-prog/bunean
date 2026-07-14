function renderNav(activePage) {
    var items = [
        { page: 'home', label: 'الرئيسية', icon: 'home', href: 'home.html' },
        { page: 'execute', label: 'تنفيذ', icon: 'engineering', href: 'execute.html' },
        { page: 'market', label: 'سوق البناء', icon: 'shopping_cart', href: 'market.html' },
        { page: 'ideas', label: 'أفكار', icon: 'lightbulb', href: 'ideas.html' },
        { page: 'account', label: 'حسابي', icon: 'person', href: 'account.html' }
    ];

    var html = '<nav class="bottom-nav">';

    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        var activeClass = activePage === item.page ? ' active' : '';
        var extraAttr = item.page === 'home' ? ' onclick="localStorage.removeItem(\'bunean_showAllWorks\')"' : '';
        html += '<a href="' + item.href + '" class="nav-item' + activeClass + '"' + extraAttr + '>'
            + '<span class="material-symbols-outlined">' + item.icon + '</span>'
            + '<span>' + item.label + '</span>'
            + '</a>';
    }

    html += '</nav>';
    return html;
}

function requireAccount(callback) {
    var data = (function() { try { return JSON.parse(localStorage.getItem('bunean-user-data')); } catch(e) { return null; } })();
    var auth = localStorage.getItem('bunean-user-auth');
    var isGuest = !data && !auth;

    if (isGuest) {
        if (callback) {
            var o = document.querySelector('.brand-alert-overlay'); if(o) o.remove();
            var l = document.createElement('div'); l.className = 'brand-alert-overlay';
            var d = document.createElement('div'); d.className = 'brand-alert-modal'; d.onclick = function(e) { e.stopPropagation(); };
            var ic = document.createElement('div'); ic.className = 'brand-alert-icon-wrap';
            ic.innerHTML = '<span class="material-symbols-outlined brand-alert-icon">person_add</span>';
            var t = document.createElement('p'); t.className = 'brand-alert-text'; t.textContent = 'يجب إنشاء حساب للمتابعة';
            var b = document.createElement('button'); b.className = 'brand-alert-btn'; b.textContent = 'إنشاء حساب';
            b.onclick = function() { window.location.href = 'index.html'; };
            d.appendChild(ic); d.appendChild(t); d.appendChild(b); l.appendChild(d);
            l.onclick = function() { l.remove(); };
            document.body.appendChild(l);
            return;
        }
        document.body.classList.add('guest-blocked');
        var o2 = document.querySelector('.guest-block-overlay'); if(o2) o2.remove();
        var ov = document.createElement('div'); ov.className = 'guest-block-overlay';
        ov.innerHTML = '<div class="guest-block-modal">'
            + '<div class="guest-block-icon"><span class="material-symbols-outlined">person_add</span></div>'
            + '<p class="guest-block-text">يجب إنشاء حساب للمتابعة</p>'
            + '<div class="guest-block-actions">'
            + '<button class="guest-block-btn guest-block-primary" onclick="window.location.href=\'index.html\'">إنشاء حساب</button>'
            + '<button class="guest-block-btn guest-block-secondary" onclick="window.location.href=\'privacy.html\'">سياسة الخصوصية</button>'
            + '</div>'
            + '<div class="guest-block-theme" onclick="var isL=document.documentElement.classList.toggle(\'light-mode\');localStorage.setItem(\'bunean-theme\',isL?\'light\':\'dark\');var ic=document.getElementById(\'guestThemeIcon\');var lb=document.getElementById(\'guestThemeLabel\');if(ic)ic.textContent=isL?\'dark_mode\':\'light_mode\';if(lb)lb.textContent=isL?\'الوضع الليلي\':\'الوضع النهاري\';">'
            + '<span class="material-symbols-outlined" id="guestThemeIcon">' + (document.documentElement.classList.contains('light-mode') ? 'dark_mode' : 'light_mode') + '</span>'
            + '<span id="guestThemeLabel">' + (document.documentElement.classList.contains('light-mode') ? 'الوضع الليلي' : 'الوضع النهاري') + '</span>'
            + '</div>'
            + '</div>';
        document.body.appendChild(ov);
        return;
    }
    if (callback) callback();
}
