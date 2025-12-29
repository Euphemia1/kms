import { NextResponse } from "next/server";

let teamMembers = [
  { id: 1, name: "Alice", role: "Developer" },
  { id: 2, name: "Bob", role: "Designer" },
  { id: 3, name: "Charlie", role: "Manager" },
];

export async function GET() {
  return NextResponse.json(teamMembers);
}

export async function POST(request: Request) {
  const newMember = await request.json();
  const id = teamMembers.length ? teamMembers[teamMembers.length - 1].id + 1 : 1;
  const member = { id, ...newMember };
  teamMembers.push(member);
  return NextResponse.json(teamMembers);
}

export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const id = parseInt(url.pathname.split("/").pop() || "0", 10);
  teamMembers = teamMembers.filter((member) => member.id !== id);
  return NextResponse.json(teamMembers);
}