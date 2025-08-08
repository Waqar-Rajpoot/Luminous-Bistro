import { getUploadAuthParams } from "@imagekit/next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    
    const session = await getServerSession(authOptions);
    console.log("User Session is: ",session)
    if (session?.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { token, expire, signature} = getUploadAuthParams({
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string,
      publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY as string,
    });
    
    console.log("hello 2 ")
    return Response.json({
       token, expire, signature,
    });
  } catch (error) {
    console.error("Error generating authentication parameters:", error);
    return Response.json(
      { error: "Failed to generate authentication parameters" },
      { status: 500 }
    );
  }
}




// import { getUploadAuthParams } from "@imagekit/next/server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "../auth/[...nextauth]/options"; // Assuming this path is correct relative to your route file
// import { NextResponse } from "next/server"; // Use NextResponse consistently

// export async function GET() {
//   try {
//     const session = await getServerSession(authOptions);
//     console.log("User Session is: ", session);

//     // 1. Authorization Check
//     if (session?.user?.role !== "admin") {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     // 2. Validate Environment Variables at runtime
//     const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
//     const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;
//     const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT; // Also good to validate if needed elsewhere

//     if (!privateKey || !publicKey || !urlEndpoint) {
//       console.error("Missing ImageKit environment variables for server-side auth.");
//       return NextResponse.json(
//         { error: "Server configuration error: ImageKit keys not found." },
//         { status: 500 }
//       );
//     }

//     // 3. Get authentication parameters
//     const { token, expire, signature } = getUploadAuthParams({
//       privateKey: privateKey, // Use validated variable
//       publicKey: publicKey,   // Use validated variable
//     });

//     console.log("ImageKit authentication parameters generated successfully.");
//     console.log("Token:", token); // For debugging: be cautious logging sensitive info in production
//     console.log("Expire:", expire);
//     console.log("Signature:", signature);

//     // 4. Return necessary parameters (removed redundant publicKey)
//     return NextResponse.json({
//       token,
//       expire,
//       signature,
//     });
//   } catch (error: any) { // Use 'any' or more specific type if known
//     console.error("Error generating ImageKit authentication parameters:", error); // More descriptive message
//     return NextResponse.json(
//       { error: error.message || "Failed to generate authentication parameters" }, // Provide specific error message if available
//       { status: 500 }
//     );
//   }
// }
