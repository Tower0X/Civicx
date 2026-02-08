import { useCallback, useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { ArrowLeft, MapPin, Upload, Send } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import MapComponent, { CAMEROON_CITIES } from "../components/MapBox";
import { toast } from "sonner";
import { VITE_BACKEND_URL } from "../config/config";

const ReportIssue = () => {
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState<"yaounde" | "douala">(
    "yaounde"
  );
  const [formData, setFormData] = useState({
    title: "",
    issueDescription: "",
    issueLocation: "",
    issueType: "Road Infrastructure",
    location: {
      address: "",
      latitude: CAMEROON_CITIES.yaounde.lat as number | null,
      longitude: CAMEROON_CITIES.yaounde.lng as number | null,
    },
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLocationSelect = useCallback(
    (lat: number, lng: number, address: string) => {
      setFormData((prev) => ({
        ...prev,
        location: {
          address,
          latitude: lat,
          longitude: lng,
        },
        issueLocation: address, // also update address string if you use it
      }));
    },
    []
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.issueDescription ||
      !formData.issueLocation
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        toast.error("You must be logged in");
        return;
      }

      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.issueDescription);
      data.append("issueType", formData.issueType);
      
      // Use location name as primary, with coordinates if available
      const locationData = {
        address: formData.issueLocation, // Primary: user-entered location name
        latitude: formData.location.latitude || 3.8667, // Default to Yaoundé if not set
        longitude: formData.location.longitude || 11.5167,
      };
      data.append("location", JSON.stringify(locationData));

      if (selectedFile) {
        data.append("files", selectedFile);
      }

      const response = await fetch(
        `${VITE_BACKEND_URL}/api/v1/citizen/create-issue`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: data,
        }
      );

      const result = await response.json();
      if (response.ok) {
        toast.success("Issue reported successfully!");
        navigate("/citizen");
      } else {
        toast.error(result.message || "Failed to report issue");
      }
    } catch (error) {
      console.error("Error reporting issue:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const issueTypes = [
    { value: "Road Infrastructure", label: "Road Infrastructure" },
    { value: "Waste Management", label: "Waste Management" },
    { value: "Environmental Issues", label: "Environmental Issues" },
    {
      value: "Utilities & Infrastructure",
      label: "Utilities & Infrastructure",
    },
    { value: "Public Safety", label: "Public Safety" },
    { value: "Other", label: "Other" },
  ];

  return (
    <div className="min-h-screen bg-[#f3f6f8]">
      {/* Header */}
      <header className="w-full border-b bg-white/10 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/citizen">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-2 text-slate-500"
                >
                  <ArrowLeft className="h-4 w-4 text-blue-600" />
                  <span>Back to Dashboard</span>
                </Button>
              </Link>
            </div>
            <div>
              <h1 className="text-xl font-bold text-cyan-600">
                Report New Issue
              </h1>
            </div>
            <div className="w-24"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section - Primary */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg bg-white/80  text-slate-600">
              <CardHeader>
                <CardTitle>Report New Issue</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Issue Title */}
                  <div className="space-y-2">
                    <Label htmlFor="title">Issue Title *</Label>
                    <Input
                      id="title"
                      type="text"
                      value={formData.title}
                      onChange={(e) =>
                        handleInputChange("title", e.target.value)
                      }
                      placeholder="Enter your issue title"
                      required
                      className="shadow-sm"
                    />
                  </div>

                  {/* Location Name - PRIMARY FIELD */}
                  <div className="space-y-2 p-4 border-2 border-green-200 bg-green-50 rounded-lg">
                    <Label htmlFor="issueLocation" className="font-bold text-green-700">
                      📍 Location Name *
                    </Label>
                    <Input
                      id="issueLocation"
                      type="text"
                      value={formData.issueLocation}
                      onChange={(e) =>
                        handleInputChange("issueLocation", e.target.value)
                      }
                      placeholder="e.g., Downtown Yaoundé, Rue Foch, Douala"
                      className="shadow-sm bg-white"
                      required
                    />
                    <p className="text-xs text-green-600">
                      ✓ This name will be displayed in issue reports
                    </p>
                  </div>

                  {/* Issue Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Issue Information</h3>

                    <div className="space-y-2">
                      <Label>Issue Type *</Label>
                      <RadioGroup
                        value={formData.issueType}
                        onValueChange={(value) =>
                          handleInputChange("issueType", value)
                        }
                        className="grid grid-cols-2 gap-4"
                      >
                        {issueTypes.map((type) => (
                          <div
                            key={type.value}
                            className="flex items-center space-x-2"
                          >
                            <RadioGroupItem value={type.value} id={type.value} />
                            <Label htmlFor={type.value} className="text-sm">
                              {type.label}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="issueDescription">
                        Issue Description *
                      </Label>
                      <Textarea
                        id="issueDescription"
                        value={formData.issueDescription}
                        onChange={(e) =>
                          handleInputChange("issueDescription", e.target.value)
                        }
                        placeholder="Describe the issue in detail..."
                        className="min-h-24 shadow-sm"
                        required
                      />
                    </div>
                  </div>

                  {/* File Upload */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Upload Media</h3>

                    <div className="space-y-2">
                      <Label htmlFor="file">Upload Image/Video</Label>
                      <div className="flex items-center space-x-4">
                        <Input
                          id="file"
                          type="file"
                          accept="image/*,video/*"
                          onChange={handleFileChange}
                          className="flex-1"
                        />
                        <Upload className="h-5 w-5 text-blue-600" />
                      </div>
                      {selectedFile && (
                        <p className="text-sm text-muted-foreground">
                          Selected: {selectedFile.name} (
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full civic-gradient border-0 text-white hover:opacity-70"
                    disabled={loading}
                    size="lg"
                  >
                    {loading ? (
                      "Submitting..."
                    ) : (
                      <>
                        <Send className="h-5 w-5 mr-2" /> Submit Issue
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Map Section - Secondary */}
          <Card className="shadow-lg bg-white/80 h-fit">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-slate-600">
                <MapPin className="h-5 w-5 text-blue-600" />
                <span>Map Reference</span>
              </CardTitle>
              {/* City Selector */}
              <div className="mt-4 space-y-2">
                <Label className="text-sm font-medium">City</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={selectedCity === "yaounde" ? "default" : "outline"}
                    onClick={() => setSelectedCity("yaounde")}
                    className="flex-1 text-xs"
                  >
                    Yaoundé
                  </Button>
                  <Button
                    type="button"
                    variant={selectedCity === "douala" ? "default" : "outline"}
                    onClick={() => setSelectedCity("douala")}
                    className="flex-1 text-xs"
                  >
                    Douala
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-64 rounded-lg overflow-hidden border">
                <MapComponent
                  onLocationSelect={handleLocationSelect}
                  defaultLocation={
                    selectedCity === "yaounde"
                      ? { ...CAMEROON_CITIES.yaounde, name: "Yaoundé" }
                      : { ...CAMEROON_CITIES.douala, name: "Douala" }
                  }
                />
              </div>
              {formData.location.latitude && formData.location.longitude && (
                <div className="mt-3 p-2 bg-blue-50 rounded text-xs">
                  <p className="text-blue-600 font-semibold">
                    Coordinates captured
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ReportIssue;
