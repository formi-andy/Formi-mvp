import React, { useState, useRef } from "react";

type Props = {};

export const VideoFeed = (props: Props) => {
  const [imageObject, setImageObject] = useState({
    imagePreview: "",
    imageFile: null,
  });

  const handleFileInput = useRef(null);

  // const handleClick = () => {
  //   handleFileInput.current.click();
  // };

  const handleImageChange = (event) => {
    setImageObject({
      imagePreview: URL.createObjectURL(event.target.files[0]),
      imageFile: event.target.files[0],
    });
  };

  return (
    <div>
      {/* <button onClick={handleClick}>Upload Photo</button> */}
      <label>
        <input
          style={{ display: "none" }}
          type="file"
          accept="image/*"
          capture="environment"
          ref={handleFileInput}
          onChange={handleImageChange}
        />
      </label>
      {imageObject && <img src={imageObject.imagePreview} />}
    </div>
  );
};
