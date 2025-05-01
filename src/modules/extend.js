import { injectStyles, createCell, createCellInfo, getUTCMidnight } from './utilities.js';
import getStats from './fetch-stats.js';
import Result from '../models/result.js';

const styleName = 'enhanced-stats-styles';
const btnClass = 'fetch-stats-btn';
const dotQuery = 'div:nth-child(2)';
const isMobile = () => window.innerWidth < 904;
const rowQuery = () => (isMobile() ? 'div:has(> a + a) > a' : 'table tbody tr');
const detailsQuery = () => (isMobile() ? '.ab.q' : 'td:nth-child(2) > a > div > div > p > div');
const viewQuery = () => (isMobile() ? 'a > div:last-child > div:nth-child(1)' : 'td:nth-child(3)');
const readQuery = () => (isMobile() ? 'a > div:last-child > div:nth-child(2)' : 'td:nth-child(4)');
const earningQuery = () => (isMobile() ? 'a > div:last-child > div:nth-child(3)' : 'td:nth-child(5)');

const refreshSvg = `<svg viewBox="0 0 489.698 489.698" height="16px" width="16px" fill="#6b6b6b">
            <g>
                <g>
                    <path d="M468.999,227.774c-11.4,0-20.8,8.3-20.8,19.8c-1,74.9-44.2,142.6-110.3,178.9c-99.6,54.7-216,5.6-260.6-61l62.9,13.1    c10.4,2.1,21.8-4.2,23.9-15.6c2.1-10.4-4.2-21.8-15.6-23.9l-123.7-26c-7.2-1.7-26.1,3.5-23.9,22.9l15.6,124.8    c1,10.4,9.4,17.7,19.8,17.7c15.5,0,21.8-11.4,20.8-22.9l-7.3-60.9c101.1,121.3,229.4,104.4,306.8,69.3    c80.1-42.7,131.1-124.8,132.1-215.4C488.799,237.174,480.399,227.774,468.999,227.774z"/>
                    <path d="M20.599,261.874c11.4,0,20.8-8.3,20.8-19.8c1-74.9,44.2-142.6,110.3-178.9c99.6-54.7,216-5.6,260.6,61l-62.9-13.1    c-10.4-2.1-21.8,4.2-23.9,15.6c-2.1,10.4,4.2,21.8,15.6,23.9l123.8,26c7.2,1.7,26.1-3.5,23.9-22.9l-15.6-124.8    c-1-10.4-9.4-17.7-19.8-17.7c-15.5,0-21.8,11.4-20.8,22.9l7.2,60.9c-101.1-121.2-229.4-104.4-306.8-69.2    c-80.1,42.6-131.1,124.8-132.2,215.3C0.799,252.574,9.199,261.874,20.599,261.874z"/>
                </g>
            </g>
        </svg>`;
const styles = `
.fetch-stats-btn {
    border: none;
    border-radius: 4px;
    padding: 3px;
    font-size: 10px;
    margin-bottom: -3px;
}

    .fetch-stats-btn:hover {
        background-color: #eee;
        cursor: pointer;
    }

    .fetch-stats-btn.active svg {
        animation: spin 0.5s linear infinite;
        transform-origin: center center;
    }

td p, a span {
    white-space: nowrap;
}

@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}`;

export default function extend() {
    const rows = document.querySelectorAll(rowQuery());

    rows.forEach(row => {
        const hasButton = !!row.querySelector('.' + btnClass);
        const id = getId(row);

        if (hasButton || !id) return;

        const viewsCell = row.querySelector(viewQuery());
        const readsCell = row.querySelector(readQuery());
        const earningCell = row.querySelector(earningQuery());
        const detailsDiv = row.querySelector(detailsQuery());
        const dot = detailsDiv?.querySelector(dotQuery).cloneNode(true);

        const views = viewsCell.querySelectorAll('p, span');
        const reads = readsCell.querySelectorAll('p, span');

        const viewsCount = Number(views[0]?.innerText || 0);
        const readsCount = Number(reads[0]?.innerText);
        const percent = Math.round((readsCount / viewsCount) * 100);
        const percentText = isNaN(percent) ? '-' : `${percent}%`;

        const button = createButton(row, id);

        const viewCell = createCell(earningCell, 'Views');
        const readCell = createCell(earningCell, 'Reads');
        const earnCell = createCell(earningCell, 'Last Day');

        earningCell.parentNode.insertBefore(viewCell, earningCell);
        earningCell.parentNode.insertBefore(readCell, earningCell);
        earningCell.parentNode.insertBefore(earnCell, earningCell);

        views[0].innerHTML = createCellInfo(percentText, `${readsCount}/${viewsCount}`);
        views[1].innerText = 'Reads / Views';
        readsCell.remove();

        detailsDiv.appendChild(dot);
        detailsDiv.appendChild(button);
        button.click();
    });
}

async function getData(row, id, isPremium) {
    const yesterday = getUTCMidnight() - 86400000;

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
        const lastCell = row.querySelector('.last-day');
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
    const isPremium = !!row.querySelector('[aria-label="Member-only story"]');
    const button = document.createElement('button');
    button.innerHTML = refreshSvg;
    button.className = btnClass;

    button.onclick = async event => {
        event.stopPropagation();
        event.preventDefault();
        button.classList.add('active');
        await getData(row, postId, isPremium);
        button.classList.remove('active');
    };

    return button;
}

injectStyles(styleName, styles);
