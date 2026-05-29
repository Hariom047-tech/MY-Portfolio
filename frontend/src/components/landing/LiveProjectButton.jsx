import React from "react";

export const LiveProjectButton = ({ label = "Live Project", onClick, dataTestId = "live-project-btn" }) => {
    return (
        <button
            data-testid={dataTestId}
            onClick={onClick}
            className="rounded-full border-2 border-[#D7E2EA] text-[#D7E2EA] font-medium uppercase tracking-widest px-8 py-3 sm:px-10 sm:py-3.5 text-sm sm:text-base hover:bg-[#D7E2EA]/10 transition-colors duration-200"
            style={{ fontFamily: "'Kanit', sans-serif" }}
        >
            {label}
        </button>
    );
};

export default LiveProjectButton;
