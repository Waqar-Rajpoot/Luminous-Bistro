// // // src/components/MediaUploader.tsx
// // "use client"; // This is a client component

// // import React, { useState, useRef } from "react";
// // import { uploadFile } from "@/app/action"; // Adjust path as needed
// // import Image from "next/image";

// // interface MediaUploaderProps {
// //   onUploadSuccess?: (url: string, fileType: string) => void;
// //   onUploadError?: (message: string) => void;
// // }

// // export default function MediaUploader({
// //   onUploadSuccess,
// //   onUploadError,
// // }: MediaUploaderProps) {
// //   const [selectedFile, setSelectedFile] = useState<File | null>(null);
// //   const [previewUrl, setPreviewUrl] = useState<string | null>(null);
// //   const [message, setMessage] = useState("");
// //   const [loading, setLoading] = useState(false);
// //   const fileInputRef = useRef<HTMLInputElement>(null);

// //   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
// //     const file = event.target.files?.[0];
// //     if (file) {
// //       setSelectedFile(file);
// //       setMessage("");

// //       // Create a preview URL for images and videos
// //       if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
// //         setPreviewUrl(URL.createObjectURL(file));
// //       } else {
// //         setPreviewUrl(null);
// //       }
// //     } else {
// //       setSelectedFile(null);
// //       setPreviewUrl(null);
// //     }
// //   };

// //   const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
// //     event.preventDefault();
// //     if (!selectedFile) {
// //       setMessage("Please select a file to upload.");
// //       return;
// //     }

// //     setLoading(true);
// //     setMessage("Uploading...");

// //     const formData = new FormData();
// //     formData.append("file", selectedFile);
// //     formData.append("fileName", selectedFile.name);
// //     // You can add a folder here if needed: formData.append('folder', '/my-specific-folder');

// //     try {
// //       const result = await uploadFile(formData);

// //       if (result.success && result.url && result.fileType) {
// //         setMessage(`Upload successful! ${result.message}`);
// //         setFileUrlForDisplay(result.url, result.fileType); // Store URL for displaying
// //         onUploadSuccess?.(result.url, result.fileType);
// //         // Clear file input after successful upload
// //         if (fileInputRef.current) {
// //           fileInputRef.current.value = "";
// //         }
// //         setSelectedFile(null);
// //         setPreviewUrl(null);
// //       } else {
// //         setMessage(`Upload failed: ${result.message}`);
// //         onUploadError?.(result.message);
// //       }
// //     } catch (error: any) {
// //       setMessage(`An unexpected error occurred: ${error.message}`);
// //       onUploadError?.(error.message);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // State to store the URL and type of the last uploaded file for display on this component
// //   const [lastUploadedFile, setLastUploadedFile] = useState<{
// //     url: string;
// //     fileType: string;
// //   } | null>(null);

// //   const setFileUrlForDisplay = (url: string, fileType: string) => {
// //     setLastUploadedFile({ url, fileType });
// //   };

// //   return (
// //     <div
// //       style={{
// //         padding: "20px",
// //         border: "1px solid #ccc",
// //         borderRadius: "8px",
// //         maxWidth: "500px",
// //         margin: "20px auto",
// //       }}
// //     >
// //       <h3>Upload Images or Videos</h3>
// //       <form onSubmit={handleSubmit}>
// //         <input
// //           type="file"
// //           accept="image/*,video/*" // Allows both image and video files
// //           onChange={handleFileChange}
// //           ref={fileInputRef}
// //           disabled={loading}
// //           style={{ marginBottom: "10px" }}
// //         />
// //         {previewUrl && (
// //           <div
// //             style={{
// //               marginBottom: "10px",
// //               maxHeight: "200px",
// //               overflow: "hidden",
// //             }}
// //           >
// //             {selectedFile?.type.startsWith("image/") ? (
// //               <img
// //                 src={previewUrl}
// //                 alt="Preview"
// //                 style={{ maxWidth: "100%", height: "auto" }}
// //               />
// //             ) : selectedFile?.type.startsWith("video/") ? (
// //               <video
// //                 src={previewUrl}
// //                 controls
// //                 style={{ maxWidth: "100%", height: "auto" }}
// //               />
// //             ) : null}
// //           </div>
// //         )}
// //         <button
// //           type="submit"
// //           disabled={!selectedFile || loading}
// //           style={{
// //             padding: "10px 15px",
// //             backgroundColor: "#0070f3",
// //             color: "white",
// //             border: "none",
// //             borderRadius: "5px",
// //             cursor: "pointer",
// //           }}
// //         >
// //           {loading ? "Uploading..." : "Upload File"}
// //         </button>
// //       </form>
// //       {message && (
// //         <p
// //           style={{
// //             marginTop: "10px",
// //             color: loading
// //               ? "blue"
// //               : message.includes("successful")
// //                 ? "green"
// //                 : "red",
// //           }}
// //         >
// //           {message}
// //         </p>
// //       )}

