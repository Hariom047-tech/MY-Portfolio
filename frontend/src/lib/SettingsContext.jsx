import React, { createContext, useContext, useEffect, useState } from "react";
import { SITE, buildWhatsappLink } from "@/lib/config";
import { getSettings } from "@/lib/api";

const SettingsContext = createContext({ settings: SITE });

export const SettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState(SITE);

    useEffect(() => {
        let cancelled = false;
        getSettings()
            .then((data) => {
                if (cancelled || !data) return;
                // Merge so any missing key falls back to defaults.
                const merged = { ...SITE };
                Object.entries(data).forEach(([k, v]) => {
                    if (v !== null && v !== undefined && v !== "") merged[k] = v;
                });
                setSettings(merged);
            })
            .catch(() => {});
        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <SettingsContext.Provider value={{ settings }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    const ctx = useContext(SettingsContext);
    const settings = ctx?.settings || SITE;
    const wa = (message) =>
        buildWhatsappLink(settings.whatsappNumber, message || settings.whatsappMessage);
    return { settings, wa };
};

export default SettingsContext;
