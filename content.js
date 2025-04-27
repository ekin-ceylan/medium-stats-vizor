function addButtons() {
    const rows = document.querySelectorAll(
        'table.kp.bh.kq.kr.ks.kt.ku.kv.kw.kx.ky.kz.la.lb.lc tbody tr'
    ); // Medium stats table satırları
    console.clear();
    rows.forEach(row => {
        if (row.querySelector('.fetch-stats-btn')) return; // Zaten ekli ise tekrar ekleme

        const fifthCell = row.querySelector('td:nth-child(5)');
        const details = row.querySelector('p.bf.b.cp.z.co .ab.q');
        const button = createButton(row);
        const viewCell = createCell(fifthCell, 'Views');
        const readCell = createCell(fifthCell, 'Reads');

        row.insertBefore(viewCell, fifthCell);
        row.insertBefore(readCell, fifthCell);
        details.appendChild(button);
    });
}

function createButton(row) {
    const id = getId(row);
    const button = document.createElement('button');
    button.innerText = 'Get Today';
    button.className = 'fetch-stats-btn';
    button.style.marginLeft = 'auto';
    button.style.padding = '2px 5px';
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
    const contents = td.querySelectorAll('p');
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
    const href = link.getAttribute('href');
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
        <span style="font-size:14px;font-weight:300">(<span style="color:#ff9a00;font-weight:500">${member}</span>)</span>`;
}

function Results() {
    this.memberViews = 0;
    this.memberReads = 0;
    this.nonMemberViews = 0;
    this.nonMemberReads = 0;
    this.allViews = () => this.memberViews + this.nonMemberViews;
    this.allReads = () => this.memberReads + this.nonMemberReads;
}

// Sayfa tamamen yüklenince butonları ekle
window.addEventListener('load', () => {
    setTimeout(addButtons, 1000); // Medium geç yükleniyor, biraz bekliyoruz
});
