import { SignIn } from "@clerk/clerk-react";
import { useSearchParams } from "react-router-dom";

const SignInPage = () => {
  const [searchParams] = useSearchParams();

  const redirectTo =
    searchParams.get("redirect") || "/";

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 pt-24 pb-10">
      <SignIn
        routing="path"
        path="/sign-in"
        forceRedirectUrl={redirectTo}
        fallbackRedirectUrl="/"
      />
    </div>
  );
};

export default SignInPage;