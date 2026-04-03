(function () {
    const STORAGE_KEY = 'rv-agua-theme';
    const LIGHT = 'light';
    const DARK = 'dark';

    function getPreferred() {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored === DARK || stored === LIGHT) return stored;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? DARK : LIGHT;
    }

    function apply(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem(STORAGE_KEY, theme);
        updateToggleIcon(theme);
    }

    function updateToggleIcon(theme) {
        const btn = document.getElementById('theme-toggle');
        if (!btn) return;
        btn.textContent = theme === DARK ? '\u2600' : '\u263E';
        btn.setAttribute('aria-label', theme === DARK ? 'Modo claro' : 'Modo escuro');
    }

    function toggle() {
        const current = document.documentElement.getAttribute('data-theme') || LIGHT;
        apply(current === DARK ? LIGHT : DARK);
    }

    const initial = getPreferred();
    document.documentElement.setAttribute('data-theme', initial);

    document.addEventListener('DOMContentLoaded', function () {
        updateToggleIcon(initial);
        document.getElementById('theme-toggle')?.addEventListener('click', toggle);

        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
            if (!localStorage.getItem(STORAGE_KEY)) {
                apply(e.matches ? DARK : LIGHT);
            }
        });
    });
})();
