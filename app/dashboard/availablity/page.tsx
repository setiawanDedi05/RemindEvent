import { updateAvailabilityAction } from "@/app/action";
import { SubmitButton } from "@/app/components/SubmitButton";
import prisma from "@/app/lib/db";
import { requireUser } from "@/app/lib/hooks";
import { times } from "@/app/lib/times";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { notFound } from "next/navigation";

async function getData(userId: string) {
  const data = await prisma.availability.findMany({
    where: {
      userId,
    },
  });

  if (!data) {
    return notFound();
  }

  return data;
}

export default async function AvailablityRoute() {
  const session = await requireUser();
  const data = await getData(session.user?.id as string);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Availablity</CardTitle>
        <CardDescription>
          in this section you can manage your availablity!
        </CardDescription>
        <form action={updateAvailabilityAction}>
          <CardContent className="flex flex-col gap-y-4">
            {data.map((item) => (
              <div
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 items-center gap-4"
                key={item.id}
              >
                <input type="hidden" name={`id-${item.id}`} />
                <div className="flex items-center gap-x-3">
                  <Switch
                    name={`isActive-${item.id}`}
                    defaultChecked={item.isActive}
                  />
                  <p>{item.day}</p>
                </div>

                <Select
                  name={`fromTime-${item.id}`}
                  defaultValue={item.fromTime}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="From Time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {times.map((time) => (
                        <SelectItem key={time.id} value={time.time}>
                          {time.time}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <Select
                  name={`tillTime-${item.id}`}
                  defaultValue={item.tillTime}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Till Time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {times.map((time) => (
                        <SelectItem key={time.id} value={time.time}>
                          {time.time}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <SubmitButton text="Save Changes" />
          </CardFooter>
        </form>
      </CardHeader>
    </Card>
  );
}