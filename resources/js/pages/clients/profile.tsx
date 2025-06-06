import { SharedData, User } from "@/types";
import { usePage } from "@inertiajs/react";

export default function ClientProfile() {
  const { user, success, error } = usePage<SharedData & { user: { data: User[] } }>().props;
  console.log(user);
}
