import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";

type AuthView = "main" | "forgot-password";

const Auth = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [view, setView] = useState<AuthView>("main");
  
  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  
  // Signup state
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");
  const [signupName, setSignupName] = useState("");

  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginEmail || !loginPassword) {
      toast({ title: "Error", description: "Please fill in all fields", variant: "destructive" });
      return;
    }
    
    if (!validateEmail(loginEmail)) {
      toast({ title: "Error", description: "Please enter a valid email", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    
    // Simulate login - replace with actual auth later
    setTimeout(() => {
      setIsLoading(false);
      toast({ title: "Login successful", description: "Welcome back!" });
      navigate("/");
    }, 1000);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!signupEmail || !signupPassword || !signupConfirmPassword || !signupName) {
      toast({ title: "Error", description: "Please fill in all fields", variant: "destructive" });
      return;
    }
    
    if (!validateEmail(signupEmail)) {
      toast({ title: "Error", description: "Please enter a valid email", variant: "destructive" });
      return;
    }
    
    if (signupPassword.length < 6) {
      toast({ title: "Error", description: "Password must be at least 6 characters", variant: "destructive" });
      return;
    }
    
    if (signupPassword !== signupConfirmPassword) {
      toast({ title: "Error", description: "Passwords do not match", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    
    // Simulate signup - replace with actual auth later
    setTimeout(() => {
      setIsLoading(false);
      toast({ title: "Account created", description: "You can now log in" });
    }, 1000);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!forgotEmail) {
      toast({ title: "Error", description: "Please enter your email", variant: "destructive" });
      return;
    }
    
    if (!validateEmail(forgotEmail)) {
      toast({ title: "Error", description: "Please enter a valid email", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    
    // Simulate sending reset email - replace with actual auth later
    setTimeout(() => {
      setIsLoading(false);
      setResetSent(true);
      toast({ title: "Email sent", description: "Check your inbox for reset instructions" });
    }, 1000);
  };

  const handleBackToLogin = () => {
    setView("main");
    setResetSent(false);
    setForgotEmail("");
  };

  if (view === "forgot-password") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="text-center px-4 sm:px-6">
            <div className="flex justify-center mb-3 sm:mb-4">
              <div className="p-2.5 sm:p-3 rounded-full bg-primary/10">
                <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-xl sm:text-2xl">Reset Password</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              {resetSent 
                ? "We've sent you an email with reset instructions" 
                : "Enter your email to receive reset instructions"}
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            {resetSent ? (
              <div className="space-y-4">
                <div className="p-3 sm:p-4 rounded-lg bg-primary/10 border border-primary/20 text-center">
                  <p className="text-xs sm:text-sm text-foreground">
                    A password reset link has been sent to <strong className="break-all">{forgotEmail}</strong>
                  </p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground mt-2">
                    Didn't receive the email? Check your spam folder or try again.
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full h-10 sm:h-11" 
                  onClick={handleBackToLogin}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Login
                </Button>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="forgot-email" className="text-sm">Email</Label>
                  <Input
                    id="forgot-email"
                    type="email"
                    placeholder="operator@fleetguard.com"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    disabled={isLoading}
                    className="h-10 sm:h-11"
                  />
                </div>
                <Button type="submit" className="w-full h-10 sm:h-11" disabled={isLoading}>
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </Button>
                <Button 
                  type="button" 
                  variant="ghost" 
                  className="w-full h-10 sm:h-11" 
                  onClick={handleBackToLogin}
                  disabled={isLoading}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Login
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center px-4 sm:px-6">
          <div className="flex justify-center mb-3 sm:mb-4">
            <div className="p-2.5 sm:p-3 rounded-full bg-primary/10">
              <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-xl sm:text-2xl">FleetGuard Portal</CardTitle>
          <CardDescription className="text-xs sm:text-sm">Sign in to access the command center</CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4 sm:mb-6">
              <TabsTrigger value="login" className="text-xs sm:text-sm">Login</TabsTrigger>
              <TabsTrigger value="signup" className="text-xs sm:text-sm">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="text-sm">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="operator@fleetguard.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    disabled={isLoading}
                    className="h-10 sm:h-11"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="login-password" className="text-sm">Password</Label>
                    <Button
                      type="button"
                      variant="link"
                      className="px-0 h-auto text-[10px] sm:text-xs text-muted-foreground hover:text-primary"
                      onClick={() => setView("forgot-password")}
                    >
                      Forgot password?
                    </Button>
                  </div>
                  <div className="relative">
                    <Input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      disabled={isLoading}
                      className="h-10 sm:h-11"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <Button type="submit" className="w-full h-10 sm:h-11" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name" className="text-sm">Full Name</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="John Doe"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    disabled={isLoading}
                    className="h-10 sm:h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-sm">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="operator@fleetguard.com"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    disabled={isLoading}
                    className="h-10 sm:h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-sm">Password</Label>
                  <div className="relative">
                    <Input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      disabled={isLoading}
                      className="h-10 sm:h-11"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-confirm" className="text-sm">Confirm Password</Label>
                  <Input
                    id="signup-confirm"
                    type="password"
                    placeholder="••••••••"
                    value={signupConfirmPassword}
                    onChange={(e) => setSignupConfirmPassword(e.target.value)}
                    disabled={isLoading}
                    className="h-10 sm:h-11"
                  />
                </div>
                <Button type="submit" className="w-full h-10 sm:h-11" disabled={isLoading}>
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
