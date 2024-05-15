import Link from "next/link";
import { Button } from "@/components/ui/button";

interface BackButtonProps {
  href: string;
  label?: string;
}

export const BackButton = ({ href, label }: BackButtonProps) => {
  return (
    <Button className="font-normal w-full text-white" asChild size="sm" variant="link">
      <Link href={href}>{label}</Link>
    </Button>
  );
};