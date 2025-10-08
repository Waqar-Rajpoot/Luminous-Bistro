
// import { NextResponse } from "next/server";
// import connectDB from "@/lib/dbConnect";
// import User from "@/models/User.model";

// export async function POST(request: Request) {
//   try {
//     await connectDB();

//     const formData = await request.json();
//     console.log('Form Data received:', formData);
//     // const file = formData.get('profileImage');
//     // const userId = formData.get('userId');

//     // Check if both file and userId are provided
//     if (!file || !userId) {
//       return NextResponse.json({ success: false, message: 'File and user ID are required.' }, { status: 400 });
//     }

//     // Upload the file to ImageKit using your real function
//     const imageUrl = await uploadToImageKit(file);
//     if (!imageUrl) {
//       return NextResponse.json({ success: false, message: 'Image upload failed.' }, { status: 500 });
//     }

//     // Find the user by ID and update the imageURL field
//     const user = await User.findById(userId);

//     if (!user) {
//       return NextResponse.json({ success: false, message: 'User not found.' }, { status: 404 });
//     }

//     user.imageURL = imageUrl;
//     await user.save();

//     return NextResponse.json({
//       success: true,
//       message: 'Profile picture updated successfully.',
//       imageUrl: imageUrl,
//     }, { status: 200 });

//   } catch (error) {
//     console.error('API Error:', error);
//     return NextResponse.json({ success: false, message: 'Internal server error.' }, { status: 500 });
//   }
// }






import { NextResponse } from "next/server";
import connectDB from "@/lib/dbConnect";
import User from "@/models/User.model";

// NOTE: We assume the image is uploaded to a service (like ImageKit) on the 
// client-side or in a separate function *before* this API is called, 
// and this endpoint is only used to save the resulting public URL to the user's profile.

export async function POST(request: Request) {
  try {
    await connectDB();

    // 1. Parse the request body as JSON
    const body = await request.json();
    console.log('JSON Body received:', body);

    // 2. Destructure the required fields from the JSON body
    const { imageUrl, userId } = body;

    // 3. Check if both required fields are provided
    if (!imageUrl || !userId) {
      return NextResponse.json({ 
        success: false, 
        message: 'Image URL and user ID are required in the JSON body.' 
      }, { status: 400 });
    }

    // The old file-handling/upload logic is removed, as the client sent the URL directly.

    // 4. Find the user by ID and update the imageURL field
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found.' }, { status: 404 });
    }

    user.imageURL = imageUrl;
    await user.save();

    return NextResponse.json({
      success: true,
      message: 'Profile picture URL saved successfully.',
      imageUrl: imageUrl,
    }, { status: 200 });

  } catch (error) {
    // Handle JSON parsing errors or database errors
    if (error instanceof SyntaxError && 'message' in error && error.message.includes('JSON')) {
        console.error('API Error: Invalid JSON received in request body.', error);
        return NextResponse.json({ success: false, message: 'Invalid JSON format. Ensure Content-Type is application/json.' }, { status: 400 });
    }

    console.error('API Error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error.' }, { status: 500 });
  }
}
