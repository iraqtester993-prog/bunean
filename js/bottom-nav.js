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
    if (!data) {
        var o = document.querySelector('.brand-alert-overlay'); if(o) o.remove();
        var l = document.createElement('div'); l.className = 'brand-alert-overlay';
        var d = document.createElement('div'); d.className = 'brand-alert-modal'; d.onclick = function(e) { e.stopPropagation(); };
        var i = document.createElement('div'); i.className = 'brand-alert-icon-wrap';
        i.innerHTML = '<span class="material-symbols-outlined brand-alert-icon">person_add</span>';
        var t = document.createElement('p'); t.className = 'brand-alert-text'; t.textContent = 'يجب إنشاء حساب للمتابعة';
        var b = document.createElement('button'); b.className = 'brand-alert-btn'; b.textContent = 'إنشاء حساب';
        b.onclick = function() { window.location.href = 'index.html'; };
        d.appendChild(i); d.appendChild(t); d.appendChild(b); l.appendChild(d);
        l.onclick = function() { l.remove(); };
        document.body.appendChild(l);
        return;
    }
    if (callback) callback();
}
