import TutorialCard from "../Tutorials/TutorialCard";

export const Instructions = () => {
  return (
    <div>
      <p className="text-xl font-medium">Instructions</p>
      <ol className="list-decimal list-inside">
        <li>Plug in your HomeScope device to the computer</li>
        <li>
          Enable permissions for microphone and camera if prompted and needed
        </li>
        <li>
          Enter a meeting ID and press the Join Meeting button. This will either
          join an existing meeting if the meeting ID is in use or create a new
          meeting with the entered meeting ID.
        </li>
        <li>
          Click the Start Screen Share button and select the Teslong device from
          the device menu.
        </li>
        <li>
          Click &quot;capture&quot; to take screen shots. Capturing will capture
          the camera&apos;s output. These are downloaded onto your personal
          computer.
        </li>
        <li>Click &quot;stop&quot; to stop the video feed.</li>
        <li>Click &quot;upload&quot; to upload the images to the cloud.</li>
      </ol>
      <TutorialCard />
    </div>
  );
};
