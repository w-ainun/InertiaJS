import { Address, SharedData } from "@/types";
import { usePage } from "@inertiajs/react";
import { useEffect } from "react";
import { toast } from "sonner";

export default function AddressCreate() {
  const { address, success, error } = usePage<SharedData & { address: { data: Address } }>().props;
  console.log(address);

  useEffect(() => {
    if (success) toast.success(success as string);
    if (error) toast.error(error as string);
  }, [success, error]);

  return <h1>Address ID : {address.data.id}</h1>
};