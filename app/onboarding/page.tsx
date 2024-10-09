"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormState } from "react-dom";
import { OnboardingAction } from "../action";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { onboardingSchema } from "../lib/zodSchemas";
import { SubmitButton } from "../components/SubmitButton";

export default function OnboardingRoute() {
  const [lastResult, action] = useFormState(OnboardingAction, undefined);

  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: onboardingSchema,
      });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <Card>
        <CardHeader>
          <CardTitle>
            Welcome to Remind<span className="text-primary">Event</span>
          </CardTitle>
          <CardDescription>
            We need the following information to set up your profile!
          </CardDescription>
        </CardHeader>
        <form
          className="w-full"
          id={form.id}
          onSubmit={form.onSubmit}
          action={action}
          noValidate
        >
          <CardContent>
            <div className="grid gap-y-2">
              <Label>Full Name</Label>
              <Input
                name={fields.fullName.name}
                defaultValue={fields.fullName.initialValue}
                key={fields.fullName.key}
                placeholder="John thor"
              />
              <p className="text-red-500 text-sm mt-5">
                {fields.fullName.errors}
              </p>
            </div>
            <div className="gap gap-y-2">
              <Label>Username</Label>
              <div className="flex rounded-md">
                <span className="inline-flex items-center px-3 border border-l-md border-r-0 border-muted bg-muted text-sm text-muted-foreground">
                  remindevent.com
                </span>
                <Input
                  name={fields.username.name}
                  key={fields.username.key}
                  defaultValue={fields.username.initialValue}
                  className="rounded-l-none"
                  placeholder="john-thor"
                />
              </div>
              <p className="text-red-500 text-sm mt-5">
                {fields.username.errors}
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <SubmitButton text="Submit" className="w-full" />
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
