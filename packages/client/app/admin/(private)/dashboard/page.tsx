"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AddQuestion from "@/components/Admin/AddQuestion";
import EditQuestion from "@/components/Admin/EditQuestion";

function AdminDashboard() {
  return (
    <div className="flex flex-col gap-y-4 min-h-screen items-center">
      <Tabs defaultValue="add" className="flex flex-col w-[80vw]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="add">Add Question</TabsTrigger>
          <TabsTrigger value="edit">Edit Question</TabsTrigger>
        </TabsList>
        <TabsContent value="add">
          <AddQuestion />
        </TabsContent>
        <TabsContent value="edit">
          <EditQuestion />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default AdminDashboard;
