import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { RequestWizard } from "@/components/RequestWizard";

export default async function RequestPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return <RequestWizard defaultSchool={user.school} defaultCourse={user.course} defaultSemester={user.semester} />;
}
