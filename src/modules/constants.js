export const MEDIUM_GRAPHQL_URL = 'https://medium.com/_/graphql';
export const MS_PER_DAY = 86400000;
export const DESKTOP_BREAKPOINT = 904;

export const STYLE_NAME = 'enhanced-stats-styles';
export const ENHANCED_PAGE_STYLES = `
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

export const REFRESH_SVG = `<svg viewBox="0 0 489.698 489.698" height="16px" width="16px" fill="#6b6b6b">
    <g>
        <g>
            <path d="M468.999,227.774c-11.4,0-20.8,8.3-20.8,19.8c-1,74.9-44.2,142.6-110.3,178.9c-99.6,54.7-216,5.6-260.6-61l62.9,13.1    c10.4,2.1,21.8-4.2,23.9-15.6c2.1-10.4-4.2-21.8-15.6-23.9l-123.7-26c-7.2-1.7-26.1,3.5-23.9,22.9l15.6,124.8    c1,10.4,9.4,17.7,19.8,17.7c15.5,0,21.8-11.4,20.8-22.9l-7.3-60.9c101.1,121.3,229.4,104.4,306.8,69.3    c80.1-42.7,131.1-124.8,132.1-215.4C488.799,237.174,480.399,227.774,468.999,227.774z"/>
            <path d="M20.599,261.874c11.4,0,20.8-8.3,20.8-19.8c1-74.9,44.2-142.6,110.3-178.9c99.6-54.7,216-5.6,260.6,61l-62.9-13.1    c-10.4-2.1-21.8,4.2-23.9,15.6c-2.1,10.4,4.2,21.8,15.6,23.9l123.8,26c7.2,1.7,26.1-3.5,23.9-22.9l-15.6-124.8    c-1-10.4-9.4-17.7-19.8-17.7c-15.5,0-21.8,11.4-20.8,22.9l7.2,60.9c-101.1-121.2-229.4-104.4-306.8-69.2    c-80.1,42.6-131.1,124.8-132.2,215.3C0.799,252.574,9.199,261.874,20.599,261.874z"/>
        </g>
    </g>
</svg>`;

export const ACTIVE_CLASS_NAME = 'active';
export const BUTTON_CLASS_NAME = 'fetch-stats-btn';
export const BUTTON_SELECTOR = `.${BUTTON_CLASS_NAME}`;
export const ASTERISK_SELECTOR = '[aria-label="Member-only story"]';
export const INFO_SELECTOR = 'p, span';
export const DOT_SELECTOR = 'div:nth-child(2)';

export const ROW_DESKTOP_SELECTOR = 'table tbody tr';
export const ROW_MOBILE_SELECTOR = 'div.m:has( > a + div.ac > div:nth-child(4))';

export const DETAILS_DESKTOP_SELECTOR = 'td:nth-child(1) > a > div > div > div > div';
export const DETAILS_MOBILE_SELECTOR = 'a > div > div > div > .ac.r';

export const HEAD_VIEW_QUERY = 'th:nth-child(3)';
export const HEAD_EARNING_QUERY = 'th:nth-child(5)';

export const VIEW_DESKTOP_SELECTOR = 'td:nth-child(3)';
export const VIEW_MOBILE_SELECTOR = 'a + div.ac > div:nth-child(2)';

export const READ_DESKTOP_SELECTOR = 'td:nth-child(4)';
export const READ_MOBILE_SELECTOR = 'a + div.ac > div:nth-child(3)';

export const EARNING_DESKTOP_SELECTOR = 'td:nth-child(5)';
export const EARNING_MOBILE_SELECTOR = 'a + div.ac > div:nth-child(4)';

export const LAST_EARN_LABEL = 'Last Earns';
export const LAST_EARN_SELECTOR = '.' + LAST_EARN_LABEL.toLowerCase().replaceAll(/\s+/g, '-');
