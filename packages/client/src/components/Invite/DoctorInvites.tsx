"use client";

import { Tabs } from "@mantine/core";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

export default function PatientInvites() {
  const pendingInvites = useQuery(api.invite.getPendingInvites);
  const pastInvites = useQuery(api.invite.getPastInvites);

  return (
    <Tabs variant="outline" defaultValue="pending">
      <Tabs.List grow justify="center">
        <Tabs.Tab
          value="pending"
          // leftSection={<IconPhoto style={iconStyle} />}
        >
          Pending Invites
        </Tabs.Tab>
        <Tabs.Tab
          value="past"
          // leftSection={<IconMessageCircle style={iconStyle} />}
        >
          Past Invites
        </Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="pending">
        <div className="flex flex-col p-4 lg:p-8 border-x border-b min-h-[400px] h-[60vh]">
          <div className="flex flex-col items-center">
            {pendingInvites?.length > 0 ? (
              pendingInvites.map((invite) => {
                return (
                  <div className="flex flex-col lg:flex-row justify-between items-center gap-4 lg:gap-8 border rounded-lg p-4 lg:p-8">
                    {/* <div className="flex flex-col gap-2">
                      <p className="text-lg font-medium">{invite.name}</p>
                      <p className="text-sm">{invite.email}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <p className="text-sm">{invite.role}</p>
                      <p className="text-sm">{invite.date}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button className="border rounded-lg px-4 py-2 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition">
                        Accept
                      </button>
                      <button className="border rounded-lg px-4 py-2 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition">
                        Decline
                      </button>
                    </div> */}
                  </div>
                );
              })
            ) : (
              <p className="text-lg font-medium">No pending invites</p>
            )}
          </div>
        </div>
      </Tabs.Panel>
      <Tabs.Panel value="past">
        <div className="flex flex-col p-4 lg:p-8 border-x border-b min-h-[400px] h-[60vh]"></div>
      </Tabs.Panel>
    </Tabs>
    // </div>
  );
}
