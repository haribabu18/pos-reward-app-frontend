"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Link, useNavigate } from "react-router-dom";
import {
  IconBuildingStore,
  IconUser,
  IconExternalLink,
  IconCheck,
} from "@tabler/icons-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { sendSignupOTP, verifySignupOTP } from "@/app/services/AuthAPI";
import { set } from "zod";
import axios from "axios";
import { Credential, useAuth } from "../context/AuthContext";

// Define the steps of the signup process
type SignupStep =
  | "userType"
  | "accountDetails"
  | "verifyOTP"
  | "shopAddress"
  | "termsAndConditions";

// Define the user type options
type UserType = "Shopkeeper" | "Customer" | null;

export default function SignupPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const router = useRouter();

  // State for managing the multi-step form
  const [currentStep, setCurrentStep] = useState<SignupStep>("userType");
  const [userType, setUserType] = useState<UserType>(null);

  const [lastStep, setLastStep] = useState({
    termsAccepted: false,
    privacyAccepted: false,
  });

  const [credentials, setCredentials] = useState<Credential>({
    username: "",
    password: "",
  });

  // Form data state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
    storeName: "",
    doorNo: "",
    street: "",
    pincode: "",
    mandal: "",
    district: "",
    state: "",
  });

  // OTP verification state
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpError, setOtpError] = useState("");

  // Progress indicators - simplified and more reliable approach
  const getSteps = () => {
    const baseSteps = [
      { name: "userType", label: "User Type" },
      { name: "accountDetails", label: "Account Details" },
      { name: "verifyOTP", label: "Verification" },
    ];
    
    // Add conditional steps based on user type
    if (userType === "Shopkeeper") {
      baseSteps.push(
        { name: "shopAddress", label: "Shop Address" },
        { name: "termsAndConditions", label: "Terms" }
      );
    } else {
      baseSteps.push({ name: "termsAndConditions", label: "Terms" });
    }
    
    return baseSteps;
  };

  // Get current step index
  const currentStepIndex = getSteps().findIndex(step => step.name === currentStep);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle checkbox changes
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setLastStep((prev) => ({...prev, [name]: checked }));
  };

  // Handle OTP input changes
  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      
      // Auto-focus next input
      if (value !== "" && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  // Handle OTP input keydown for backspace navigation
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // If backspace is pressed and the current field is empty, focus the previous field
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  // Handle sending OTP
  const handleSendOTP = async () => {
    try {
      const response = await sendSignupOTP(formData.phoneNumber);
      setCredentials({ ...credentials, username: formData.phoneNumber, password: formData.password });
      console.log(response);
      if (response.success) {
        setIsOtpSent(true);
        setOtpError("");
      } else {
        setOtpError(response.message || "Failed to send OTP");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      setOtpError("An error occurred while sending OTP");
    }
  };

  // Handle OTP verification
  const handleVerifyOTP = async () => {
    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      setOtpError("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      const response = await verifySignupOTP(formData.phoneNumber, otpValue);

      console.log("OTP verification response:", response.message);

      if (response.verified) {
        setOtpError("");
        console.log("OTP verified successfully");
        if (userType === "Shopkeeper") {
          setCurrentStep("shopAddress");
        } else {
          setCurrentStep("termsAndConditions");
        }
      } else {
        setOtpError("Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setOtpError("An error occurred during verification");
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Here you would integrate with your registration API
    console.log("Form submitted:", { userType, ...formData });
    try {
      console.log(credentials);
      // This would be replaced with your actual API endpoint
      const response = await axios.post(
        "http://localhost:8081/api/auth/register",
        {userType, ...formData}
      );
      console.log(response.data.Success);
      if (response.data.Success) {
        // Auto login after successful registration
        console.log(credentials);
        const success = await login(credentials);

        if (success) {
          navigate("/dashboard");
        } else {
          console.error("error login. Please try again.");
          navigate("/login");
        }
      }
    } catch (error) {
      console.error("Error during registration:", error);
      console.error("Registration failed. Please try again.");
    }
  };

  // Navigation between steps
  const goToNextStep = () => {
    switch (currentStep) {
      case "userType":
        setCurrentStep("accountDetails");
        break;
      case "accountDetails":
        setCurrentStep("verifyOTP");
        handleSendOTP();
        break;
      case "verifyOTP":
        handleVerifyOTP();
        break;
      case "shopAddress":
        setCurrentStep("termsAndConditions");
        break;
      case "termsAndConditions":
        handleSubmit();
        break;
    }
  };

  const goToPreviousStep = () => {
    switch (currentStep) {
      case "accountDetails":
        setCurrentStep("userType");
        break;
      case "verifyOTP":
        setCurrentStep("accountDetails");
        break;
      case "shopAddress":
        setCurrentStep("verifyOTP");
        break;
      case "termsAndConditions":
        if (userType === "Shopkeeper") {
          setCurrentStep("shopAddress");
        } else {
          setCurrentStep("verifyOTP");
        }
        break;
    }
  };

  // Validate current step before proceeding
  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case "userType":
        return userType !== null;
      case "accountDetails":
        return (
          formData.firstName.trim() !== "" &&
          formData.lastName.trim() !== "" &&
          formData.phoneNumber.trim() !== "" &&
          formData.password.trim() !== "" &&
          formData.confirmPassword.trim() !== "" &&
          formData.password === formData.confirmPassword
        );
      case "verifyOTP":
        return otp.join("").length === 6;
      case "shopAddress":
        return (
          formData.storeName.trim() !== "" &&
          formData.pincode.trim() !== "" &&
          formData.state.trim() !== ""
        );
      case "termsAndConditions":
        return lastStep.termsAccepted && lastStep.privacyAccepted;
      default:
        return false;
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      {/* App header with name only */}
      <div className="w-full max-w-md flex items-center justify-center mb-6">
        <div className="flex items-center">
        <img src="/logo.svg" alt="App Logo" className="h-8 w-8" />
          <span className="ml-2 font-bold">App Name</span>
        </div>
      </div>

      <Card className="mx-auto max-w-md w-full">
        <CardHeader className="space-y-1">
          {/* Progress indicator */}
          <div className="flex justify-center space-x-1">
            {getSteps().map((step, index) => (
              <div key={index} className="flex-1 flex items-center">
                <div
                  className={`h-1 flex-1 ${
                    index <= currentStepIndex ? "bg-primary" : "bg-muted"
                  }`}
                ></div>
              </div>
            ))}
          </div>
        </CardHeader>

        <CardContent>
          {/* Content remains the same */}
          {/* Step 1: User Type Selection */}
          {currentStep === "userType" && (
            <div className="space-y-4">
              <CardTitle className="text-2xl text-center">
                Create an Account
              </CardTitle>
              <CardDescription className="text-center">
                Anyone can earn their dollar online, start with what you know
              </CardDescription>

              <RadioGroup
                value={userType || ""}
                onValueChange={(value: string) =>
                  setUserType(value as UserType)
                }
              >
                <div
                  className={`flex items-center space-x-3 rounded-lg border p-4 ${
                    userType === "Shopkeeper" ? "border-primary" : ""
                  }`}
                >
                  <RadioGroupItem
                    value="Shopkeeper"
                    id="Shopkeeper"
                    className="sr-only"
                  />
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                    <IconBuildingStore className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <Label
                      htmlFor="Shopkeeper"
                      className="text-base font-medium"
                    >
                      Shop Keeper
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      I want to create a storefront for my business
                    </p>
                  </div>
                  {userType === "Shopkeeper" && (
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                      <IconCheck className="h-3 w-3 text-primary-foreground" />
                    </div>
                  )}
                </div>

                <div
                  className={`flex items-center space-x-3 rounded-lg border p-4 ${
                    userType === "Customer" ? "border-primary" : ""
                  }`}
                >
                  <RadioGroupItem
                    value="Customer"
                    id="Customer"
                    className="sr-only"
                  />
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                    <IconUser className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="Customer" className="text-base font-medium">
                      Customer
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      I want to shop and earn rewards
                    </p>
                  </div>
                  {userType === "Customer" && (
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                      <IconCheck className="h-3 w-3 text-primary-foreground" />
                    </div>
                  )}
                </div>
              </RadioGroup>
            </div>
          )}

          {/* Step 2: Account Details */}
          {currentStep === "accountDetails" && (
            <div className="space-y-4">
              <CardTitle className="text-2xl text-center">
                Account Details
              </CardTitle>
              <CardDescription className="text-center">
                Please fill your details
              </CardDescription>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    placeholder="Enter First Name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    placeholder="Enter Last Name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone number</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  placeholder="Enter Phone number"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email (optional)</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter Email address"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter Password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                />
                {formData.password !== formData.confirmPassword &&
                  formData.confirmPassword !== "" && (
                    <p className="text-sm text-destructive">
                      Passwords do not match
                    </p>
                  )}
              </div>
            </div>
          )}

          {/* Step 3: OTP Verification */}
          {currentStep === "verifyOTP" && (
            <div className="space-y-4">
              <CardTitle className="text-2xl text-center">Verify OTP</CardTitle>
              <CardDescription className="text-center">
                OTP Sent to *****{formData.phoneNumber.substring(5)}
              </CardDescription>

              <div className="flex justify-center gap-2">
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    id={`otp-${index}`}
                    className="w-12 h-12 text-center text-lg"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    maxLength={1}
                    inputMode="numeric"
                  />
                ))}
              </div>

              {otpError && (
                <p className="text-sm text-destructive text-center">
                  {otpError}
                </p>
              )}

              <p className="text-sm text-center">
                Didn't receive the code?{" "}
                <Button
                  variant="link"
                  className="p-0 h-auto"
                  onClick={handleSendOTP}
                >
                  Resend
                </Button>
              </p>
            </div>
          )}

          {/* Step 4: Shop Address (for Shopkeepers only) */}
          {currentStep === "shopAddress" && (
            <div className="space-y-4">
              <CardTitle className="text-2xl text-center">
                Shop Address
              </CardTitle>
              <CardDescription className="text-center">
                Enter the shop Address to continue
              </CardDescription>

              <div className="space-y-2">
                <Label htmlFor="storeName">Store Name</Label>
                <Input
                  id="storeName"
                  name="storeName"
                  placeholder="Enter Store Name"
                  value={formData.storeName}
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="doorNo">Door no</Label>
                  <Input
                    id="doorNo"
                    name="doorNo"
                    placeholder="Enter Door no"
                    value={formData.doorNo}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="street">Street</Label>
                  <Input
                    id="street"
                    name="street"
                    placeholder="Enter Street Name"
                    value={formData.street}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pincode">Pincode</Label>
                  <Input
                    id="pincode"
                    name="pincode"
                    placeholder="Enter Pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mandal">Village / Mandal / City</Label>
                  <Input
                    id="mandal"
                    name="mandal"
                    placeholder="Enter Mandal"
                    value={formData.mandal}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="district">District</Label>
                  <Input
                    id="district"
                    name="district"
                    placeholder="Enter District"
                    value={formData.district}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    name="state"
                    placeholder="Enter State"
                    value={formData.state}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Terms and Conditions */}
          {currentStep === "termsAndConditions" && (
            <div className="space-y-4">
              <CardTitle className="text-2xl text-center">Last Step</CardTitle>
              <CardDescription className="text-center">
                Please read the following carefully
                <br />
                and Accept to continue
              </CardDescription>

              <div className="space-y-4">
                <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="terms"
                      checked={lastStep.termsAccepted}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange(
                          "termsAccepted",
                          checked as boolean
                        )
                      }
                    />
                    <Label htmlFor="terms" className="text-base">
                      Terms and conditions
                    </Label>
                  </div>
                  <Button variant="outline" size="icon" asChild>
                    <a href="#" target="_blank" rel="noopener noreferrer">
                      <IconExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>

                <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="privacy"
                      checked={lastStep.privacyAccepted}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange(
                          "privacyAccepted",
                          checked as boolean
                        )
                      }
                    />
                    <Label htmlFor="privacy" className="text-base">
                      Privacy Policy
                    </Label>
                  </div>
                  <Button variant="outline" size="icon" asChild>
                    <a href="#" target="_blank" rel="noopener noreferrer">
                      <IconExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between">
          {currentStep !== "userType" && (
            <Button variant="outline" onClick={goToPreviousStep}>
              Back
            </Button>
          )}

          <Button
            className={currentStep === "userType" ? "w-full" : ""}
            onClick={
              currentStep === "verifyOTP" ? handleVerifyOTP : goToNextStep
            }
            disabled={!validateCurrentStep()}
          >
            {currentStep === "termsAndConditions" ? "Complete" : "Continue"}
          </Button>
        </CardFooter>
      </Card>
      
      {/* Login link at the bottom */}
      <div className="mt-6 text-sm text-center">
        Already have an account?{" "}
        <Link to="/login" className="font-medium underline">
          Log in
        </Link>
      </div>
    </div>
  );
}
