
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { BackButton } from "@/components/auth/BackButton";
import { Social } from "@/components/auth/Social";
import { Header } from "@/components/auth/Header";

interface CardWrapperProps {
  children: React.ReactNode;
  headerLabel?: string;
  BackButtonLabel?: string;
  BackButtonHref: string;
  showSocial?: boolean;
}
export const CardWrapper = ({
  children,
  headerLabel,
  BackButtonLabel,
  BackButtonHref,
  showSocial,
}: CardWrapperProps) => {
  return (
    <Card className="w-[400px] text-white rounded-lg border  shadow-lg border-slate-800 bg-slate-950 ">
      <CardHeader>
        <Header label={headerLabel} />
      </CardHeader>
      <CardContent>{children}</CardContent>
      {showSocial && (
        <CardFooter>
          <Social />
        </CardFooter>
      )}
      <CardFooter>
        <BackButton href={BackButtonHref} label={BackButtonLabel} />
      </CardFooter>
    </Card>
  );
};