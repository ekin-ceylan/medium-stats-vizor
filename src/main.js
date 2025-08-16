import extend from './modules/extend.js';

let observer;
let currentUrl = '';

function isStatsPage() {
    return window.location.href.includes('/stats');
}

function startExtension() {
    if (!isStatsPage()) {
        console.log('Not on a stats page, skipping extension');
        return;
    }

    setTimeout(extend, 1000);
    observePageChanges();
}

function observePageChanges() {
    observer = new MutationObserver((mutationsList, observer) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                // URL değişikliğini kontrol et
                if (currentUrl !== window.location.href) {
                    currentUrl = window.location.href;
                    // Stats sayfasına geçildiyse extension'ı başlat
                    if (isStatsPage()) {
                        setTimeout(extend, 500);
                    } else {
                        // Stats sayfasından çıkıldıysa durdurmaya gerek yok,
                        // sadece extend çalıştırma
                        console.log('Left stats page');
                    }
                } else if (isStatsPage()) {
                    // Aynı stats sayfasında DOM değişikliği
                    extend();
                }
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });
}

window.addEventListener('load', () => {
    currentUrl = window.location.href;
    startExtension();
});
