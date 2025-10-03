export const CACHE_TTL = 24*60*60*1000; // 24 horas

// fetch con cache en localStorage

export async function cachedFetch(url, ttl = CACHE_TTL) {
    const key = `cache:${url}`;
    const now = Date.now();

    try {
        const raw = localStorage.getItem(key);
        if (raw) {
            const { time, data } = JSON.parse(raw);
            if (now - time < ttl) return data; // cache hit
        }
    } catch { }

    const res = await fetch(url);
    if (!res.ok) throw new Error(`Fetch error: ${res.status}`);
    const data = await res.json();

    try {
        localStorage.setItem(key, JSON.stringify({ time: now, data }));
    } catch { }

    return data;
}

export function clearApiCache(prefix = "cache:") {
    Object.keys(localStorage).forEach(k => k.startsWith(prefix) && localStorage.removeItem(k));
}