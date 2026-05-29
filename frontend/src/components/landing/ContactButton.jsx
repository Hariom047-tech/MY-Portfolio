import React from "react";

export const ContactButton = ({ label = "Contact Me", onClick, dataTestId = "contact-me-btn" }) => {
    return (
        <button
            data-testid={dataTestId}
            onClick={onClick}
            className="rounded-full font-medium uppercase tracking-widest text-white px-8 py-3 sm:px-10 sm:py-3.5 md:px-12 md:py-4 text-xs sm:text-sm md:text-base transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98]"
            style={{
                background:
                    "linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)",
                boxShadow:
                    "0px 4px 4px rgba(181, 1, 167, 0.25), 4px 4px 12px #7721B1 inset",
                outline: "2px solid #ffffff",
                outlineOffset: "-3px",
                fontFamily: "'Kanit', sans-serif",
            }}
        >
            {label}
        </button>
    );
};

export default ContactButton;
