import { EditEventForm } from "@/app/components/EditEventForm";
import prisma from "@/app/lib/db";
import { notFound } from "next/navigation";

async function getData(eventTypeId: string) {
  const data = await prisma.eventType.findUnique({
    where: {
      id: eventTypeId,
    },
    select: {
      title: true,
      description: true,
      duration: true,
      url: true,
      id: true,
      videoCallSoftware: true,
    },
  });

  if (!data) {
    return notFound();
  }

  return data;
}
export default async function EditRoute({
  params,
}: {
  params: { eventId: string };
}) {
  const data = await getData(params.eventId);
  return (
    <EditEventForm
      callProvider={data.videoCallSoftware}
      description={data.description}
      duration={data.duration}
      title={data.title}
      url={data.url}
      id={data.id}
    />
  );
}
