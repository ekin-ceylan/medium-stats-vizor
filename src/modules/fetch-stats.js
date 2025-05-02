import { getUTCMidnight } from './utilities.js';
import { MEDIUM_GRAPHQL_URL, MS_PER_DAY } from './constants.js';

async function getStats(id, isPremium = false) {
    const body = [
        {
            operationName: 'useStatsPostNewChartDataQuery',
            query: createQuery(isPremium),
            variables: createVariables(id, isPremium),
        },
    ];

    const response = await fetch(MEDIUM_GRAPHQL_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });

    const data = await response.json();

    return data?.[0]?.data;
}

function createQuery(isPremium) {
    const hasPremiumParams = isPremium ? '$postId: ID!, $startAt: Long!, $endAt: Long!, ' : '';
    const premiumBody = isPremium
        ? `post(id: $postId) {
                earnings {
                    dailyEarnings(startAt: $startAt, endAt: $endAt) {
                        periodStartedAt
                        amount
                    }
                }
            }
            `
        : '';

    return `query useStatsPostNewChartDataQuery(${hasPremiumParams}$postStatsDailyBundleInput: PostStatsDailyBundleInput!) {
                ${premiumBody}postStatsDailyBundle(postStatsDailyBundleInput: $postStatsDailyBundleInput) {
                    buckets {
                        dayStartsAt
                        membershipType
                        readersThatReadCount
                        readersThatViewedCount
                    }
                }
            }`;
}

function createVariables(postId, isPremium) {
    const endAt = getUTCMidnight();

    const variables = {
        postId,
        postStatsDailyBundleInput: {
            fromDayStartsAt: endAt,
            postId,
            toDayStartsAt: endAt,
        },
    };

    if (isPremium) {
        const startAt = endAt - MS_PER_DAY;
        variables.postStatsDailyBundleInput.fromDayStartsAt = startAt;
        variables['endAt'] = endAt;
        variables['startAt'] = startAt;
    }

    return variables;
}

export default getStats;
