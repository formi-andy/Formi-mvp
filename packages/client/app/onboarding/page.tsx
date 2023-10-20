"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TextInput } from "@mantine/core";

export default function Onboarding() {
  return (
    <div className="self-center w-full grid p-6 justify-center gap-y-4 border rounded-lg max-w-2xl shadow-accent-2">
      <p className="text-lg lg:text-xl font-medium text-center">
        What are you looking for?
      </p>
      <Tabs defaultValue="user" className="flex flex-col w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="user">I&apos;m a User</TabsTrigger>
          <TabsTrigger value="student">I&apos;m a Student</TabsTrigger>
        </TabsList>
        <TabsContent value="user">
          <div className="flex items-center justify-center p-4 rounded-lg border w-full">
            <Button
              variant="outline-action"
              onClick={() => {
                // update user role and metadta
                // redirect to dashboard
              }}
            >
              Continue to Dashboard
            </Button>
          </div>
        </TabsContent>
        <TabsContent value="student">
          <div className="flex flex-col gap-y-4 items-center justify-center p-4 rounded-lg border w-full">
            <TextInput
              classNames={{ root: "w-full" }}
              label="School Email"
              placeholder="student@columbia.edu"
            />
            <Button
              variant="outline-action"
              onClick={() => {
                // update user role and metadta
                // redirect to dashboard
              }}
            >
              Send Verification Email
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
