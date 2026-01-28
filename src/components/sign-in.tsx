"use client";
import { signIn } from "next-auth/react"; // Ensure correct import path
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeClosed } from "lucide-react";
import { useRouter } from "next/navigation";

export const SignIn = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the default form submission
    setIsLoading(true);

    // const formData = { email, password };
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setIsLoading(false);
      setError(res.error);
    } else {
      router.push("/dashboard");
    }

    // try {
    //   const res = await fetch("/api/auth/login", {
    //     method: "POST",
    //     body: JSON.stringify({ email, password }),
    //     headers: { "Content-Type": "application/json" },
    //   });

    //   const data = await res.json();
    //   if (!res.ok) {
    //     throw new Error(data.message || "Login failed");
    //   }

    //   localStorage.setItem("token", data.token);
    //   router.push("/dashboard");
    // } catch (err: any) {
    //   setError(err.message);
    // }

    // const res = await signIn("credentials", {
    //   redirect: false, // Prevent redirection automatically after sign in
    //   email: formData.email,
    //   password: formData.password,
    // });

    // if (res?.error) {
    //   setError(res.error); // Show error message if signIn failed
    // } else if (res?.ok) {
    //   // Handle successful login (optional redirection, etc.)
    //   // For example, redirect to the dashboard or home page
    //   window.location.href = "/"; // or use `useRouter` to navigate
    // }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-1">
          <form onSubmit={handleSubmit} className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-balance text-muted-foreground">
                  Login to your Megazen account
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="relative grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <div
                  className="absolute top-9 right-2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <Eye /> : <EyeClosed />}
                </div>
              </div>
              {error && error === "CredentialsSignin" ? (
                <p className="text-red-500 text-sm mt-2 text-center">
                  Invalid Email or Password
                </p>
              ) : (
                <p className="text-red-500 text-sm mt-2">{error}</p>
              )}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Loading..." : "Login"}
              </Button>
              {/* <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <Button variant="outline" className="w-full">
                  <span className="sr-only">Login with Apple</span>
                </Button>
                <Button variant="outline" className="w-full">
                  <span className="sr-only">Login with Google</span>
                </Button>
                <Button variant="outline" className="w-full">
                  <span className="sr-only">Login with Meta</span>
                </Button>
              </div> */}
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <a href="#" className="underline underline-offset-4">
                  Sign up
                </a>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
};
