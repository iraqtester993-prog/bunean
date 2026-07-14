/* ===== زر الرجوع الموحد - بنيان ===== */

var BackNav = (function() {
    var MAIN_PAGES = ['home.html', 'execute.html', 'market.html', 'ideas.html', 'account.html'];
    var exitPending = false;
    var exitTimer = null;
    var closeHandlers = [];
    var initialized = false;

    function currentPage() {
        var path = window.location.pathname.split('/').pop();
        return path || 'home.html';
    }

    function isMainPage() {
        var page = currentPage();
        return MAIN_PAGES.indexOf(page) !== -1;
    }

    function showExitToast() {
        var t = document.getElementById('exitToast');
        if (t) {
            t.classList.add('show');
            clearTimeout(exitTimer);
            exitTimer = setTimeout(function() { t.classList.remove('show'); }, 2000);
            return;
        }
        var toast = document.createElement('div');
        toast.id = 'exitToast';
        toast.className = 'exit-toast';
        toast.textContent = 'اضغط مرة أخرى للخروج';
        document.body.appendChild(toast);
        requestAnimationFrame(function() { toast.classList.add('show'); });
        clearTimeout(exitTimer);
        exitTimer = setTimeout(function() { toast.classList.remove('show'); }, 2000);
    }

    function onPopState() {
        for (var i = closeHandlers.length - 1; i >= 0; i--) {
            if (closeHandlers[i]()) return;
        }
        if (!isMainPage()) {
            window.history.back();
            return;
        }
        if (!exitPending) {
            exitPending = true;
            showExitToast();
            window.history.pushState({ action: 'exit' }, '');
            setTimeout(function() { exitPending = false; }, 2000);
            return;
        }
        window.location.replace('about:blank');
    }

    function registerCloseHandler(fn) {
        closeHandlers.push(fn);
        return function() {
            var idx = closeHandlers.indexOf(fn);
            if (idx !== -1) closeHandlers.splice(idx, 1);
        };
    }

    function init() {
        if (initialized) return;
        initialized = true;
        window.addEventListener('popstate', onPopState);
    }

    return {
        init: init,
        isMainPage: isMainPage,
        registerCloseHandler: registerCloseHandler,
        showExitToast: showExitToast
    };
})();
