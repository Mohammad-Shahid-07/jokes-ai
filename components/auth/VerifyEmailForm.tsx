"use client";
import { useSearchParams } from "next/navigation";
import Loader from "@/components/auth/Loader";
import { CardWrapper } from "@/components/auth/CardWrapper";
import { useCallback, useEffect, useState } from "react";
import { verifyToken } from "@/actions/auth.actions";
import { FormSuccess } from "@/components/auth/FormSuccess";
import { FormError } from "@/components/auth/FormError";

const VerifyEmailForm = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const onSubmit = useCallback(() => {
    if (success || error) return;
    if (!token) {
      setError("No token provided");
      return;
    }
    verifyToken(token)
      .then((res) => {
        if (res?.error) {
          setError(res?.error);
        } else {
          setSuccess(res?.success!);
        }
      })
      .catch((err) => {
        setError("Something went wrong");
      });
  }, [token, success, error]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);
  return (
    <CardWrapper
      headerLabel="Verify your email address"
      BackButtonLabel="Back to login"
      BackButtonHref="/login"
    >
      <div className="flex items-center w-full justify-center">
        {!success && !error && <Loader color="white" />}
        <FormSuccess message={success} />
        {!success && <FormError message={error} />}
      </div>
    </CardWrapper>
  );
};

export default VerifyEmailForm;