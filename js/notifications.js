/* ===== محرك الإشعارات - بنيان ===== */
/* يعمل محلياً الآن، جاهز للربط بالسيرفر لاحقاً */

var BuneanNotif = (function() {
    var STORAGE_KEY = 'bunean-notifications-local';
    var PERMISSION_KEY = 'bunean-notif-permission';

    /* ---- إذن الإشعارات ---- */
    function requestPermission(callback) {
        if (!('Notification' in window)) {
            console.log('Notifications not supported');
            if (callback) callback('denied');
            return;
        }
        if (Notification.permission === 'granted') {
            if (callback) callback('granted');
            return;
        }
        if (Notification.permission === 'denied') {
            if (callback) callback('denied');
            return;
        }
        Notification.requestPermission().then(function(permission) {
            localStorage.setItem(PERMISSION_KEY, permission);
            if (callback) callback(permission);
        });
    }

    function getPermission() {
        if (!('Notification' in window)) return 'unsupported';
        return Notification.permission;
    }

    /* ---- صوت الإشعار ---- */
    function playNotifSound() {
        try {
            var ctx = new (window.AudioContext || window.webkitAudioContext)();
            var notes = [
                { freq: 880, start: 0, dur: 0.12 },
                { freq: 1100, start: 0.12, dur: 0.12 },
                { freq: 1320, start: 0.24, dur: 0.18 }
            ];
            notes.forEach(function(n) {
                var osc = ctx.createOscillator();
                var gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.type = 'sine';
                osc.frequency.value = n.freq;
                gain.gain.setValueAtTime(0.3, ctx.currentTime + n.start);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + n.start + n.dur);
                osc.start(ctx.currentTime + n.start);
                osc.stop(ctx.currentTime + n.start + n.dur);
            });
        } catch(e) {}
    }

    /* ---- عرض إشعار المتصفح ---- */
    function showBrowserNotif(title, body, icon, onClick) {
        if (getPermission() !== 'granted') return;
        try {
            var notif = new Notification(title, {
                body: body,
                icon: icon || 'icon-192.png',
                badge: 'icon-192.png',
                tag: 'bunean-' + Date.now(),
                renotify: true,
                vibrate: [200, 100, 200]
            });
            notif.onclick = function() {
                window.focus();
                if (onClick) onClick();
                notif.close();
            };
            setTimeout(function() { notif.close(); }, 8000);
        } catch(e) {}
    }

    /* ---- إدارة الإشعارات المحلية ---- */
    function getLocalNotifs() {
        try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
        catch(e) { return []; }
    }

    function saveLocalNotifs(list) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    }

    function addLocalNotif(notif) {
        var list = getLocalNotifs();
        notif.id = notif.id || ('ln_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4));
        notif.read = false;
        notif.time = notif.time || 'الآن';
        notif.createdAt = new Date().toISOString();
        list.unshift(notif);
        if (list.length > 100) list = list.slice(0, 100);
        saveLocalNotifs(list);
        return notif;
    }

    function markRead(id) {
        var list = getLocalNotifs();
        for (var i = 0; i < list.length; i++) {
            if (list[i].id === id) { list[i].read = true; break; }
        }
        saveLocalNotifs(list);
    }

    function markAllRead() {
        var list = getLocalNotifs();
        for (var i = 0; i < list.length; i++) list[i].read = true;
        saveLocalNotifs(list);
    }

    function getUnreadCount() {
        var list = getLocalNotifs();
        var count = 0;
        for (var i = 0; i < list.length; i++) { if (!list[i].read) count++; }
        return count;
    }

    function clearAll() {
        saveLocalNotifs([]);
    }

    /* ---- إرسال إشعار كامل (محلي + متصفح + صوت) ---- */
    function send(options) {
        options = options || {};
        var notif = addLocalNotif({
            type: options.type || 'support',
            title: options.title || 'إشعار جديد',
            preview: options.preview || options.body || '',
            message: options.message || options.body || '',
            link: options.link || '',
            data: options.data || {}
        });

        playNotifSound();
        showBrowserNotif(
            notif.title,
            notif.preview,
            options.icon,
            options.onClick || (options.link ? function() { window.location.href = options.link; } : null)
        );

        updateBadge();
        return notif;
    }

    /* ---- تحديث شارة (Badge) ---- */
    function updateBadge() {
        var count = getUnreadCount();
        if ('setAppBadge' in navigator) {
            try { navigator.setAppBadge(count); } catch(e) {}
        }
        document.querySelectorAll('.notif-badge').forEach(function(el) {
            el.textContent = count || '';
            el.style.display = count ? 'flex' : 'none';
        });
    }

    /* ---- جاهز للسيرفر: استبدل هذا لاحقاً ---- */
    function initPolling(intervalMs) {
        intervalMs = intervalMs || 30000;

        /* عند الربط بالسيرفر، استبدل المحتوى:
        setInterval(function() {
            fetch('/api/notifications', {
                headers: { 'Authorization': 'Bearer ' + getToken() }
            })
            .then(function(r) { return r.json(); })
            .then(function(data) {
                data.forEach(function(n) {
                    addLocalNotif(n);
                    playNotifSound();
                    showBrowserNotif(n.title, n.preview, null, function() {
                        if (n.link) window.location.href = n.link;
                    });
                });
                updateBadge();
            });
        }, intervalMs);
        */
    }

    return {
        requestPermission: requestPermission,
        getPermission: getPermission,
        send: send,
        getLocalNotifs: getLocalNotifs,
        markRead: markRead,
        markAllRead: markAllRead,
        getUnreadCount: getUnreadCount,
        clearAll: clearAll,
        updateBadge: updateBadge,
        playNotifSound: playNotifSound,
        showBrowserNotif: showBrowserNotif,
        initPolling: initPolling
    };
})();
