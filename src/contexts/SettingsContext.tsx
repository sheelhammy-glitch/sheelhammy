"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type PublicSettings = {
  platformName: string;
  platformDescription: string;
  currency: string;
  workingHoursStart: string;
  workingHoursEnd: string;
  siteTitle: string | null;
  siteDescription: string | null;
  siteKeywords: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  defaultFreeRevisions: number;
  cancellationPolicy: string | null;
};

type SettingsContextType = {
  settings: PublicSettings | null;
  isLoading: boolean;
  refreshSettings: () => Promise<void>;
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<PublicSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/settings");
      if (!response.ok) {
        throw new Error("Failed to fetch settings");
      }
      const data = await response.json();
      setSettings(data);
    } catch (error) {
      console.error("Error fetching settings:", error);
      // Use default settings on error
      setSettings({
        platformName: "شيل همي",
        platformDescription: "",
        currency: "JOD",
        workingHoursStart: "09:00",
        workingHoursEnd: "17:00",
        siteTitle: null,
        siteDescription: null,
        siteKeywords: null,
        contactEmail: null,
        contactPhone: null,
        defaultFreeRevisions: 2,
        cancellationPolicy: null,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();

    // Listen for settings updates
    const handleSettingsUpdate = () => {
      fetchSettings();
    };

    window.addEventListener("settingsUpdated", handleSettingsUpdate);
    return () => {
      window.removeEventListener("settingsUpdated", handleSettingsUpdate);
    };
  }, []);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        isLoading,
        refreshSettings: fetchSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
