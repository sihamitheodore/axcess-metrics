import TourPlanEditor from "@/components/TourPlanEditor";

export default async function TourPlanEditPage({ params }) {
  const { id } = await params;
  return <TourPlanEditor planId={id} />;
}
