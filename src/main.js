import extend from './modules/extend.js';

function observePageChanges() {
    const observer = new MutationObserver((mutationsList, observer) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                extend(); // Add buttons when DOM changes
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true, // Watch changes in all child nodes
    });
}

window.addEventListener('load', () => {
    setTimeout(extend, 1000); // Run for the first time
    observePageChanges(); // Watch for changes in the DOM
});