// //       {lastUploadedFile && (
// //         <div
// //           style={{
// //             marginTop: "20px",
// //             borderTop: "1px solid #eee",
// //             paddingTop: "15px",
// //           }}
// //         >
// //           <h4>Last Uploaded File:</h4>
// //           {lastUploadedFile.fileType === "image" ? (
// //             <img
// //               src={lastUploadedFile.url}
// //               alt="Uploaded"
// //               style={{
// //                 maxWidth: "100%",
// //                 height: "auto",
// //                 border: "1px solid #ddd",
// //               }}
// //             />
// //           ) : (
// //             <video
// //               src={lastUploadedFile.url}
// //               controls
// //               style={{
// //                 maxWidth: "100%",
// //                 height: "auto",
// //                 border: "1px solid #ddd",
// //               }}
// //             />
// //           )}
// //           <p>
// //             URL:{" "}
// //             <a
// //               href={lastUploadedFile.url}
// //               target="_blank"
// //               rel="noopener noreferrer"
// //             >
// //               {lastUploadedFile.url}
// //             </a>
// //           </p>
// //           <p>You can see all uploaded media on the `/uploaded-media` page.</p>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }













// // src/components/MediaUploader.tsx
// "use client"; // This is a client component

// import React, { useState, useRef } from 'react';
// import Image from 'next/image'; // Import Next.js Image component for the local preview
// import { Image as ImageKitImage } from '@imagekit/next'; // Import ImageKit's Image component for displaying uploaded files
// import { uploadFile } from '@/app/action'; // Adjust path as needed

// interface MediaUploaderProps {
//   onUploadSuccess?: (url: string, fileType: string) => void;
//   onUploadError?: (message: string) => void;
// }

// export default function MediaUploader({ onUploadSuccess, onUploadError }: MediaUploaderProps) {
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [previewUrl, setPreviewUrl] = useState<string | null>(null);
//   const [message, setMessage] = useState('');
//   const [loading, setLoading] = useState(false);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   // Get ImageKit URL endpoint from client-side environment variable
//   const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!;

//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       setSelectedFile(file);
//       setMessage('');

//       // Create a preview URL for images and videos
//       if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
//         setPreviewUrl(URL.createObjectURL(file));
//       } else {
//         setPreviewUrl(null);
//       }
//     } else {
//       setSelectedFile(null);
//       setPreviewUrl(null);
//     }
//   };

//   const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     if (!selectedFile) {
//       setMessage('Please select a file to upload.');
//       return;
//     }

//     setLoading(true);
//     setMessage('Uploading...');

//     const formData = new FormData();
//     formData.append('file', selectedFile);
//     formData.append('fileName', selectedFile.name);

//     try {
//       const result = await uploadFile(formData);

//       if (result.success && result.url && result.fileType) {
//         setMessage(`Upload successful! ${result.message}`);
//         setFileUrlForDisplay(result.url, result.fileType); // Store URL for displaying
//         onUploadSuccess?.(result.url, result.fileType);
//         // Clear file input after successful upload
//         if (fileInputRef.current) {
//           fileInputRef.current.value = '';
//         }
//         setSelectedFile(null);
//         setPreviewUrl(null);
//       } else {
//         setMessage(`Upload failed: ${result.message}`);
//         onUploadError?.(result.message);
//       }
//     } catch (error: any) {
//       setMessage(`An unexpected error occurred: ${error.message}`);
//       onUploadError?.(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // State to store the URL and type of the last uploaded file for display on this component
//   const [lastUploadedFile, setLastUploadedFile] = useState<{ url: string; fileType: string } | null>(null);

