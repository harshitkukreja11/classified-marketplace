import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth"; // we'll create this next

export default async function CreatePage() {
  const session = await getServerSession(authOptions);

  // 🔒 Not logged in → redirect
  if (!session) {
    redirect("/login");
  }

  return (
    <div>
      <h1>Create Listing</h1>
      {/* your form here */}
    </div>
  );
}