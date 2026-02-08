import React from "react";
import { Button } from "./ui/button.tsx";
import { useTranslation } from "react-i18next";

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const toggle = () => {
    const next = i18n.language && i18n.language.startsWith("fr") ? "en" : "fr";
    i18n.changeLanguage(next);
  };

  const lang = i18n.language?.startsWith("fr") ? "fr" : "en";

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={toggle}
      className="ml-2"
      aria-label="Toggle language"
    >
      {lang === "en" ? "EN" : "FR"}
    </Button>
  );
};

export default LanguageSwitcher;