//   const setFileUrlForDisplay = (url: string, fileType: string) => {
//     setLastUploadedFile({ url, fileType });
//   };


//   return (
//     <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', maxWidth: '500px', margin: '20px auto' }}>
//       <h3 className='third-heading'>Upload Images or Videos</h3>
//       <form onSubmit={handleSubmit}>
//         <input
//           className='text'
//           type="file"
//           accept="image/*,video/*"
//           onChange={handleFileChange}
//           ref={fileInputRef}
//           disabled={loading}
//           style={{ marginBottom: '10px' }}
//         />
//         {previewUrl && (
//           <div style={{ marginBottom: '10px', maxHeight: '200px', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
//             {selectedFile?.type.startsWith('image/') ? (
//               // Using Next.js Image component for the local preview
//               <Image
//                 src={previewUrl}
//                 alt="Preview"
//                 unoptimized // Key prop to allow blob URLs without fixed width/height requirement
//                 width={0} // These can be 0 or placeholder if unoptimized is true
//                 height={0} // as they will be ignored for unoptimized images
//                 style={{ maxWidth: '100%', maxHeight: '200px', height: 'auto', display: 'block' }}
//               />
//             ) : selectedFile?.type.startsWith('video/') ? (
//               // Videos still use standard <video> tag for blob previews
//               <video src={previewUrl} controls style={{ maxWidth: '100%', maxHeight: '200px', height: 'auto', display: 'block' }} />
//             ) : null}
//           </div>
//         )}
//         <button type="submit" disabled={!selectedFile || loading} style={{ padding: '10px 15px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', display: 'block', width: '100%', marginTop: '10px' }}>
//           {loading ? 'Uploading...' : 'Upload File'}
//         </button>
//       </form>
//       {message && <p style={{ marginTop: '10px', color: loading ? 'blue' : (message.includes('successful') ? 'green' : 'red') }}>{message}</p>}

//       {lastUploadedFile && (
//         <div style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '15px' }}>
//           <h4>Last Uploaded File:</h4>
//           {lastUploadedFile.fileType === "image" ? (
//             // For the *uploaded* file from ImageKit, use ImageKit's optimized Image component
//             <ImageKitImage
//               urlEndpoint={urlEndpoint}
//               src={lastUploadedFile.url.replace(urlEndpoint, '/')} // Important: src needs to be relative path for ImageKit's component
//               alt="Uploaded Image"
//               width={300} // Provide appropriate dimensions for display
//               height={200}
//               style={{ maxWidth: '100%', height: 'auto', border: '1px solid #ddd' }}
//             />
//           ) : (
//             // For uploaded video, use standard <video> or ImageKit's <Video> component
//             <video src={lastUploadedFile.url} controls style={{ maxWidth: '100%', height: 'auto', border: '1px solid #ddd' }} />
//           )}
//           <p>URL: <a href={lastUploadedFile.url} target="_blank" rel="noopener noreferrer">{lastUploadedFile.url}</a></p>
//           <p>You can see all uploaded media on the `/uploaded-media` page.</p>
//         </div>
//       )}
//     </div>
//   );
// }





// src/components/FileUpload.tsx
"use client";

