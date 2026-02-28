import React, { ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
const AuthLayout = async ({ children }: { children: ReactNode }) => {
  const Token = (await cookies()).get("token")?.value;
  if (Token) {
    redirect("/admin");
  }

  return (
    <>
      <div className="min-h-screen">{children}</div>
    </>
  );
};

export default AuthLayout;
