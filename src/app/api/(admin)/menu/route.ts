import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Menu from '@/models/Menu.model'; // Adjust path based on your structure
import { menuSchema } from '@/schemas/menuSchema'; // Import your Zod schema
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/options';

// Connect to MongoDB
dbConnect();

 
// GET all menus
export async function GET() {
 
  try {
    const menus = await Menu.find({}).sort({ category: 1 }); // Sort by category name
    return NextResponse.json({ success: true, data: menus }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching menus:", error);
    return NextResponse.json({ success: false, message: error.message || 'Server Error' }, { status: 500 });
  }
}

// POST a new menu
export async function POST(request: NextRequest) {
   const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'admin') {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await request.json();

    // Validate request body with Zod
    const validationResult = menuSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, message: 'Validation failed', errors: validationResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { _id, ...menuData } = validationResult.data; // Exclude _id if present for new creation

    const newMenu = await Menu.create(menuData);
    return NextResponse.json({ success: true, data: newMenu }, { status: 201 });
  } catch (error: any) {
    if (error.code === 11000) { // Duplicate key error (e.g., category name already exists)
      return NextResponse.json({ success: false, message: 'A menu with this category name already exists.' }, { status: 409 });
    }
    console.error("Error creating menu:", error);
    return NextResponse.json({ success: false, message: error.message || 'Server Error' }, { status: 500 });
  }
}