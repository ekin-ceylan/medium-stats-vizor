function addButtons() {
    const desktopQuery = 'table.kp.bh.kq.kr.ks.kt.ku.kv.kw.kx.ky.kz.la.lb.lc tbody tr';
    const mobileQuery = 'div.ab.cd > div > div > a.ag.ah.ai.aj.ak.al.am.an.ao.ap.aq.ar.as.at.au';
    let earningQuery = 'td:nth-child(5)';
    let detailsQuery = 'p.bf.b.cp.z.co .ab.q';

    let rows = document.querySelectorAll(desktopQuery);

    if (rows.length === 0) {
        rows = document.querySelectorAll(mobileQuery);
        earningQuery = 'div.ab:last-child > div:nth-child(3)';
        detailsQuery = '.ab.q';
    }

    rows.forEach(row => {
        if (row.querySelector('.fetch-stats-btn')) return; // Zaten ekli ise tekrar ekleme

        const earning = row.querySelector(earningQuery);
        const details = row.querySelector(detailsQuery);

        const button = createButton(row);
        const viewCell = createCell(earning, 'Views');
        const readCell = createCell(earning, 'Reads');

        earning.parentNode.insertBefore(viewCell, earning);
        earning.parentNode.insertBefore(readCell, earning);
        details.appendChild(button);
    });
}

function createButton(row) {
    const id = getId(row);
    const button = document.createElement('button');
    button.innerText = 'Get Today';
    button.className =
        'fetch-stats-btn bf b ft fu fv fw fx fy fz ga gb gc gd ge gf gg gh bk gi gj gk gl gm gn go gp gq gr gs gt gu gv ch dg bm gw gx';
    button.style.margin = '0px 10px 0 22px';
    button.style.padding = '0px 8px';
    button.style.fontSize = '12px';

    button.onclick = event => {
        event.stopPropagation();
        event.preventDefault();
        getData(row, id);
    };

    return button;
}

function createCell(template, text) {
    const td = template.cloneNode(true);
    const contents = td.querySelectorAll('p,span');
    contents[0].className += ' today-' + text.toLowerCase();
    contents[0].innerText = '-';
    contents[1].innerText = 'Today ' + text;

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

            updateResults(row, results);
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
    const viewsCell = row.querySelector('.today-views');
    const readsCell = row.querySelector('.today-reads');

    const views = getInfoCell(results.allViews(), results.memberViews);
    const reads = getInfoCell(results.allReads(), results.memberReads);

    viewsCell.innerHTML = views;
    readsCell.innerHTML = reads;
}

function getInfoCell(all, member) {
    return `<span>${all}</span>
        <span style="font-size:14px">(<span>${member}</span>)</span>`;
}

function Results() {
    this.memberViews = 0;
    this.memberReads = 0;
    this.nonMemberViews = 0;
    this.nonMemberReads = 0;
    this.allViews = () => this.memberViews + this.nonMemberViews;
    this.allReads = () => this.memberReads + this.nonMemberReads;
}

function observePageChanges() {
    const observer = new MutationObserver((mutationsList, observer) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                addButtons(); // DOM değiştiyse butonları yeniden ekle
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true, // Alt dallardaki değişimleri de izle
    });
}

window.addEventListener('load', () => {
    setTimeout(addButtons, 500); // İlk yüklemede çalıştır
    observePageChanges(); // Sonrasında DOM'u izle
});
