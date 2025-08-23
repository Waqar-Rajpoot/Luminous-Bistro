import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Menu from '@/models/Menu.model'; // Adjust path based on your structure
import { menuSchema } from '@/schemas/menuSchema'; // Import your Zod schema
import mongoose from 'mongoose';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

// Connect to MongoDB
dbConnect();

// GET a single menu by ID
export async function GET(request: NextRequest, { params }: { params: { menuId: string } }) {

  const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

  try {
    const { menuId } = await params;

    if (!mongoose.Types.ObjectId.isValid(menuId)) {
      return NextResponse.json({ success: false, message: 'Invalid Menu ID' }, { status: 400 });
    }

    const menu = await Menu.findById(menuId);

    if (!menu) {
      return NextResponse.json({ success: false, message: 'Menu not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: menu }, { status: 200 });
  } catch (error: any) {
    console.error(`Error fetching menu with ID ${params.menuId}:`, error);
    return NextResponse.json({ success: false, message: error.message || 'Server Error' }, { status: 500 });
  }
}

// PUT (Update) an existing menu by ID
export async function PUT(request: NextRequest, { params }: { params: { menuId: string } }) {
  
  const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

  try {
    const { menuId } = await params;
    const body = await request.json();

    if (!mongoose.Types.ObjectId.isValid(menuId)) {
      return NextResponse.json({ success: false, message: 'Invalid Menu ID' }, { status: 400 });
    }

    // Validate request body with Zod
    const validationResult = menuSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, message: 'Validation failed', errors: validationResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { ...updateData } = validationResult.data; // Exclude _id if present, as we use params.menuId

    // Find and update the menu
    const updatedMenu = await Menu.findByIdAndUpdate(menuId, updateData, { new: true, runValidators: true });

    if (!updatedMenu) {
      return NextResponse.json({ success: false, message: 'Menu not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedMenu }, { status: 200 });
  } catch (error: any) {
    if (error.code === 11000) { // Duplicate key error for unique fields like category
      return NextResponse.json({ success: false, message: 'A menu with this category name already exists.' }, { status: 409 });
    }
    console.error(`Error updating menu with ID ${params.menuId}:`, error);
    return NextResponse.json({ success: false, message: error.message || 'Server Error' }, { status: 500 });
  }
}

// DELETE a menu by ID
export async function DELETE(request: NextRequest, { params }: { params: { menuId: string } }) {
  
  const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

  try {
    const { menuId } = await params;

    if (!mongoose.Types.ObjectId.isValid(menuId)) {
      return NextResponse.json({ success: false, message: 'Invalid Menu ID' }, { status: 400 });
    }

    const deletedMenu = await Menu.findByIdAndDelete(menuId);

    if (!deletedMenu) {
      return NextResponse.json({ success: false, message: 'Menu not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Menu deleted successfully' }, { status: 200 });
  } catch (error: any) {
    console.error(`Error deleting menu with ID ${params.menuId}:`, error);
    return NextResponse.json({ success: false, message: error.message || 'Server Error' }, { status: 500 });
  }
}