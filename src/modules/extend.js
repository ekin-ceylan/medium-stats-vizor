// prettier-ignore
import { MS_PER_DAY, REFRESH_SVG, ENHANCED_PAGE_STYLES,BUTTON_CLASS_NAME, INFO_SELECTOR, BUTTON_SELECTOR,
    DOT_SELECTOR, DESKTOP_BREAKPOINT, ACTIVE_CLASS_NAME, ASTERISK_SELECTOR, STYLE_NAME,
    LAST_EARN_LABEL, LAST_EARN_SELECTOR } from './constants.js';
import { injectStyles, createCell, createHeaderCell, createCellInfo, getUTCMidnight } from './utilities.js';
import getStats from './fetch-stats.js';
import Result from '../models/result.js';

const isMobile = () => window.innerWidth < DESKTOP_BREAKPOINT;
const rowQuery = () => (isMobile() ? 'div:has(> a + a) > a' : 'table tbody tr');
const detailsQuery = () => (isMobile() ? '.ac.r' : 'td:nth-child(1) > a > div > div > div > div');
const headViewQuery =  'th:nth-child(3)';
const viewQuery = () => (isMobile() ? 'a > div:last-child > div:nth-child(1)' : 'td:nth-child(2)');
const readQuery = () => (isMobile() ? 'a > div:last-child > div:nth-child(2)' : 'td:nth-child(3)');
const headEarningQuery =  'th:nth-child(5)';
const earningQuery = () => (isMobile() ? 'a > div:last-child > div:nth-child(3)' : 'td:nth-child(4)');

export default function extend() {
    const rows = document.querySelectorAll(rowQuery());
    const trs = document.querySelectorAll('thead tr');

    trs.forEach(tr => {
        if (tr.classList.contains('has-enhanced-stats')) return;

        const headView = tr.querySelector(headViewQuery);
        const headEarning = tr.querySelector(headEarningQuery);

        const headRatio = createHeaderCell(headView, 'Reads / Views');
        const headLastEarn = createHeaderCell(headView, LAST_EARN_LABEL);

        // headLastEarn elementini headEarning elementinin önüne ekle
        tr.insertBefore(headLastEarn, headEarning);
        tr.insertBefore(headRatio, headView);
        tr.classList.add('has-enhanced-stats');
    });

    rows.forEach(row => {
        const hasButton = !!row.querySelector(BUTTON_SELECTOR);
        const id = getId(row);

        if (hasButton || !id) return;

        const viewsCell = row.querySelector(viewQuery());
        const readsCell = row.querySelector(readQuery());
        const earningCell = row.querySelector(earningQuery());
        const detailsDiv = row.querySelector(detailsQuery());
        const dot = detailsDiv?.querySelector(DOT_SELECTOR).cloneNode(true);

        const views = viewsCell.querySelectorAll(INFO_SELECTOR);
        const read = readsCell.querySelector(INFO_SELECTOR);

        const viewsCount = Number(views[0]?.innerText || 0);
        const readsCount = Number(read?.innerText || 0);
        const percent = Math.round((readsCount / viewsCount) * 100);
        const percentText = isNaN(percent) ? '-' : `${percent}%`;

        const button = createButton(row, id);

        const viewCell = createCell(earningCell, 'Views');
        const readCell = createCell(earningCell, 'Reads');
        const earnCell = createCell(earningCell, LAST_EARN_LABEL);

        earningCell.parentNode.insertBefore(viewCell, earningCell);
        earningCell.parentNode.insertBefore(readCell, earningCell);
        earningCell.parentNode.insertBefore(earnCell, earningCell);

        views[0].innerHTML = createCellInfo(percentText, `${readsCount}/${viewsCount}`);
        views[1] && (views[1].innerText = 'Reads / Views');
        readsCell.remove();

        detailsDiv.appendChild(dot);
        detailsDiv.appendChild(button);
        button.click();
    });
}

async function getData(row, id, isPremium) {
    const yesterday = getUTCMidnight() - MS_PER_DAY;

    try {
        const data = await getStats(id, isPremium);
        const results = new Result();
        const buckets = data?.postStatsDailyBundle?.buckets;
        results.YesterdayEarnings = data?.post?.earnings?.dailyEarnings[0]?.amount || 0;

        buckets.forEach(bucket => {
            if (bucket.membershipType === 'MEMBER' && bucket.dayStartsAt > yesterday) {
                results.MemberViews = bucket.readersThatViewedCount || 0;
                results.MemberReads = bucket.readersThatReadCount || 0;
            } else if (bucket.membershipType === 'NONMEMBER' && bucket.dayStartsAt > yesterday) {
                results.NonMemberViews = bucket.readersThatViewedCount || 0;
                results.NonMemberReads = bucket.readersThatReadCount || 0;
            } else if (bucket.membershipType === 'MEMBER') {
                results.YesterdayMemberReads = bucket.readersThatReadCount || 0;
            }
        });

        updateResults(row, results);
    } catch (e) {
        console.error('❗ Fetch error:', e);
    }
}

function updateResults(row, results) {
    if (results.AllViews) {
        const viewsCell = row.querySelector('.views');
        const readsCell = row.querySelector('.reads');

        viewsCell.innerHTML = createCellInfo(results.AllViews, results.MemberViews);
        readsCell.innerHTML = createCellInfo(results.AllReads, results.MemberReads);
    }

    if (results.YesterdayMemberReads) {
        const lastCell = row.querySelector(LAST_EARN_SELECTOR);
        lastCell.innerHTML = createCellInfo(results.TxtEarns, results.YesterdayMemberReads);
    }
}

function getId(row) {
    const href = isMobile()
        ? row.getAttribute('href')
        : row.querySelector('a[href*="/me/stats/post/"]')?.getAttribute('href');

    const postIdMatch = href?.match(/\/post\/([^/?]+)/);

    return postIdMatch?.[1];
}

function createButton(row, postId) {
    const isPremium = !!row.querySelector(ASTERISK_SELECTOR);
    const button = document.createElement('button');
    button.innerHTML = REFRESH_SVG;
    button.className = BUTTON_CLASS_NAME;

    button.onclick = async event => {
        event.stopPropagation();
        event.preventDefault();
        button.classList.add(ACTIVE_CLASS_NAME);
        await getData(row, postId, isPremium);
        button.classList.remove(ACTIVE_CLASS_NAME);
    };

    return button;
}

injectStyles(STYLE_NAME, ENHANCED_PAGE_STYLES);
