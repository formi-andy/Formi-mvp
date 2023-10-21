import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserTab from "@/components/Onboarding/UserTab";
import StudentTab from "@/components/Onboarding/StudentTab";

export default async function Onboarding() {
  return (
    <div className="flex w-full items-center justify-center flex-1">
      <div className="w-full grid p-6 lg:p-8 justify-center gap-y-4 border rounded-lg max-w-2xl shadow-accent-2">
        <div className="relative flex h-[200px] justify-center mb-4">
          <Image
            src="/assets/undraw_onboarding.svg"
            fill={true}
            className="w-full h-full"
            alt="No Images Found"
            priority
          />
        </div>
        <p className="text-lg lg:text-xl font-medium text-center">
          What are you looking for?
        </p>
        <Tabs defaultValue="user" className="flex flex-col w-80 sm:w-[400px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="user">I&apos;m a User</TabsTrigger>
            <TabsTrigger value="student">I&apos;m a Student</TabsTrigger>
          </TabsList>
          <TabsContent value="user">
            <UserTab />
          </TabsContent>
          <TabsContent value="student">
            <StudentTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
