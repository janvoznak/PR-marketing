import { notFound } from "next/navigation";
import Wizard from "@/components/wizard/Wizard";
import { listings } from "@/lib/data";
import type { Goal } from "@/lib/campaign";

const goals: Goal[] = ["prodej", "zakazky", "znacka", "web"];

export function generateStaticParams() {
  return [
    ...goals.map((g) => ({ slug: [g] })),
    ...listings.map((l) => ({ slug: ["prodej", l.id] })),
  ];
}

export default async function CampaignPage(props: PageProps<"/marketing/kampan/[[...slug]]">) {
  const { slug } = await props.params;
  const [goal, id] = slug ?? [];
  if (!goals.includes(goal as Goal)) notFound();
  if (id && !listings.some((l) => l.id === id)) notFound();
  return <Wizard key={`${goal}-${id ?? ""}`} goal={goal as Goal} listingId={id} />;
}
