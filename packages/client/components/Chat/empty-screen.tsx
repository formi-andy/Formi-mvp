import { UseChatHelpers } from "ai/react";

import { Button } from "@/components/ui/button";
import { IconArrowRight } from "@/components/ui/icons";

const exampleMessages = [
  {
    heading: "Start with asking about my symptoms",
    message: "What symptoms are you experiencing?",
  },
  {
    heading: "Start with asking about my chronic health conditions",
    message: "What chronic health conditions do you have?",
  },
  {
    heading: "Start with asking about my medications",
    message: "What medications are you taking?",
  },
];

export function EmptyScreen({ setInput }: Pick<UseChatHelpers, "setInput">) {
  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="rounded-lg border bg-background p-8">
        <h1 className="mb-2 text-lg font-semibold">Hi there, I&apos;m Formi</h1>
        <p className="mb-2 leading-normal text-muted-foreground">
          I&apos;m here to help your doctor better understand your medical
          condition and provide you with the best care possible.
        </p>
        <p className="leading-normal text-muted-foreground">
          You can start a conversation here or try the following starters:
        </p>
        <div className="mt-4 flex flex-col items-start space-y-2">
          {exampleMessages.map((message, index) => (
            <Button
              key={index}
              variant="link"
              className="h-auto p-0 text-base text-black dark:text-white"
              onClick={() => setInput(message.message)}
            >
              <IconArrowRight className="mr-2 text-muted-foreground h-4" />
              {message.heading}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
