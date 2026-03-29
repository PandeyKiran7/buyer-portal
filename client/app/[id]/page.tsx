import { notFound } from "next/navigation";
import { StayPropertyDetail } from "@/components/stay/StayPropertyDetail";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function PropertyDetailPage({ params }: Props) {
  const { id } = await params;
  if (!/^\d+$/.test(id)) {
    notFound();
  }
  const num = Number(id);
  if (!Number.isInteger(num) || num < 1) {
    notFound();
  }
  return <StayPropertyDetail propertyId={num} />;
}
