import { prisma } from "@/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const locations = await prisma.locations.findMany({
      orderBy: {
        locationName: "asc", 
      },
    });
    return NextResponse.json({ success: true, data: locations });
  } catch (error) {
    console.error("Error fetching locations:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch locations." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { locationName, locationAddress } = await req.json();
    const newLocation = await prisma.locations.create({
      data: { locationName, locationAddress },
    });
    return NextResponse.json({ success: true, data: newLocation });
  } catch (error) {
    console.error("Error creating location:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create location." },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { locationId, locationName, locationAddress } = await req.json();
    const updatedLocation = await prisma.locations.update({
      where: { locationId },
      data: { locationName, locationAddress },
    });
    return NextResponse.json({ success: true, data: updatedLocation });
  } catch (error) {
    console.error("Error updating location:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update location." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { locationId } = await req.json();
    await prisma.locations.delete({ where: { locationId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting location:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete location." },
      { status: 500 }
    );
  }
}
