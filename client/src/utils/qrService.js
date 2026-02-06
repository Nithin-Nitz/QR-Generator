const APIPrefix = process.env.REACT_APP_URL
const API_URL = APIPrefix + "/qr";

export const getQRs = async (token) => {
    const response = await fetch(API_URL, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to fetch QRs");
    }

    return data;
};

export const createQR = async (qrData, token) => {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(qrData),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to create QR");
    }

    return data;
};

export const deleteQR = async (id, token) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to delete QR");
    }

    return data;
};
