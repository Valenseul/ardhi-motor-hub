import { createFileRoute } from "@tanstack/react-router";
import { CarForm } from "@/components/admin/CarForm";

export const Route = createFileRoute("/_admin/admin/mobil/$carId")({
  component: EditCar,
});

function EditCar() {
  const { carId } = Route.useParams();
  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold md:text-3xl">Edit Mobil</h1>
      <CarForm carId={carId} />
    </div>
  );
}
