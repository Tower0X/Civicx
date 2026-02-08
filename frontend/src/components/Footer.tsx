import { MapPin, Mail, Phone, Github, Linkedin, X } from "lucide-react";
import { Button } from "./ui/button";
import civicIssueLogo from "../assets/civic-issue.png";
import { Link } from "react-router-dom";
import { handleSupportClick } from "./SupportModel";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg">
                {/* <MapPin className="h-5 w-5 text-white" /> */}
                <img src={civicIssueLogo} alt="civicIssueLogo" />
              </div>
              <h3 className="text-lg font-bold text-foreground">{t("footer.company")}</h3>
            </div>
            <p className="text-muted-foreground">{t("footer.description")}</p>
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm" className="p-2">
                <X className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2">
                <Github className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2">
                <Linkedin className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-foreground">{t("footer.quickLinks")}</h4>
            <ul className="space-y-2">
              <Link to="/report-issue">
                <li>
                  <span className="text-muted-foreground hover:text-primary transition-colors">{t("footer.reportIssue")}</span>
                </li>
              </Link>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("footer.viewReports")}
                </a>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("footer.howItWorks")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("footer.communityGuidelines")}
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-foreground">{t("footer.support")}</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("footer.helpCenter")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("footer.privacy")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("footer.terms")}
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={handleSupportClick}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t("footer.contactUs")}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-foreground">{t("footer.contact")}</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{t("footer.email")}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{t("footer.phone")}</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                <span className="text-muted-foreground">{t("footer.address")}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t mt-12 pt-8 text-center">
          <p className="text-muted-foreground">{t("footer.copyright")}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
