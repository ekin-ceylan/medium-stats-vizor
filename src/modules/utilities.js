export function createCell(template, text) {
    const cell = template.cloneNode(true);
    const className = text.replace('/', ' ').toLowerCase().split(' ').join('-');
    const contents = cell.querySelectorAll('p,span');
    contents[0].classList.add(className);
    contents[0].innerText = '-';
    contents[1].innerText = text;

    return cell;
}

export function createCellInfo(all, member) {
    return `<span>${all}</span> <small>(<span>${member}</span>)</small>`;
}

export function injectStyles(styleId, styleText) {
    if (!styleId || !styleText || document.getElementById(styleId)) {
        return;
    }

    const clean = styleText
        .replace(/(^\s+)|\n|(\s+$)/gm, '') // Remove newlines and leading/trailing spaces
        .replace(/\s*;?\s*}\s*/g, '}') // Remove any unnecessary spaces around '}' and the last ';'
        .replace(/\s*{\s*/g, '{') // Remove unnecessary spaces around '{'
        .replace(/\s*:\s*/g, ':') // Remove unnecessary spaces around ':'
        .trim();

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = clean;
    document.head.appendChild(style);
}

export function getUTCMidnight(date = new Date()) {
    return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}
