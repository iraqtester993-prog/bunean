/* ===== دوال مشتركة - بنيان ===== */

function goTo(url) { window.location.href = url; }

function preserveState(key, data) { try { sessionStorage.setItem('bunean_state_' + key, JSON.stringify(data)); } catch(e) {} }
function restoreState(key, def) { try { var v = sessionStorage.getItem('bunean_state_' + key); return v ? JSON.parse(v) : def; } catch(e) { return def; } }

function fmt(n) {
    if (n === null || n === undefined || n === '') return '';
    var s = String(n).replace(/[^0-9]/g, '');
    if (!s) return String(n);
    var parts = [];
    while (s.length > 3) { parts.unshift(s.slice(-3)); s = s.slice(0, -3); }
    parts.unshift(s);
    return parts.join(',') + ' د.ع';
}
