import TourPlanReview from "@/components/TourPlanReview";

export default async function TourPlanReviewPage({ params }) {
  const { id } = await params;
  return <TourPlanReview planId={id} />;
}
