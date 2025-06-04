import type React from "react"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import {
  LoaderCircle,
  Eye,
  EyeOff,
  ChevronLeft,
  Save,
  User,
  Mail,
  Lock,
  Shield,
  Activity,
  AlertTriangle,
  Calendar,
  Clock,
} from "lucide-react"
import { router, useForm, usePage } from "@inertiajs/react"
import type { BreadcrumbItem, SharedData, User as UserType } from "@/types"
import { formatDistanceToNow, format } from "date-fns"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/elements/button"
import Separator from "@/components/elements/separator"
import Label from "@/components/elements/label"
import Input from "@/components/elements/input"
import AppLayout from "@/components/layouts/app-layout"
import InputError from "@/components/elements/input-error"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { InfoIcon } from "lucide-react"
import Card from "@/components/fragments/card/card"
import CardHeader from "@/components/fragments/card/card-header"
import CardTitle from "@/components/fragments/card/card-title"
import CardDescription from "@/components/fragments/card/card-description"
import CardContent from "@/components/fragments/card/card-content"
import CardFooter from "@/components/fragments/card/card-footer"

export default function UsersEdit() {
  const { user, success, error } = usePage<SharedData & { user: { data: UserType } }>().props

  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("basic")

  const { data, setData, put, processing, errors, reset } = useForm({
    email: user.data.email || "",
    username: user.data.username || "",
    password: "",
    role: user.data.role || "",
    status: user.data.status || "ACTIVE",
    avatar: user.data.avatar || "",
  })

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: "Users",
      href: route("users.index"),
    },
    {
      title: "Edit",
      href: route("users.edit", user.data.id),
    },
  ]

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    put(route("users.update", user.data.id), {
      onSuccess: () => {
        toast.success("User updated successfully")
        reset("password")
      },
      onError: (errors) => {
        console.error(errors)
        toast.error("Failed to update user")

        // Switch to the tab that contains errors
        if (errors.email || errors.username || errors.avatar) {
          setActiveTab("basic")
        } else if (errors.password) {
          setActiveTab("security")
        } else if (errors.role || errors.status) {
          setActiveTab("permissions")
        }
      },
      onFinish: () => {
        setIsSubmitting(false)
      },
    })
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

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
          <Badge variant="purple" className="ml-2">
            Admin
          </Badge>
        )
      case "CLIENT":
        return (
          <Badge variant="cyan" className="ml-2">
            Client
          </Badge>
        )
      case "COURIER":
        return (
          <Badge variant="orange" className="ml-2">
            Courier
          </Badge>
        )
      default:
        return null
    }
  }

  // Helper function to render status badge
  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case "ACTIVE":
        return (
          <Badge variant="success" className="ml-2">
            Active
          </Badge>
        )
      case "INACTIVE":
        return (
          <Badge variant="inactive" className="ml-2">
            Inactive
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="container py-8 px-4">
        <Card className="border shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <Save className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-2xl">Edit User</CardTitle>
                <CardDescription className="mt-1">
                  Update user information, roles, and permissions for {user.data.username}
                </CardDescription>
              </div>
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 border-2 border-border">
                  <AvatarImage src={user.data.avatar || "/placeholder.svg"} alt={user.data.username} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                    {getInitials(user.data.username)}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </CardHeader>

          {/* User Info Summary */}
          <div className="px-6 py-4 bg-muted/20 border-b">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Created:</span>
                <span className="font-medium">
                  {user.data.created_at
                    ? format(new Date(user.data.created_at), "d MMMM yyyy")
                    : "N/A"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Updated:</span>
                <span className="font-medium">
                  {user.data.updated_at
                    ? formatDistanceToNow(new Date(user.data.updated_at), { addSuffix: true })
                    : "N/A"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Current Role:</span>
                {getRoleBadge(user.data.role)}
              </div>
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Status:</span>
                {getStatusBadge(user.data.status)}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="px-6 pt-6">
                <TabsList className="grid grid-cols-3 w-full max-w-md">
                  <TabsTrigger value="basic" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>Basic Info</span>
                  </TabsTrigger>
                  <TabsTrigger value="security" className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    <span>Security</span>
                  </TabsTrigger>
                  <TabsTrigger value="permissions" className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    <span>Permissions</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              <CardContent className="p-6">
                <TabsContent value="basic" className="mt-4 space-y-6">
                  <Alert
                    variant="default"
                    className="bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950 dark:text-blue-200 dark:border-blue-900"
                  >
                    <InfoIcon className="h-4 w-4" />
                    <AlertTitle>Basic Information</AlertTitle>
                    <AlertDescription>
                      Update the user's basic information like username, email address, and avatar.
                    </AlertDescription>
                  </Alert>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="username" className="font-medium flex items-center">
                        <User className="h-4 w-4 mr-2 text-muted-foreground" />
                        Username <span className="text-destructive ml-1">*</span>
                      </Label>
                      <Input
                        id="username"
                        name="username"
                        type="text"
                        placeholder="Enter username"
                        value={data.username}
                        onChange={(e) => setData("username", e.target.value)}
                        aria-invalid={errors.username ? "true" : "false"}
                        aria-describedby={errors.username ? "username-error" : undefined}
                        className="max-w-md"
                        required
                      />
                      {errors.username && <InputError id="username-error" message={errors.username} />}
                      <p className="text-xs text-muted-foreground">
                        Username must be unique and will be used for login
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="font-medium flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                        Email <span className="text-destructive ml-1">*</span>
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter email address"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        aria-invalid={errors.email ? "true" : "false"}
                        aria-describedby={errors.email ? "email-error" : undefined}
                        className="max-w-md"
                        required
                      />
                      {errors.email && <InputError id="email-error" message={errors.email} />}
                      <p className="text-xs text-muted-foreground">
                        Email will be used for notifications and password recovery
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="avatar" className="font-medium flex items-center">
                        <User className="h-4 w-4 mr-2 text-muted-foreground" />
                        Avatar URL <span className="text-muted-foreground">(optional)</span>
                      </Label>
                      <Input
                        id="avatar"
                        name="avatar"
                        type="text"
                        placeholder="https://example.com/avatar.jpg"
                        value={data.avatar}
                        onChange={(e) => setData("avatar", e.target.value)}
                        aria-invalid={errors.avatar ? "true" : "false"}
                        aria-describedby={errors.avatar ? "avatar-error" : undefined}
                        className="max-w-md"
                      />
                      {errors.avatar && <InputError id="avatar-error" message={errors.avatar} />}
                      <p className="text-xs text-muted-foreground">Leave empty to use default avatar</p>
                    </div>

                    <div className="space-y-2">
                      <Label className="font-medium flex items-center">
                        <InfoIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                        User ID
                      </Label>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-mono">
                          #{user.data.id}
                        </Badge>
                        <span className="text-xs text-muted-foreground">Internal user identifier</span>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="security" className="mt-4 space-y-6">
                  <Alert
                    variant="default"
                    className="bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950 dark:text-amber-200 dark:border-amber-900"
                  >
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Password Update</AlertTitle>
                    <AlertDescription>
                      Leave the password field empty to keep the current password. Only enter a new password if you want
                      to change it.
                    </AlertDescription>
                  </Alert>

                  <div className="grid gap-6 md:grid-cols-1 max-w-md">
                    <div className="space-y-2">
                      <Label htmlFor="password" className="font-medium flex items-center">
                        <Lock className="h-4 w-4 mr-2 text-muted-foreground" />
                        New Password <span className="text-muted-foreground">(optional)</span>
                      </Label>
                      <div className="relative">
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Leave blank to keep current password"
                          value={data.password}
                          onChange={(e) => setData("password", e.target.value)}
                          aria-invalid={errors.password ? "true" : "false"}
                          aria-describedby={errors.password ? "password-error" : undefined}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 -translate-y-1/2"
                          onClick={togglePasswordVisibility}
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                      {errors.password && <InputError id="password-error" message={errors.password} />}
                      <p className="text-xs text-muted-foreground">
                        Only fill this field if you want to change the user's password
                      </p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="permissions" className="mt-4 space-y-6">
                  <Alert
                    variant="default"
                    className="bg-purple-50 text-purple-800 border-purple-200 dark:bg-purple-950 dark:text-purple-200 dark:border-purple-900"
                  >
                    <Shield className="h-4 w-4" />
                    <AlertTitle>Roles & Permissions</AlertTitle>
                    <AlertDescription>
                      Update the user's role and status to control their access and permissions in the system.
                    </AlertDescription>
                  </Alert>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="role" className="font-medium flex items-center">
                        <Shield className="h-4 w-4 mr-2 text-muted-foreground" />
                        Role <span className="text-destructive ml-1">*</span>
                      </Label>
                      <Select value={data.role} onValueChange={(value) => setData("role", value)} name="role" required>
                        <SelectTrigger id="role" aria-invalid={errors.role ? "true" : "false"} className="max-w-md">
                          <SelectValue placeholder="Select a role" />
                          {data.role && getRoleBadge(data.role)}
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Roles</SelectLabel>
                            <SelectItem value="ADMIN" className="flex items-center">
                              <div className="flex items-center">
                                <Shield className="h-4 w-4 mr-2 text-purple-500" />
                                Admin
                                <Badge variant="purple" className="ml-2">
                                  Full Access
                                </Badge>
                              </div>
                            </SelectItem>
                            <SelectItem value="CLIENT">
                              <div className="flex items-center">
                                <User className="h-4 w-4 mr-2 text-cyan-500" />
                                Client
                                <Badge variant="cyan" className="ml-2">
                                  Limited Access
                                </Badge>
                              </div>
                            </SelectItem>
                            <SelectItem value="COURIER">
                              <div className="flex items-center">
                                <Activity className="h-4 w-4 mr-2 text-orange-500" />
                                Courier
                                <Badge variant="orange" className="ml-2">
                                  Delivery Access
                                </Badge>
                              </div>
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      {errors.role && <InputError id="role-error" message={errors.role} />}
                      <p className="text-xs text-muted-foreground">
                        Current role: <strong>{user.data.role}</strong>
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="status" className="font-medium flex items-center">
                        <Activity className="h-4 w-4 mr-2 text-muted-foreground" />
                        Status <span className="text-destructive ml-1">*</span>
                      </Label>
                      <Select value={data.status} onValueChange={(value) => setData("status", value)} name="status">
                        <SelectTrigger id="status" aria-invalid={errors.status ? "true" : "false"} className="max-w-md">
                          <SelectValue placeholder="Select a status" />
                          {data.status && getStatusBadge(data.status)}
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Status</SelectLabel>
                            <SelectItem value="ACTIVE">
                              <div className="flex items-center">
                                <Activity className="h-4 w-4 mr-2 text-green-500" />
                                Active
                                <Badge variant="success" className="ml-2">
                                  Can Login
                                </Badge>
                              </div>
                            </SelectItem>
                            <SelectItem value="INACTIVE">
                              <div className="flex items-center">
                                <Activity className="h-4 w-4 mr-2 text-gray-500" />
                                Inactive
                                <Badge variant="inactive" className="ml-2">
                                  Cannot Login
                                </Badge>
                              </div>
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      {errors.status && <InputError id="status-error" message={errors.status} />}
                      <p className="text-xs text-muted-foreground">
                        Current status: <strong>{user.data.status}</strong>
                      </p>
                    </div>
                  </div>

                  {user.data.deleted_at && (
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>Deleted User</AlertTitle>
                      <AlertDescription>
                        This user was deleted on{" "}
                        {formatDistanceToNow(new Date(user.data.deleted_at), { addSuffix: true })}. Contact an
                        administrator to restore this user.
                      </AlertDescription>
                    </Alert>
                  )}
                </TabsContent>
              </CardContent>
            </Tabs>

            <Separator />

            <CardFooter className="flex items-center justify-between p-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.visit(route("users.index"))}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Back to Users
              </Button>

              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setData({
                      email: user.data.email || "",
                      username: user.data.username || "",
                      password: "",
                      role: user.data.role || "",
                      status: user.data.status || "ACTIVE",
                      avatar: user.data.avatar || "",
                    })
                  }}
                  disabled={processing || isSubmitting}
                >
                  Reset Changes
                </Button>

                <Button type="submit" disabled={processing || isSubmitting} className="min-w-[140px]">
                  {processing || isSubmitting ? (
                    <>
                      <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </AppLayout>
  )
}
