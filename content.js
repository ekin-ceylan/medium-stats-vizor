function addButtons() {
    console.clear();
    const desktopQuery = 'table tbody tr';
    const mobileQuery = 'div:has(> a + a) > a';
    const dotQuery = 'div:nth-child(2)';
    let detailsQuery = 'td:nth-child(2) > a > div > div > p > div';
    let viewQuery = 'td:nth-child(3)';
    let readQuery = 'td:nth-child(4)';
    let earningQuery = 'td:nth-child(5)';
    const styles = `
.fetch-stats-btn {
    border: none;
    border-radius: 4px;
    padding: 4px;
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

    injectStyles('fetch-stats-btn-styles', styles);
    let rows = document.querySelectorAll(desktopQuery);

    if (rows.length === 0) {
        rows = document.querySelectorAll(mobileQuery);
        viewQuery = 'a > div:last-child > div:nth-child(1)';
        readQuery = 'a > div:last-child > div:nth-child(2)';
        earningQuery = 'a > div:last-child > div:nth-child(3)';
        detailsQuery = '.ab.q';
    }

    console.log(`Found ${rows.length} rows`);

    rows.forEach(row => {
        if (row.querySelector('.fetch-stats-btn')) return; // Already added

        const viewsCell = row.querySelector(viewQuery);
        const views = viewsCell.querySelectorAll('p,span');
        const readsCell = row.querySelector(readQuery);
        const reads = readsCell.querySelectorAll('p,span');
        const earning = row.querySelector(earningQuery);
        const details = row.querySelector(detailsQuery);

        const viewsCount = Number(views[0].innerText);
        const readsCount = Number(reads[0].innerText);
        const percent = Math.round((readsCount / viewsCount) * 100);
        const percentText = isNaN(percent) ? '-' : `${percent}%`;

        const dot = details.querySelector(dotQuery).cloneNode(true);
        const button = createButton(row);

        const viewCell = createCell(earning, 'Views');
        const readCell = createCell(earning, 'Reads');
        const earnCell = createCell(earning, 'Last Day');

        earning.parentNode.insertBefore(viewCell, earning);
        earning.parentNode.insertBefore(readCell, earning);
        earning.parentNode.insertBefore(earnCell, earning);

        views[0].innerHTML = getInfoCell(percentText, `${readsCount}/${viewsCount}`);
        views[1].innerText = 'Reads / Views';
        readsCell.remove();

        details.appendChild(dot);
        details.appendChild(button);
        button.click();
    });
}

function createButton(row) {
    const id = getId(row);
    const button = document.createElement('button');
    button.innerHTML = `<svg viewBox="0 0 489.698 489.698" height="16px" width="16px" fill="#6b6b6b">
            <g>
                <g>
                    <path d="M468.999,227.774c-11.4,0-20.8,8.3-20.8,19.8c-1,74.9-44.2,142.6-110.3,178.9c-99.6,54.7-216,5.6-260.6-61l62.9,13.1    c10.4,2.1,21.8-4.2,23.9-15.6c2.1-10.4-4.2-21.8-15.6-23.9l-123.7-26c-7.2-1.7-26.1,3.5-23.9,22.9l15.6,124.8    c1,10.4,9.4,17.7,19.8,17.7c15.5,0,21.8-11.4,20.8-22.9l-7.3-60.9c101.1,121.3,229.4,104.4,306.8,69.3    c80.1-42.7,131.1-124.8,132.1-215.4C488.799,237.174,480.399,227.774,468.999,227.774z"/>
                    <path d="M20.599,261.874c11.4,0,20.8-8.3,20.8-19.8c1-74.9,44.2-142.6,110.3-178.9c99.6-54.7,216-5.6,260.6,61l-62.9-13.1    c-10.4-2.1-21.8,4.2-23.9,15.6c-2.1,10.4,4.2,21.8,15.6,23.9l123.8,26c7.2,1.7,26.1-3.5,23.9-22.9l-15.6-124.8    c-1-10.4-9.4-17.7-19.8-17.7c-15.5,0-21.8,11.4-20.8,22.9l7.2,60.9c-101.1-121.2-229.4-104.4-306.8-69.2    c-80.1,42.6-131.1,124.8-132.2,215.3C0.799,252.574,9.199,261.874,20.599,261.874z"/>
                </g>
            </g>
        </svg>`;
    button.className = 'fetch-stats-btn';

    button.onclick = async event => {
        event.stopPropagation();
        event.preventDefault();
        button.classList.add('active');
        await getData(row, id);
        button.classList.remove('active');
    };

    return button;
}

function createCell(template, text) {
    const td = template.cloneNode(true);
    const className = text.replace('/', ' ').toLowerCase().split(' ').join('-');
    const contents = td.querySelectorAll('p,span');
    contents[0].classList.add(className);
    contents[0].innerText = '-';
    contents[1].innerText = text;

    return td;
}

async function getData(row, id) {
    const title = row.querySelector('h2')?.innerText || 'Unknown';
    const body = getBody(id);
    console.log(`📊 Fetching data: ${title}, ${id}`);

    try {
        const response = await fetch('https://medium.com/_/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();
        const buckets = data?.[0]?.data?.postStatsDailyBundle?.buckets;
        const results = new Results();

        if (buckets) {
            buckets.forEach(bucket => {
                if (bucket.membershipType === 'MEMBER') {
                    results.memberViews = bucket.readersThatViewedCount || 0;
                    results.memberReads = bucket.readersThatReadCount || 0;
                } else if (bucket.membershipType === 'NONMEMBER') {
                    results.nonMemberViews = bucket.readersThatViewedCount || 0;
                    results.nonMemberReads = bucket.readersThatReadCount || 0;
                }
            });

            if (results.allViews()) updateResults(row, results);
        } else {
            console.log('❗ Data not found');
        }
    } catch (e) {
        console.error('❗ Fetch error:', e);
    }
}

function getBody(postId) {
    const startAt = getNow();

    return [
        {
            operationName: 'useStatsPostNewChartDataQuery',
            query: `query useStatsPostNewChartDataQuery($postId: ID!, $postStatsDailyBundleInput: PostStatsDailyBundleInput!) {
                post(id: $postId) {
                    id
                    __typename
                }
                postStatsDailyBundle(postStatsDailyBundleInput: $postStatsDailyBundleInput) {
                    buckets {
                    dayStartsAt
                    membershipType
                    readersThatReadCount
                    readersThatViewedCount
                    __typename
                    }
                    __typename
                }
            }`,
            variables: {
                postId: postId,
                postStatsDailyBundleInput: {
                    postId: postId,
                    fromDayStartsAt: startAt,
                    toDayStartsAt: startAt,
                },
            },
        },
    ];
}

// prettier-ignore
function getNow() {
    const nowUtc = new Date(Date.now() + (new Date().getTimezoneOffset() * 60000));
    const pseudoMidnight = new Date(Date.UTC(nowUtc.getUTCFullYear(), nowUtc.getUTCMonth(), nowUtc.getUTCDate(), 7, 0, 0, 0));

    return pseudoMidnight.getTime();
}

function getId(row) {
    const link = row.querySelector('a[href*="/me/stats/post/"]');
    const href = link?.getAttribute('href') || row.getAttribute('href');
    const postIdMatch = href.match(/\/post\/([^/?]+)/);

    return postIdMatch[1];
}

function updateResults(row, results) {
    const viewsCell = row.querySelector('.views');
    const readsCell = row.querySelector('.reads');

    const views = getInfoCell(results.allViews(), results.memberViews);
    const reads = getInfoCell(results.allReads(), results.memberReads);

    viewsCell.innerHTML = views;
    readsCell.innerHTML = reads;
}

function getInfoCell(all, member) {
    return `<span>${all}</span> <small>(<span>${member}</span>)</small>`;
}

function Results() {
    this.memberViews = 0;
    this.memberReads = 0;
    this.nonMemberViews = 0;
    this.nonMemberReads = 0;
    this.allViews = () => this.memberViews + this.nonMemberViews;
    this.allReads = () => this.memberReads + this.nonMemberReads;
}

function injectStyles(styleId, styleText) {
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

function observePageChanges() {
    const observer = new MutationObserver((mutationsList, observer) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                addButtons(); // Add buttons when DOM changes
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true, // Watch changes in all child nodes
    });
}

window.addEventListener('load', () => {
    setTimeout(addButtons, 500); // Run for the first time
    observePageChanges(); // Watch for changes in the DOM
});
