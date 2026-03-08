import { INFO_SELECTOR } from '../modules/constants.js';

export function createCell(template, text) {
    const cell = template.cloneNode(true);
    const className = text.replace('/', ' ').toLowerCase().split(' ').join('-');
    const contents = cell.querySelectorAll(INFO_SELECTOR);
    contents[0].classList.add(className);
    contents[0].innerText = '-';
    contents[1] && (contents[1].innerText = text);

    return cell;
}

export function createHeaderCell(template, text) {
    const cell = template.cloneNode(true);
    cell.style.minWidth = '130px';
    const content = cell.querySelector(INFO_SELECTOR);
    content.innerText = text;

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
        .replaceAll(/(^\s+)|\n|(\s+$)/gm, '') // Remove newlines and leading/trailing spaces
        .replaceAll(/\s*;?\s*}\s*/g, '}') // Remove any unnecessary spaces around '}' and the last ';'
        .replaceAll(/\s*{\s*/g, '{') // Remove unnecessary spaces around '{'
        .replaceAll(/\s*:\s*/g, ':') // Remove unnecessary spaces around ':'
        .trim();

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = clean;
    document.head.appendChild(style);
}

export function getUTCMidnight(date = new Date()) {
    return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}

export function parseCount(text) {
    if (!text) return 0;

    const match = text.match(/^([\d.]+)([KM]?)$/);

    if (!match) return Number(text) || 0;

    let [, num, suffix] = match;
    num = Number.parseFloat(num);

    if (suffix === 'K') return num * 1000;
    if (suffix === 'M') return num * 1000000;
    return num;
}
