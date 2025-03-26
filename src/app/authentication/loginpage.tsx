"use client"

import { use, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { IconBrandGoogle } from "@tabler/icons-react"
import { useRouter } from "next/navigation"
import { useAuth, Credential } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"

import api from "../../api";



export default function LoginPage() {
  const [activeTab, setActiveTab] = useState("password")
  const { token, setToken, isLoggedIn, setIsLoggedIn } = useAuth();
  const [phoneOrEmail, setPhoneOrEmail] = useState("")
  const [password, setPassword] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [otp, setOtp] = useState("")
  const [isOtpSent, setIsOtpSent] = useState(false)
  const [error, setError] = useState("")
  const { login, loginWithOTP } = useAuth();
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState<Credential>({
    username: "",
    password: "",
  });
  
  const router = useRouter()

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    console.log(credentials);
    const status = await login(credentials);
    if (status) {
      navigate("/dashboard"); 
    }
    else {
      setError("Invalid credentials"); 
    }
  };

  const sendOTP = async () => {
    if (!phoneNumber) {
      setError("Please enter your phone number");
      return;
    }

    if (!/^\d{10}$/.test(phoneNumber)) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }
    setError("");
    
    try {
      // Import the AuthAPI service
      const { sendLoginOTP } = await import('../services/AuthAPI');
      
      // Call the service function
      const response = await sendLoginOTP(phoneNumber);
      
      if (response.success) {
        setIsOtpSent(true);
      } else {
        setError('Failed to send OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      setError('Failed to send OTP. Please try again.');
    } finally {
    }
  };

  const handleOTPLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) {
      setError("Please enter the OTP");
      return;
    }
    setError("");

    try {
      const success = await loginWithOTP(phoneNumber, otp);
      if (success) {
        navigate('/dashboard');
      } else {
        setError("Invalid OTP. Please try again.");
      }
    } catch (err) {
      setError("Failed to connect to server");
    } finally {
    }
  };

  const handleGoogleLogin = () => {
    // Implement Google login
    console.log("Google login clicked")
  }

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
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>
            Choose your preferred login method
          </CardDescription>
        </CardHeader>
        
        {/* Rest of the card content remains the same */}
        <CardContent>
          {error && (
            <div className="mb-4 p-3 text-sm bg-destructive/10 text-destructive rounded-md">
              {error}
            </div>
          )}
          
          <Tabs defaultValue="password" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="password">Password</TabsTrigger>
              <TabsTrigger value="otp">OTP</TabsTrigger>
            </TabsList>
            
            <TabsContent value="password">
              <form onSubmit={handlePasswordLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone-email">Phone / Email</Label>
                  <Input 
                    id="phone-email" 
                    placeholder="Enter your phone or email" 
                    value={credentials.username}
                    onChange={(e) => setCredentials({ ...credentials, username: e.target.value})}
                    maxLength={10}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Button variant="link" className="px-0 text-sm font-medium h-auto">
                      Forgot password?
                    </Button>
                  </div>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="Enter your password"
                    value={credentials.password}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value})}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">Login</Button>
              </form>
            </TabsContent>
            
            <TabsContent value="otp">
              <form onSubmit={isOtpSent ? handleOTPLogin : sendOTP} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone-number">Phone Number</Label>
                  <Input 
                    id="phone-number" 
                    placeholder="Enter your phone number" 
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                    disabled={isOtpSent}
                  />
                </div>
                
                {isOtpSent && (
                  <div className="space-y-2">
                    <Label htmlFor="otp">OTP</Label>
                    <Input 
                      id="otp" 
                      placeholder="Enter OTP" 
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                    />
                  </div>
                )}
                
                <Button type="submit" className="w-full">
                  {isOtpSent ? "Login" : "Send OTP"}
                </Button>
                
                {isOtpSent && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setIsOtpSent(false)}
                  >
                    Change Phone Number
                  </Button>
                )}
              </form>
            </TabsContent>
          </Tabs>
          
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={handleGoogleLogin}
          >
            <IconBrandGoogle className="mr-2 h-4 w-4" />
            Google
          </Button>
        </CardContent>
      </Card>
      
      {/* Signup link moved to bottom of page */}
      <div className="mt-6 text-sm text-center">
        Don't have an account?{" "}
        <Button 
          variant="link" 
          className="p-0 h-auto font-medium underline" 
          onClick={() => navigate("/signup")}
        >
          Sign up
        </Button>
      </div>
    </div>
  )
}