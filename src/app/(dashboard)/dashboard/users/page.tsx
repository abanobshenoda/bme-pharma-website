import { getUsers } from "@/actions/user-actions";
import UsersClientPage from "./users-client";

export default async function UsersPage() {
  const { data: users = [] } = await getUsers();

  return <UsersClientPage initialUsers={users || []} />;
}
