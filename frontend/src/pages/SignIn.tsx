import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import civicIssueLogo from "../assets/civic-issue.png";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useAuth } from "../contexts/AuthContext";
import { AnimatePresence, motion } from "framer-motion";
import { useLoader } from "../contexts/LoaderContext";
import { useTranslation } from "react-i18next";

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [citizenForm, setCitizenForm] = useState({ email: "", password: "" });
  const [adminForm, setAdminForm] = useState({
    email: "",
    password: "",
    adminAccessCode: "",
  });
  const [activeTab, setActiveTab] = useState<"citizen" | "admin">("citizen");

  const navigate = useNavigate();
  const { login } = useAuth();
  const { showLoader, hideLoader } = useLoader();
  const { t } = useTranslation();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    showLoader();

    const minLoaderDuration = new Promise((resolve) =>
      setTimeout(resolve, 2000)
    );

    try {
      let result: boolean;
      if (activeTab === "citizen") {
        result = await Promise.all([
          login(citizenForm.email, citizenForm.password, "citizen"),
          minLoaderDuration,
        ]).then(([res]) => res);
      } else {
        result = await Promise.all([
          login(
            adminForm.email,
            adminForm.password,
            "admin",
            adminForm.adminAccessCode
          ),
          minLoaderDuration,
        ]).then(([res]) => res);
      }

      if (result === true) {
        toast.success(t("auth.signInSuccess"), {
          description:
            activeTab === "citizen"
              ? t("auth.welcomeBack")
              : t("auth.welcomeBackAdmin"),
        });
        navigate(activeTab === "citizen" ? "/citizen" : "/admin", {
          replace: true,
        });
      } else {
        toast.error(t("auth.signInFailed"), {
          description: t("auth.invalidCredentials"),
        });
        hideLoader();
      }
    } catch (error) {
      console.error(error);
      toast.error(t("auth.signInFailed"), {
        description: t("auth.somethingWentWrong"),
      });
      hideLoader();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[#f0f7f5]" />

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-4">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white shadow">
              <img
                src={civicIssueLogo}
                alt="civicIssueLogo"
                className="w-15 h-15 object-contain"
              />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold bg-gradient-to-r from-[#016dd0] to-[#159e52] bg-clip-text text-transparent">
                CivicReport
              </h1>
              <p className="text-sm text-muted-foreground">
                Building Better Communities
              </p>
            </div>
          </Link>
        </div>

        <Card className="rounded-2xl shadow-2xl bg-white border-0">
          <CardHeader>
            <CardTitle>
              <center>{t("auth.signIn")}</center>
            </CardTitle>
            <CardDescription>{t("auth.signInDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              value={activeTab}
              onValueChange={(val) => setActiveTab(val as any)}
            >
              <TabsList className="grid w-full grid-cols-2 rounded-full bg-gray-100 p-1">
                <TabsTrigger
                  value="citizen"
                  className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#016dd0] data-[state=active]:to-[#159e52] data-[state=active]:text-white"
                >
                  {t("auth.citizen")}
                </TabsTrigger>
                <TabsTrigger
                  value="admin"
                  className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#016dd0] data-[state=active]:to-[#159e52] data-[state=active]:text-white"
                >
                  {t("auth.administrator")}
                </TabsTrigger>
              </TabsList>

              <AnimatePresence mode="wait">
                {activeTab === "citizen" && (
                  <TabsContent value="citizen" forceMount>
                    <motion.div
                      key="citizen"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="mt-6"
                    >
                      <form onSubmit={handleSignIn} className="space-y-4">
                        <div>
                          <Label htmlFor="citizen-email">{t("form.email")}</Label>
                          <Input
                            id="citizen-email"
                            type="email"
                            value={citizenForm.email}
                            onChange={(e) =>
                              setCitizenForm({
                                ...citizenForm,
                                email: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="citizen-password">{t("form.password")}</Label>
                          <div className="relative">
                            <Input
                              id="citizen-password"
                              type={showPassword ? "text" : "password"}
                              value={citizenForm.password}
                              onChange={(e) =>
                                setCitizenForm({
                                  ...citizenForm,
                                  password: e.target.value,
                                })
                              }
                              required
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                          <Button
                          type="submit"
                          className="w-full bg-gradient-to-r from-[#016dd0] to-[#159e52] text-white hover:opacity-70"
                        >
                          {t("auth.signInCitizen")}
                        </Button>
                      </form>
                    </motion.div>
                  </TabsContent>
                )}

                {activeTab === "admin" && (
                  <TabsContent value="admin" forceMount>
                    <motion.div
                      key="admin"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="mt-6"
                    >
                      <form onSubmit={handleSignIn} className="space-y-4">
                        <div>
                          <Label htmlFor="admin-email">{t("form.email")}</Label>
                          <Input
                            id="admin-email"
                            type="email"
                            value={adminForm.email}
                            onChange={(e) =>
                              setAdminForm({
                                ...adminForm,
                                email: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="admin-password">{t("form.password")}</Label>
                          <div className="relative">
                            <Input
                              id="admin-password"
                              type={showPassword ? "text" : "password"}
                              value={adminForm.password}
                              onChange={(e) =>
                                setAdminForm({
                                  ...adminForm,
                                  password: e.target.value,
                                })
                              }
                              required
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="admin-code">{t("auth.adminCode")}</Label>
                          <Input
                            id="admin-code"
                            value={adminForm.adminAccessCode}
                            onChange={(e) =>
                              setAdminForm({
                                ...adminForm,
                                adminAccessCode: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <Button
                          type="submit"
                          className="w-full bg-gradient-to-r from-[#016dd0] to-[#159e52] text-white hover:opacity-70"
                        >
                          {t("auth.signInAdmin")}
                        </Button>
                      </form>
                    </motion.div>
                  </TabsContent>
                )}
              </AnimatePresence>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  {t("auth.noAccount")}{" "}
                  <Link to="/signup" className="text-primary hover:underline">
                    {t("auth.signUpHere")}
                  </Link>
                </p>
                <Link to="/" className="text-sm text-muted-foreground hover:text-primary">← {t("nav.features")}</Link>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignIn;
