import { Suspense } from "react";
import { redirect } from "next/navigation";
import AuthForm from "@/components/auth/AuthForm";
import { getUser } from "@/lib/auth";

export const metadata = { title: "Log in · Wishly" };

export default async function LoginPage() {
  if (await getUser()) redirect("/dashboard");
  return (
    <Suspense>
      <AuthForm mode="login" />
    </Suspense>
  );
}
