import { useEffect } from "react"
import { toast } from "sonner"
import {
  ChevronLeft,
  User,
  Mail,
  Shield,
  Activity,
  Calendar,
  Clock,
  Eye,
  Trash2,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Wifi,
  WifiOff,
  ExternalLink,
} from "lucide-react"
import { router, usePage } from "@inertiajs/react"
import type { BreadcrumbItem, SharedData, User as UserType } from "@/types"
import { formatDistanceToNow, format } from "date-fns"

import { Button } from "@/components/elements/button"
import Separator from "@/components/elements/separator"
import AppLayout from "@/components/layouts/app-layout"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { EditButton } from "@/components/templates/edit-button"
import { DeleteModal } from "@/components/templates/delete-modal"
import { RestoreModal } from "@/components/templates/restore-modal"
import Card from "@/components/fragments/card/card"
import CardHeader from "@/components/fragments/card/card-header"
import CardTitle from "@/components/fragments/card/card-title"
import CardDescription from "@/components/fragments/card/card-description"
import CardContent from "@/components/fragments/card/card-content"

export default function UsersShow() {
  const { user, success, error } = usePage<SharedData & { user: { data: UserType } }>().props

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: "Users",
      href: route("users.index"),
    },
    {
      title: "Details",
      href: route("users.show", user.data.id),
    },
  ]

  useEffect(() => {
    if (success) toast.success(success as string)
    if (error) toast.error(error as string)
  }, [success, error])

  // Helper function to get initials
  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  // Helper function to render role badge
  const getRoleBadge = (role: string) => {
    switch (role) {
      case "ADMIN":
        return (
          <Badge variant="purple" className="gap-1.5">
            <Shield className="h-3 w-3" />
            Admin
          </Badge>
        )
      case "CLIENT":
        return (
          <Badge variant="cyan" className="gap-1.5">
            <User className="h-3 w-3" />
            Client
          </Badge>
        )
      case "COURIER":
        return (
          <Badge variant="orange" className="gap-1.5">
            <Activity className="h-3 w-3" />
            Courier
          </Badge>
        )
      default:
        return (
          <Badge variant="muted" className="gap-1.5">
            <User className="h-3 w-3" />
            {role}
          </Badge>
        )
    }
  }

  // Helper function to render status badge
  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case "ACTIVE":
        return (
          <Badge variant="success" className="gap-1.5">
            <CheckCircle className="h-3 w-3" />
            Active
          </Badge>
        )
      case "INACTIVE":
        return (
          <Badge variant="inactive" className="gap-1.5">
            <XCircle className="h-3 w-3" />
            Inactive
          </Badge>
        )
      default:
        return (
          <Badge variant="muted" className="gap-1.5">
            <XCircle className="h-3 w-3" />
            {status}
          </Badge>
        )
    }
  }

  // Helper function to get online status
  const getOnlineStatus = () => {
    const isOnline = !!user.data.remember_token
    return isOnline ? (
      <Badge variant="online" className="gap-1.5">
        <Wifi className="h-3 w-3" />
        Online
      </Badge>
    ) : (
      <Badge variant="offline" className="gap-1.5">
        <WifiOff className="h-3 w-3" />
        Offline
      </Badge>
    )
  }

  const isDeleted = !!user.data.deleted_at

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="container py-8 px-4">
        <Card className="border shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 border-4 border-border">
                  <AvatarImage src={user.data.avatar || "/placeholder.svg"} alt={user.data.username} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-lg">
                    {getInitials(user.data.username)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <CardTitle className="text-2xl">{user.data.username}</CardTitle>
                    {getRoleBadge(user.data.role)}
                    {getStatusBadge(user.data.status)}
                  </div>
                  <CardDescription className="mt-1 flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {user.data.email}
                  </CardDescription>
                  <div className="mt-2 flex items-center gap-2">
                    {getOnlineStatus()}
                    <Badge variant="outline" className="font-mono">
                      ID: #{user.data.id}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* <div className="flex items-center gap-2">
                {isDeleted ? (
                  <>
                    <RestoreModal resourceName="user" id={user.data.id} />
                  </>
                ) : (
                  <>
                    <EditButton endpoint="user" id={String(user.data.id)} />
                    <DeleteModal resourceName="user" id={user.data.id} />
                  </>
                )}
              </div> */}
            </div>

            {isDeleted && (
              <Alert variant="destructive" className="mt-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Deleted User</AlertTitle>
                <AlertDescription>
                  This user was deleted {user.data.deleted_at && formatDistanceToNow(new Date(user.data.deleted_at), { addSuffix: true })} and
                  cannot access the system.
                </AlertDescription>
              </Alert>
            )}
          </CardHeader>

          <Tabs defaultValue="overview" className="w-full">
            <div className="px-6 pt-6">
              <TabsList className="grid grid-cols-3 w-full max-w-md">
                <TabsTrigger value="overview" className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  <span>Overview</span>
                </TabsTrigger>
                <TabsTrigger value="details" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>Details</span>
                </TabsTrigger>
                <TabsTrigger value="activity" className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  <span>Activity</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <CardContent className="p-6">
              <TabsContent value="overview" className="mt-4 space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Basic Information */}
                  <Card className="border-muted">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <User className="h-5 w-5 text-primary" />
                        Basic Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Username:</span>
                        <span className="font-medium">{user.data.username}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Email:</span>
                        <span className="font-medium">{user.data.email}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">User ID:</span>
                        <Badge variant="outline" className="font-mono">
                          #{user.data.id}
                        </Badge>
                      </div>
                      {user.data.avatar && (
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Avatar:</span>
                          <Button variant="ghost" size="sm" asChild>
                            <a href={user.data.avatar} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-3 w-3 mr-1" />
                              View
                            </a>
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Permissions & Status */}
                  <Card className="border-muted">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Shield className="h-5 w-5 text-primary" />
                        Permissions & Status
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Role:</span>
                        {getRoleBadge(user.data.role)}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Status:</span>
                        {getStatusBadge(user.data.status)}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Online Status:</span>
                        {getOnlineStatus()}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Can Login:</span>
                        <Badge variant={user.data.status === "ACTIVE" && !isDeleted ? "success" : "destructive"}>
                          {user.data.status === "ACTIVE" && !isDeleted ? "Yes" : "No"}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Stats */}
                <Card className="border-muted">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Activity className="h-5 w-5 text-primary" />
                      Quick Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold text-primary">
                          {user.data.created_at
                            ? Math.floor(
                                (new Date().getTime() - new Date(user.data.created_at).getTime()) /
                                  (1000 * 60 * 60 * 24),
                              )
                            : 0}
                        </div>
                        <div className="text-sm text-muted-foreground">Days Active</div>
                      </div>
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold text-primary">
                          {user.data.remember_token ? "Online" : "Offline"}
                        </div>
                        <div className="text-sm text-muted-foreground">Current Status</div>
                      </div>
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold text-primary">{user.data.role}</div>
                        <div className="text-sm text-muted-foreground">Access Level</div>
                      </div>
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold text-primary">
                          {isDeleted ? "Deleted" : user.data.status}
                        </div>
                        <div className="text-sm text-muted-foreground">Account Status</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="details" className="mt-4 space-y-6">
                <Card className="border-muted">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      Timestamps
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4">
                      <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                        <div>
                          <span className="font-medium">Created At</span>
                          <p className="text-sm text-muted-foreground">When the user account was created</p>
                        </div>
                        <div className="text-right">
                          {user.data.created_at ? (
                            <>
                              <Badge variant="info" className="gap-1.5">
                                <Calendar className="h-3 w-3" />
                                {formatDistanceToNow(new Date(user.data.created_at), { addSuffix: true })}
                              </Badge>
                              <p className="text-xs text-muted-foreground mt-1">
                                {format(new Date(user.data.created_at), "PPP 'at' p")}
                              </p>
                            </>
                          ) : (
                            <Badge variant="muted">N/A</Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                        <div>
                          <span className="font-medium">Last Updated</span>
                          <p className="text-sm text-muted-foreground">When the user was last modified</p>
                        </div>
                        <div className="text-right">
                          {user.data.updated_at ? (
                            <>
                              <Badge variant="warning" className="gap-1.5">
                                <Clock className="h-3 w-3" />
                                {formatDistanceToNow(new Date(user.data.updated_at), { addSuffix: true })}
                              </Badge>
                              <p className="text-xs text-muted-foreground mt-1">
                                {format(new Date(user.data.updated_at), "PPP 'at' p")}
                              </p>
                            </>
                          ) : (
                            <Badge variant="muted">N/A</Badge>
                          )}
                        </div>
                      </div>

                      {user.data.deleted_at && (
                        <div className="flex justify-between items-center p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                          <div>
                            <span className="font-medium text-destructive">Deleted At</span>
                            <p className="text-sm text-muted-foreground">When the user was deleted</p>
                          </div>
                          <div className="text-right">
                            <Badge variant="destructive" className="gap-1.5">
                              <Trash2 className="h-3 w-3" />
                              {formatDistanceToNow(new Date(user.data.deleted_at), { addSuffix: true })}
                            </Badge>
                            <p className="text-xs text-muted-foreground mt-1">
                              {format(new Date(user.data.deleted_at), "PPP 'at' p")}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activity" className="mt-4 space-y-6">
                <Card className="border-muted">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Activity className="h-5 w-5 text-primary" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="font-medium">Account Status</p>
                          <p className="text-sm text-muted-foreground">
                            User is currently {user.data.status.toLowerCase()}
                          </p>
                        </div>
                        <Badge variant="outline">Current</Badge>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="font-medium">Role Assignment</p>
                          <p className="text-sm text-muted-foreground">User has {user.data.role} permissions</p>
                        </div>
                        <Badge variant="outline">Active</Badge>
                      </div>

                      {user.data.remember_token ? (
                        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                          <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                          <div className="flex-1">
                            <p className="font-medium">Online Status</p>
                            <p className="text-sm text-muted-foreground">User is currently online</p>
                          </div>
                          <Badge variant="success">Online</Badge>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                          <div className="h-2 w-2 bg-gray-500 rounded-full"></div>
                          <div className="flex-1">
                            <p className="font-medium">Offline Status</p>
                            <p className="text-sm text-muted-foreground">User is currently offline</p>
                          </div>
                          <Badge variant="muted">Offline</Badge>
                        </div>
                      )}

                      {isDeleted && (
                        <div className="flex items-center gap-3 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                          <div className="h-2 w-2 bg-red-500 rounded-full"></div>
                          <div className="flex-1">
                            <p className="font-medium text-destructive">Account Deleted</p>
                            <p className="text-sm text-muted-foreground">
                              User account was deleted{" "}
                              {user.data.deleted_at && formatDistanceToNow(new Date(user.data.deleted_at), { addSuffix: true })}
                            </p>
                          </div>
                          <Badge variant="destructive">Deleted</Badge>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </CardContent>
          </Tabs>

          <Separator />

          <div className="flex items-center justify-between p-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.visit(route("users.index"))}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Back to Users
            </Button>

            <div className="flex items-center gap-2">
              {isDeleted ? (
                <RestoreModal resourceName="user" id={user.data.id} />
              ) : (
                <>
                  <EditButton endpoint="user" id={String(user.data.id)} />
                  <DeleteModal resourceName="user" id={user.data.id} />
                </>
              )}
            </div>
          </div>
        </Card>
      </div>
    </AppLayout>
  )
}