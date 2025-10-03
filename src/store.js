const STORAGE_KEY = "APP_STORE";

export function initialStore() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) return JSON.parse(raw);
    } catch { }
    return { favorites: [] }; 
}

function persist(next) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { }
}

export default function storeReducer(state, action) {
    switch (action.type) {
        case "FAV_TOGGLE": {
            const { id, type, name } = action.payload;
            const exists = state.favorites.some(f => f.id === id && f.type === type);
            const favorites = exists
                ? state.favorites.filter(f => !(f.id === id && f.type === type))
                : [...state.favorites, { id, type, name }];
            const next = { ...state, favorites };
            persist(next);
            return next;
        }
        case "FAV_REMOVE": {
            const { id, type } = action.payload;
            const favorites = state.favorites.filter(f => !(f.id === id && f.type === type));
            const next = { ...state, favorites };
            persist(next);
            return next;
        }
        case "FAV_CLEAR": {
            const next = { ...state, favorites: [] };
            persist(next);
            return next;
        }
        default:
            return state;
    }
}
