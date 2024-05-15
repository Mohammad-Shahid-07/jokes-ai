import { AlertTriangleIcon } from "lucide-react";
import { CardWrapper } from "@/components/auth/CardWrapper";

export const ErrorCard = () => {
  return (
   <CardWrapper
   headerLabel="Oops! Something went wrong"
   BackButtonHref="/login"
   BackButtonLabel="Back to login"
   >
    <div className="w-full flex justify-center items-center">
        <AlertTriangleIcon className="text-red-500" />
    </div>
   </CardWrapper>
  );
};