import { upload } from "@imagekit/next";
import { Loader2, Image as ImageIcon, XCircle } from "lucide-react";
import React, { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import Image from "next/image";
import axios from "axios"; // Import axios

interface FileUploadProps {
  onChange: (value: string) => void;
  value: string;
  name: string;
  label?: string;
  disabled?: boolean;
  onUploadProgress?: (progress: number) => void;
}

const FileUpload = ({
  onChange,
  value,
  name,
  label = "Upload product image",
  disabled = false,
  onUploadProgress,
}: FileUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(value || null);

  useEffect(() => {
    setPreviewUrl(value || null);
  }, [value]);

  const validateFile = (file: File) => {
    setError(null);

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file (e.g., .jpg, .png, .jpeg, .gif, .webp).");
      return false;
    }

    const maxSizeMB = 10;
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`Please select a file less than ${maxSizeMB}MB.`);
      return false;
    }
    return true;
  };

  const handleUpload = useCallback(async (file: File) => {
    if (!validateFile(file)) {
      onChange("");
      setPreviewUrl(null);
      return;
    }

    setUploading(true);
    setError(null);
    setUploadProgress(0);

    // Create a local blob URL for immediate preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    let auth: any;
    try {
      // Fetch authentication parameters from your API route using Axios
      const authRes = await axios.get("/api/imagekit-auth");
      auth = authRes.data; // Axios automatically parses JSON into .data

    } catch (err: any) {
      console.error("Error fetching ImageKit auth:", err);
      URL.revokeObjectURL(objectUrl); // Clean up blob URL if auth fails
      
      let errorMessage = "Failed to get ImageKit authentication.";
      if (axios.isAxiosError(err) && err.response) {
        // If it's an Axios error with a response, try to get the message from data
        errorMessage = err.response.data?.error || err.response.data?.message || JSON.stringify(err.response.data);
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      toast.error(`Image upload failed: ${errorMessage}`);
      onChange("");
      setPreviewUrl(null);
      setUploading(false);
      setUploadProgress(0);
      return;
    }

    // Proceed with ImageKit upload if auth was successful
    try {
      const res = await upload({
        file: file,
        fileName: file.name,
        token: auth.token,
        publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!, // Public key from client-side env
        signature: auth.signature,
        expire: auth.expire,
        onProgress: (event) => {
          if (event.lengthComputable) {
            const percent = (event.loaded / event.total) * 100;
            setUploadProgress(Math.round(percent));
            onUploadProgress?.(Math.round(percent));
          }
        },
      });

      onChange(res.url);
      setPreviewUrl(res.url); // Update preview to the permanent ImageKit URL
      toast.success("Image uploaded successfully!");
    } catch (err: any) {
      console.error("Error uploading file to ImageKit:", err); // More specific error message
      setError(err.message || "An error occurred during upload to ImageKit.");
      toast.error(err.message || "Image upload failed.");
      onChange("");
      setPreviewUrl(null);
    } finally {
      setUploading(false);
      setUploadProgress(0);
      URL.revokeObjectURL(objectUrl); // Revoke the original blob URL
    }
  }, [onChange, onUploadProgress]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
    // Clear the input field's value so the same file can be selected again
    e.target.value = '';
  };

  const handleRemoveImage = () => {
    onChange("");
    setPreviewUrl(null);
    setError(null);
    setUploading(false);
    setUploadProgress(0);
    toast.info("Image removed.");
  };

  return (
    <div className="flex flex-col gap-2 p-4 border border-[#efa765] rounded-lg bg-gray-800/90 relative">
      <label htmlFor={name} className="text-white text-sm font-sans mb-2">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type="file"
        accept="image/*" // Only accepts image files
        onChange={handleFileChange} // Auto-upload on change
        className="block w-full text-sm text-gray-300
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-[#efa765] file:text-[#141f2d]
          hover:file:bg-opacity-80 transition-colors
          cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={uploading || disabled}
      />

      {uploading && (
        <div className="flex items-center justify-center py-2 text-gray-300">
          <Loader2 className="animate-spin h-5 w-5 mr-2" />
          <span>Uploading image... {uploadProgress}%</span>
        </div>
      )}

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

      {previewUrl && !uploading && (
        <div className="mt-4 flex flex-col items-center">
          <p className="text-gray-300 text-sm mb-2">Image Preview:</p>
          <div className="relative w-full max-w-[200px] h-[150px] rounded-md overflow-hidden border border-gray-700">
            <Image
              src={previewUrl}
              alt="Product Image Preview"
              layout="fill"
              objectFit="cover"
              className="rounded-md"
              unoptimized={previewUrl.startsWith('blob:')} // Don't optimize blob URLs
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-1 right-1 p-1 bg-red-600 rounded-full text-white hover:bg-red-700 transition-colors z-10"
              title="Remove Image"
            >
              <XCircle className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {!previewUrl && !uploading && !error && (
        <div className="mt-4 flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-600 rounded-md text-gray-400">
          <ImageIcon className="h-10 w-10 mb-2" />
          <span>No image selected</span>
        </div>
      )}
    </div>
  );
};

export default FileUpload;