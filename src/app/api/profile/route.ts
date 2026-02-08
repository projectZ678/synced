import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
    include: { links: true },
  });

  return NextResponse.json(profile);
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const data = await req.json();

  // Update profile
  await prisma.profile.update({
    where: { userId: session.user.id },
    data: {
      displayName: data.displayName,
      bio: data.bio,
      avatarUrl: data.avatarUrl,
    },
  });

  // Simple link handling: delete all and recreate for simplicity in this demo
  const profile = await prisma.profile.findUnique({ 
    where: { userId: session.user.id } 
  });

  if (profile) {
    await prisma.link.deleteMany({ where: { profileId: profile.id } });
    
    if (data.links && data.links.length > 0) {
      await prisma.link.createMany({
        data: data.links.map((link: any) => ({
          label: link.label || "Link",
          url: link.url || "#",
          profileId: profile.id,
        })),
      });
    }
  }

  return NextResponse.json({ message: "Profile updated" });
}
