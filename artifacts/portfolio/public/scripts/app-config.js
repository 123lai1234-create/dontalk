(() => {
    const existingConfig = window.APP_CONFIG || {};

    const normalizeUrl = (value) => String(value || '').trim().replace(/\/+$/, '');
    const normalizeList = (values) => Array.isArray(values)
        ? values.map(normalizeUrl).filter(Boolean)
        : [];

    const rawInjectedApiBase = '__API_BASE_URL__';
    const injectedApiBase = rawInjectedApiBase === '__API_BASE_URL__'
        ? ''
        : normalizeUrl(rawInjectedApiBase);
    const configuredApiBase = typeof existingConfig.API_BASE_URL === 'string'
        ? normalizeUrl(existingConfig.API_BASE_URL)
        : '';
    const host = window.location.hostname;
    const defaultPortfolioServiceNames = ['donttalk'];
    const defaultApiServiceNames = ['donttalk-api'];
    const defaultApiCandidates = [];
    const resolvedPortfolioServiceNames = normalizeList(existingConfig.PORTFOLIO_SERVICE_NAMES).length
        ? normalizeList(existingConfig.PORTFOLIO_SERVICE_NAMES)
        : defaultPortfolioServiceNames;
    const resolvedApiServiceNames = normalizeList(existingConfig.API_SERVICE_NAMES).length
        ? normalizeList(existingConfig.API_SERVICE_NAMES)
        : defaultApiServiceNames;
    const resolvedApiCandidates = normalizeList(existingConfig.API_CANDIDATES).length
        ? normalizeList(existingConfig.API_CANDIDATES)
        : defaultApiCandidates;
    const fallbackApiBase = ['localhost', '127.0.0.1'].includes(host)
        ? `http://${host}:8000`
        : (resolvedApiCandidates[resolvedApiCandidates.length - 1] || '');
    const resolutionCache = new Map();

    const pushCandidate = (candidates, value) => {
        const normalized = normalizeUrl(value);
        if (normalized && !candidates.includes(normalized)) {
            candidates.push(normalized);
        }
    };

    const deriveApiCandidates = (options = {}) => {
        const candidates = [];
        pushCandidate(candidates, configuredApiBase);
        pushCandidate(candidates, injectedApiBase);
        pushCandidate(candidates, existingConfig.DEFAULT_API_BASE_URL);

        if (options.includeCurrentOrigin !== false) {
            const currentOrigin = normalizeUrl(window.location.origin);
            pushCandidate(candidates, currentOrigin);
            for (const portfolioServiceName of resolvedPortfolioServiceNames) {
                if (!currentOrigin.includes(portfolioServiceName)) {
                    continue;
                }

                for (const apiServiceName of resolvedApiServiceNames) {
                    pushCandidate(candidates, currentOrigin.replace(portfolioServiceName, apiServiceName));
                }
            }
        }

        resolvedApiCandidates.forEach((candidate) => pushCandidate(candidates, candidate));
        return candidates;
    };

    const resolveApiBase = async (options = {}) => {
        const cacheKey = options.cacheKey || 'default';
        if (!options.refresh && resolutionCache.has(cacheKey)) {
            return resolutionCache.get(cacheKey);
        }

        const candidates = deriveApiCandidates(options);
        for (const candidate of candidates) {
            try {
                const response = await fetch(`${candidate}/api/healthz`);
                if (!response.ok) {
                    continue;
                }

                const data = await response.json().catch(() => null);
                if (data?.status === 'ok') {
                    resolutionCache.set(cacheKey, candidate);
                    return candidate;
                }
            } catch (error) {
                continue;
            }
        }

        resolutionCache.set(cacheKey, '');
        return '';
    };

    /**
     * Returns the sync secret for protected /sync endpoints.
     * Only accepts the value injected at build/deploy time via window.APP_CONFIG.SYNC_SECRET.
     * URL parameters and browser storage are not used as sources because they expose
     * secrets to browser history, server logs, and same-origin scripts.
     */
    const getSyncSecret = () => {
        if (existingConfig.SYNC_SECRET) return String(existingConfig.SYNC_SECRET);
        return '';
    };

    window.APP_CONFIG = {
        ...existingConfig,
        API_BASE_URL: configuredApiBase || injectedApiBase || fallbackApiBase,
        DEFAULT_API_BASE_URL: injectedApiBase || fallbackApiBase,
        PORTFOLIO_SERVICE_NAMES: resolvedPortfolioServiceNames,
        API_SERVICE_NAMES: resolvedApiServiceNames,
        API_CANDIDATES: resolvedApiCandidates
    };
    window.APP_CONFIG_UTILS = {
        deriveApiCandidates,
        normalizeUrl,
        resolveApiBase,
        getSyncSecret,
    };
})();
