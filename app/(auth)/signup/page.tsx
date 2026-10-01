import { Suspense } from "react";
import { redirect } from "next/navigation";
import AuthForm from "@/components/auth/AuthForm";
import { getUser } from "@/lib/auth";

export const metadata = { title: "Sign up · Wishly" };

export default async function SignupPage() {
  if (await getUser()) redirect("/dashboard");
  return (
    <Suspense>
      <AuthForm mode="signup" />
    </Suspense>
  );
}
