// ===== HTML ESCAPING HELPER — prevents stored XSS via unescaped user-controlled fields =====
function escapeHTML(str) {
    if (str === null || str === undefined) return '';
    return String(str).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// For values embedded inside inline onclick="fn('...')" handlers: must be safe
// both as a single-quoted JS string AND as the surrounding double-quoted HTML attribute.
function escapeForInlineHandler(str) {
    if (str === null || str === undefined) return '';
    return String(str)
        .replace(/\\/g, '\\\\')
        .replace(/'/g, "\\'")
        .replace(/"/g, '&quot;')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '');
}

// Only allow well-formed data: URIs through to src attributes (voice/image), reject anything else.
function safeDataUrl(str, expectedType) {
    if (typeof str !== 'string') return '';
    return new RegExp('^data:' + expectedType + '/[a-zA-Z0-9.+-]+;base64,[A-Za-z0-9+/=]+$').test(str) ? str : '';
}
