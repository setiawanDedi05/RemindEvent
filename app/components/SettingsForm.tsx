"use client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "./SubmitButton";
import { useFormState } from "react-dom";
import { SettingsAction } from "../action";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { settingsSchema } from "../lib/zodSchemas";
import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UploadDropzone } from "../lib/uploadthing";
import { toast } from "sonner";

interface iAppProps {
  fullname: string;
  email: string;
  profileImage: string;
}

export function SettingsForm({ email, fullname, profileImage }: iAppProps) {
  const [lastResult, action] = useFormState(SettingsAction, undefined);
  const [currentProfileImage, setCurrentProfileImage] = useState(profileImage);

  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: settingsSchema,
      });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  const handleDelete = () => {
    setCurrentProfileImage("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Settings</CardTitle>
        <CardDescription>Manage your account settings!</CardDescription>
      </CardHeader>
      <form action={action} id={form.id} onSubmit={form.onSubmit} noValidate>
        <CardContent className="flex flex-col gap-y-4">
          <div className="flex flex-col gap-y-2">
            <Label>Fullname</Label>
            <Input
              defaultValue={fullname}
              name={fields.fullname.name}
              key={fields.fullname.key}
              placeholder="John Thor"
            />
            <p className="text-red-500 text-sm">{fields.fullname.errors}</p>
          </div>
          <div className="flex flex-col gap-y-4">
            <Label>Email</Label>
            <Input
              defaultValue={email}
              disabled
              placeholder="john.thor@example.com"
            />
          </div>
          <div className="grid gap-y-5">
            <Label>Profile Image</Label>
            <input
              type="hidden"
              name={fields.profileImage.name}
              key={fields.profileImage.key}
              value={currentProfileImage}
            />
            {currentProfileImage ? (
              <div className="relative size-16">
                <img
                  src={currentProfileImage}
                  alt="Profile"
                  className="size-16 rounded-lg"
                />
                <Button
                  className="absolute -top-3 -right-3"
                  variant="destructive"
                  size="icon"
                  onClick={handleDelete}
                  type="button"
                >
                  <X className="size-4" />
                </Button>
              </div>
            ) : (
              <UploadDropzone
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                  setCurrentProfileImage(res[0].url);
                  toast.success("Profile image has been uploaded");
                }}
                onUploadError={(error) => {
                  console.log("some thing when wrong", error);
                  toast.error(error.message);
                }}
              />
            )}
            <p className="text-red-500 text-sm">{fields.profileImage.errors}</p>
          </div>
        </CardContent>
        <CardFooter>
          <SubmitButton text="Save Changes" />
        </CardFooter>
      </form>
    </Card>
  );
}
