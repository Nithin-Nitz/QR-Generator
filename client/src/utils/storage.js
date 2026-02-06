const KEY = "qr-data-v1";

export const saveQRs = (data) => {
    localStorage.setItem(KEY, JSON.stringify({
        updatedAt: Date.now(),
        items: data,
    }));
};

export const getQRs = () => {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    try {
        return JSON.parse(raw).items || [];
    } catch {
        return [];
    }
};
