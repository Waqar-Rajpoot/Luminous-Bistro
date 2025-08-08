// src/app/uploaded-media/page.tsx
// This is a Server Component, so no "use client" needed here.

import Link from "next/link";
import { Image, Video } from "@imagekit/next";
import dbConnect from "@/lib/dbConnect"; // Import MongoDB connection
import UploadedMedia, { IUploadedMedia } from "@/models/UploadedMedia"; // Import your Mongoose model

export const metadata = {
  title: "Uploaded Media",
  description: "View your uploaded images and videos.",
};

export default async function UploadedMediaPage() {
  const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!;
  let mediaList: IUploadedMedia[] = [];
  let errorMessage: string | null = null;

  try {
    await dbConnect(); // Connect to MongoDB
    mediaList = await UploadedMedia.find({}).sort({ uploadedAt: -1 }).lean(); // Fetch all media, sort by most recent, and use .lean() for plain JS objects
  } catch (error: any) {
    console.error("Error fetching media from MongoDB:", error);
    errorMessage =
      "Failed to load media from database. Please check server logs.";
  }

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "800px",
        margin: "20px auto",
        fontFamily: "sans-serif",
      }}
    >
      <h1>Your Uploaded Media</h1>
      <p>
        Here are the images and videos uploaded to ImageKit and stored in
        MongoDB.
      </p>
      <Link href="/">
        <button
          style={{
            marginBottom: "20px",
            padding: "10px 15px",
            backgroundColor: "#0070f3",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Go to Uploader
        </button>
      </Link>

      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      {!errorMessage && mediaList.length === 0 && (
        <p>No media uploaded yet. Upload some files from the home page!</p>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "20px",
        }}
      >
        {mediaList.map((media) => (
          <div
            key={media._id.toString()}
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              overflow: "hidden",
              padding: "10px",
            }}
          >
            <h4 className="text-green-600 mb-3 border-b">{media.fileName}</h4>
            {media.fileType === "image" ? (
              <Image
                urlEndpoint={urlEndpoint}
                src={media.url.replace(urlEndpoint, "/")}
                alt={media.fileName}
                width={250}
                height={150}
                quality={100}
                style={{ width: "100%", height: "auto", display: "block" }}
              />
            ) : (
              <Video
                urlEndpoint={urlEndpoint}
                src={media.url.replace(urlEndpoint, "/")}
                controls
                width={250}
                height={150}
                style={{ width: "100%", height: "auto", display: "block" }}
              />
            )}
            <p
              style={{
                fontSize: "0.8em",
                wordBreak: "break-all",
                marginTop: "5px",
              }}
            >
              URL:{" "}
              <a href={media.url} target="_blank" rel="noopener noreferrer">
                {media.url}
              </a>
            </p>
            <p style={{ fontSize: "0.7em", color: "#666" }}>
              Uploaded: {new Date(media.uploadedAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
