"use client";

import "../../../globals.css";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Container, Paper, Tabs, Tab, Button } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { loginAction, signupAction } from "@/actions/auth";
import { loginSchema, signupSchema } from "@/lib/zod/auth";
import { z } from "zod";
import InputField from "@/component/UI/InputField/InputField";

type LoginFormData = z.infer<typeof loginSchema>;
type SignupFormData = z.infer<typeof signupSchema>;

const AuthPage = () => {

  
  const router = useRouter();
  const theme = useTheme();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      router.replace("/home");
    }
  }, [router]);
  
  const [tabIndex, setTabIndex] = useState(0);
  const isSignup = tabIndex === 1;
  const schema = isSignup ? signupSchema : loginSchema;


  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SignupFormData | LoginFormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: SignupFormData | LoginFormData) => {
    try {
      if (!isSignup) {
        const response = await loginAction(data as LoginFormData);
        if (response.status !== 200) return;
        router.push("/home");
      } else {
        const response = await signupAction(data as SignupFormData);
        router.push("/");
      }
      reset();
    } catch (error) {
      toast.error("Authentication failed");
      console.error(error);
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
        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{ marginTop: "1rem", backgroundColor: theme.colors.background }}
        >
          <Typography align="center" gutterBottom sx={{ color: theme.colors.mainText }}>
            {tabIndex === 0 ? "Sign In" : "Sign Up"}
          </Typography>

          {isSignup && (
            <InputField
              label="Name"
              {...register("name")}
              errorMessage={(errors as any).name?.message}
            />
          )}

          <InputField
            label="Email"
            type="email"
            {...register("email")}
            errorMessage={(errors as any).email?.message}
          />

          <InputField
            label="Password"
            type="password"
            {...register("password")}
            errorMessage={(errors as any).password?.message}
          />

          {isSignup && (
            <InputField
              label="Confirm Password"
              type="password"
              {...register("confirmPassword")}
              errorMessage={(errors as any).confirmPassword?.message}
            />
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
