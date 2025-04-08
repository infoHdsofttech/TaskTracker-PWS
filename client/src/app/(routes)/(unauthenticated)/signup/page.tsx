"use client";
import "../../../globals.css";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Container, Paper, Tabs, Tab, Button } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { useForm, SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { loginAction, signupAction } from "@/actions/auth";

interface FormData {
  email: string;
  password: string;
  confirmPassword?: string;
}

const AuthPage = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const router = useRouter();
  const theme = useTheme();

  // Initialize react-hook-form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    // For signup, validate that passwords match
    if (tabIndex === 1 && data.password !== data.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    try {
      if (tabIndex === 0) {
        // Call login function
        const response = await loginAction({
          email: data.email,
          password: data.password,
        });
        if (response.status !== 200) {
          // toast.error(response.message);
          return;
        }
        console.log("Login successful", response);
        router.push("/home");
      } else {
        // Call signup function
        const response = await signupAction({
          email: data.email,
          password: data.password,
        });
        console.log("Signup successful", response);
        router.push("/");
      }
      reset();
    } catch (error) {
      console.error(tabIndex === 0 ? "Login error" : "Signup error", error);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
    reset();
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3, backgroundColor: theme.colors.background }}>
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          variant="fullWidth"
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab label="Sign In" />
          <Tab label="Sign Up" />
        </Tabs>
        <form onSubmit={handleSubmit(onSubmit)} style={{ marginTop: "1rem", backgroundColor: theme.colors.background }}>
          <Typography
            align="center"
            gutterBottom
            sx={{ color: theme.colors.mainText }}
          >
            {tabIndex === 0 ? "Sign In" : "Sign Up"}
          </Typography>

          {/* Email Field */}
          <div style={{ marginBottom: "1rem" }}>
            <label
              htmlFor="email"
              style={{
                display: "block",
                marginBottom: "0.5rem",
                color: theme.colors.mainText,
              }}
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              {...register("email", { required: "Email is required" })}
              style={{
                width: "100%",
                padding: "0.5rem",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
            {errors.email && (
              <p style={{ color: "red" }}>{errors.email.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div style={{ marginBottom: "1rem" }}>
            <label
              htmlFor="password"
              style={{
                display: "block",
                marginBottom: "0.5rem",
                color: theme.colors.mainText,
              }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              {...register("password", { required: "Password is required" })}
              style={{
                width: "100%",
                padding: "0.5rem",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
            {errors.password && (
              <p style={{ color: "red" }}>{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password Field for Signup */}
          {tabIndex === 1 && (
            <div style={{ marginBottom: "1rem" }}>
              <label
                htmlFor="confirmPassword"
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  color: theme.colors.mainText,
                }}
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                })}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              />
              {errors.confirmPassword && (
                <p style={{ color: "red" }}>
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          )}

          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            {tabIndex === 0 ? "Sign In" : "Sign Up"}
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default AuthPage;
