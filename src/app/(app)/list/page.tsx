import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { ListWizard } from "@/components/ListWizard";

export default async function ListPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return <ListWizard defaultSchool={user.school} defaultCourse={user.course} defaultSemester={user.semester} />;
}
