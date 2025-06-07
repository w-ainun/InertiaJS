import type { User } from "@/types"
import type { ColumnDef } from "@tanstack/react-table"
import { formatDistanceToNow, format } from "date-fns"
import { Shield, Truck, UserIcon, Clock, Calendar, Trash2, CheckCircle, XCircle, Wifi, WifiOff } from "lucide-react"

import Checkbox from "@/components/elements/checkbox"
import { DataTableColumnHeader } from "@/components/templates/data-table-header"
import { DeleteModal } from "@/components/templates/delete-modal"
import { EditButton } from "@/components/templates/edit-button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ShowButton } from "@/components/templates/show-button"
import { RestoreModal } from "@/components/templates/restore-modal"

// Helper function to get initials (moved outside to avoid hooks rule violation)
const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

// Helper function to get role badge configuration
const getRoleBadgeConfig = (role: string) => {
  switch (role.toLowerCase()) {
    case "admin":
      return {
        variant: "purple" as const,
        icon: Shield,
        label: "Admin",
      }
    case "courier":
      return {
        variant: "orange" as const,
        icon: Truck,
        label: "Courier",
      }
    case "client":
      return {
        variant: "cyan" as const,
        icon: UserIcon,
        label: "Client",
      }
    default:
      return {
        variant: "muted" as const,
        icon: UserIcon,
        label: role,
      }
  }
}

// Helper function to get status badge configuration
const getStatusBadgeConfig = (status: string) => {
  switch (status.toLowerCase()) {
    case "active":
      return {
        variant: "success" as const,
        icon: CheckCircle,
        label: "Active",
      }
    case "inactive":
      return {
        variant: "inactive" as const,
        icon: XCircle,
        label: "Inactive",
      }
    default:
      return {
        variant: "muted" as const,
        icon: XCircle,
        label: status,
      }
  }
}

export const columns: ColumnDef<User, string>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "avatar",
    header: "Avatar",
    cell: ({ row }) => {
      const username = row.getValue("username") as string
      const avatar = row.getValue("avatar") as string

      return (
        <Avatar className="h-10 w-10 overflow-hidden rounded-full border-2 border-border">
          <AvatarImage src={avatar || "/placeholder.svg"} alt={username} />
          <AvatarFallback className="rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
            {getInitials(username)}
          </AvatarFallback>
        </Avatar>
      )
    },
  },
  {
    accessorKey: "username",
    header: ({ column }) => <DataTableColumnHeader<User, unknown> column={column} title="Username" />,
    cell: ({ row }) => <div className="font-medium text-foreground">{row.getValue("username")}</div>,
  },
  {
    accessorKey: "email",
    header: ({ column }) => <DataTableColumnHeader<User, unknown> column={column} title="Email" />,
    cell: ({ row }) => <div className="text-muted-foreground">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "role",
    header: ({ column }) => <DataTableColumnHeader<User, unknown> column={column} title="Role" />,
    cell: ({ row }) => {
      const role = row.getValue("role") as string
      const config = getRoleBadgeConfig(role)
      const Icon = config.icon

      return (
        <Badge variant={config.variant} className="gap-1.5">
          <Icon className="h-3 w-3" />
          {config.label}
        </Badge>
      )
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader<User, unknown> column={column} title="Status" />,
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      const config = getStatusBadgeConfig(status)
      const Icon = config.icon

      return (
        <Badge variant={config.variant} className="gap-1.5">
          <Icon className="h-3 w-3" />
          {config.label}
        </Badge>
      )
    },
  },
  {
    accessorKey: "remember_token",
    header: ({ column }) => <DataTableColumnHeader<User, unknown> column={column} title="Last Seen" />,
    cell: ({ row }) => {
      const rememberToken = row.getValue("remember_token")
      const isOnline = !!rememberToken

      return (
        <Badge variant={isOnline ? "online" : "offline"} className="gap-1.5">
          {isOnline ? (
            <>
              <Wifi className="h-3 w-3" />
              Online
            </>
          ) : (
            <>
              <WifiOff className="h-3 w-3" />
              Offline
            </>
          )}
        </Badge>
      )
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => <DataTableColumnHeader<User, unknown> column={column} title="Registered" />,
      cell: ({ row }) => {
      const createdAt = row.getValue("created_at") as string;
      if (!createdAt) return null;

      const formattedDate = format(new Date(createdAt), "d MMMM yyyy", {
        // locale: en,
      });

      return (
        <Badge variant="info" className="gap-1.5">
          <Calendar className="h-3 w-3" />
          {formattedDate}
        </Badge>
      )
    },
  },
  {
    accessorKey: "updated_at",
    header: ({ column }) => <DataTableColumnHeader<User, unknown> column={column} title="Last Update" />,
    cell: ({ row }) => {
      const updatedAt = row.getValue("updated_at") as string
      if (!updatedAt) return null

      const lastUpdate = formatDistanceToNow(new Date(updatedAt), {
        addSuffix: true,
      })

      return (
        <Badge variant="warning" className="gap-1.5">
          <Clock className="h-3 w-3" />
          {lastUpdate}
        </Badge>
      )
    },
  },
  {
    accessorKey: "deleted_at",
    header: ({ column }) => <DataTableColumnHeader<User, unknown> column={column} title="Deleted" />,
    cell: ({ row }) => {
      const deletedAt = row.getValue("deleted_at") as string
      if (!deletedAt) return null

      return (
        <Badge variant="destructive" className="gap-1.5">
          <Trash2 className="h-3 w-3" />
          Deleted
        </Badge>
      )
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const user = row.original;
      const isDeleted = !!user.deleted_at;

      return (
        <div className="flex gap-2">
          {isDeleted ? (
          <>
            <ShowButton endpoint="user" id={String(user.id)} />
            <RestoreModal resourceName="user" id={user.id} />
          </>
        ) : (
          <>
            <EditButton endpoint="user" id={String(user.id)} />
            <DeleteModal resourceName="user" id={user.id} />
          </>
        )}
        </div>
      );
    },
  }
]
