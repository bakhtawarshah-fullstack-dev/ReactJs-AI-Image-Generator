import "./ImageGenerator.css";
import default_image from "../Assets/default_image.svg";
import { useRef, useState } from "react";

const ImageGenerator = () => {
  const [imageUrl, setImageUrl] = useState("/");
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(null);

  const token = process.env.REACT_APP_BEARER_TOKEN;

  const imageGenerator = async () => {
    console.log("image generator clicked.!");
    if (inputRef.current.value === "") {
      return 0;
    }

    setLoading(true);
    try {
      const response = await fetch(
        "https://api.openapi.com/v1/images/generations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization:
              `Bearer ${token}`,
            "User-Agent": "Chrome",
          },
          body: JSON.stringify({
            prompt: `${inputRef.current.value}`,
            n: 1,
            size: "512x512",
          }),
        }
      );

      // 🔍 Check if response is not OK (non-200)
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Image generation failed");
      }

      const data = await response.json();
      const data_array = data.data;
      setImageUrl(data_array[0]?.url || null);
    } catch (err) {
      console.error("Image generation failed:", err.message);
      alert("⚠️ Failed to generate image: " + err.message);
      setImageUrl(null); // Clear image
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };

  return (
    <div className="ai-image-generator">
      <div className="header">
        Ai image <span>generator</span>
      </div>
      <div className="img-loading">
        <div className="image">
          <img
            alt="Image not found"
            src={imageUrl === "/" ? default_image : imageUrl}
          />
        </div>
        <div className="loading">
          <div className={loading ? "loading-bar-full" : "loading-bar"}></div>
          <div className={loading ? "loading-text" : "display-none"}>
            Loading
          </div>
        </div>
      </div>
      <div className="search-box">
        <input
          type="text"
          ref={inputRef}
          className="search-text"
          placeholder="Describe what you want to see!"
        />
        <div className="generate-btn" onClick={() => imageGenerator()}>
          Generate
        </div>
      </div>
    </div>
  );
};

export default ImageGenerator;
