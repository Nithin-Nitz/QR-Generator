import React from "react";
import QRCard from "./QRCard";

const QRGrid = ({ list, onDelete }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {list.map((qr) => (
                <QRCard key={qr._id || qr.id} data={qr} onDelete={() => onDelete(qr._id || qr.id)} />
            ))}
        </div>
    );
};

export default QRGrid;
