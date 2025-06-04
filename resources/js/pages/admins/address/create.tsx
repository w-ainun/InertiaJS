import type { BreadcrumbItem, Contact, SharedData } from "@/types"
import { useForm, usePage } from "@inertiajs/react"
import {
  Building,
  ChevronLeft,
  Globe,
  Home,
  Info,
  LoaderCircle,
  Mail,
  MapPin,
  Navigation,
  Plus,
  Search,
  User,
  Users,
} from "lucide-react"
import type React from "react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/elements/button"
import Input from "@/components/elements/input"
import InputError from "@/components/elements/input-error"
import Label from "@/components/elements/label"
import Separator from "@/components/elements/separator"
import Card from "@/components/fragments/card/card"
import CardContent from "@/components/fragments/card/card-content"
import CardDescription from "@/components/fragments/card/card-description"
import CardHeader from "@/components/fragments/card/card-header"
import CardTitle from "@/components/fragments/card/card-title"
import AppLayout from "@/components/layouts/app-layout"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Combobox } from "@/components/ui/combobox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

export default function AddressesCreate() {
  const { contacts, success, error } = usePage<SharedData & { contacts: { data: Contact[] } }>().props
  console.log(contacts)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("contact")

  const { data, setData, post, processing, errors, reset } = useForm({
    contact_id: 0,
    street: "",
    more: "",
    city: "",
    province: "",
    country: "Indonesia",
    post_code: "",
  })

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: "Addresses",
      href: route("address.index"),
    },
    {
      title: "Create",
      href: route("address.create"),
    },
  ]

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    post(route("address.store"), {
      onSuccess: () => {
        toast.success("Address created successfully")
        reset("contact_id", "street", "more", "city", "province", "country", "post_code")
      },
      onError: (errors) => {
        console.error(errors)
        toast.error("Failed to create address")

        // Switch to the tab that contains errors
        if (errors.contact_id) {
          setActiveTab("contact")
        } else if (errors.street || errors.more) {
          setActiveTab("street")
        } else if (errors.city || errors.province || errors.country || errors.post_code) {
          setActiveTab("location")
        }
      },
      onFinish: () => {
        setIsSubmitting(false)
      },
    })
  }

  useEffect(() => {
    if (success) toast.success(success as string)
    if (error) toast.error(error as string)
  }, [success, error])

  // Helper function to get initials
  const getInitials = (name: string): string => {
    if (!name) return "NC"
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  // Helper function to format phone number
  const formatPhoneNumber = (phone: string): string => {
    if (phone.startsWith("08")) {
      const cleaned = phone.replace(/\D/g, "")
      if (cleaned.length >= 10) {
        return `+62 ${cleaned.substring(1, 4)}-${cleaned.substring(4, 8)}-${cleaned.substring(8)}`
      }
    }
    return phone
  }

  // Extract contacts from the contacts data (fixed the main issue here)
  const availableContacts = contacts?.data || []

  // Prepare contact options for combobox
  const contactOptions = availableContacts.map((contact) => ({
    value: String(contact.id),
    label: contact.name,
    description: `${formatPhoneNumber(contact.phone)} • ${contact.user?.username || "No owner"}`,
    avatar: contact.profile ? contact.profile : undefined,
  }))

  console.log(contactOptions)

  // Get selected contact info
  const selectedContact = availableContacts.find((contact) => String(contact.id) === String(data.contact_id))

  // Indonesian provinces for autocomplete
  const indonesianProvinces = [
    "Aceh",
    "Sumatera Utara",
    "Sumatera Barat",
    "Riau",
    "Kepulauan Riau",
    "Jambi",
    "Sumatera Selatan",
    "Bangka Belitung",
    "Bengkulu",
    "Lampung",
    "DKI Jakarta",
    "Jawa Barat",
    "Jawa Tengah",
    "DI Yogyakarta",
    "Jawa Timur",
    "Banten",
    "Bali",
    "Nusa Tenggara Barat",
    "Nusa Tenggara Timur",
    "Kalimantan Barat",
    "Kalimantan Tengah",
    "Kalimantan Selatan",
    "Kalimantan Timur",
    "Kalimantan Utara",
    "Sulawesi Utara",
    "Sulawesi Tengah",
    "Sulawesi Selatan",
    "Sulawesi Tenggara",
    "Gorontalo",
    "Sulawesi Barat",
    "Maluku",
    "Maluku Utara",
    "Papua",
    "Papua Barat",
    "Papua Selatan",
    "Papua Tengah",
    "Papua Pegunungan",
    "Papua Barat Daya",
  ]

  // Common countries
  const countries = [
    "Indonesia",
    "Malaysia",
    "Singapore",
    "Thailand",
    "Philippines",
    "Vietnam",
    "Brunei",
    "Myanmar",
    "Cambodia",
    "Laos",
    "United States",
    "United Kingdom",
    "Australia",
    "Japan",
    "South Korea",
    "China",
    "India",
    "Germany",
    "France",
    "Netherlands",
  ]

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="container px-4 py-8">
        <Card className="border shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 rounded-full p-2">
                <MapPin className="text-primary h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-2xl">Create New Address</CardTitle>
                <CardDescription className="mt-1">
                  Add a new address for a contact with complete location information
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          {/* Selected Contact Preview */}
          {selectedContact && (
            <div className="bg-muted/20 border-b px-6 py-4">
              <div className="flex items-center gap-4">
                <Avatar className="border-border h-12 w-12 border-2">
                  <AvatarImage src={selectedContact.profile || "/placeholder.svg"} alt={selectedContact.name} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 font-semibold text-white">
                    {getInitials(selectedContact.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{selectedContact.name}</h3>
                    <Badge variant={selectedContact.gender === "MAN" ? "default" : "secondary"}>
                      {selectedContact.gender === "MAN" ? "Male" : "Female"}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-sm">{formatPhoneNumber(selectedContact.phone)}</p>
                  {selectedContact.user && (
                    <p className="text-muted-foreground text-xs">
                      Owner: {selectedContact.user.username} ({selectedContact.user.role})
                    </p>
                  )}
                </div>
                <Badge variant="outline">Creating address for this contact</Badge>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="px-6 pt-6">
                <TabsList className="grid w-full max-w-md grid-cols-3">
                  <TabsTrigger value="contact" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>Contact</span>
                  </TabsTrigger>
                  <TabsTrigger value="street" className="flex items-center gap-2">
                    <Home className="h-4 w-4" />
                    <span>Street</span>
                  </TabsTrigger>
                  <TabsTrigger value="location" className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    <span>Location</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              <CardContent className="p-6">
                <TabsContent value="contact" className="mt-4 space-y-6">
                  <Alert
                    variant="default"
                    className="border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-200"
                  >
                    <Users className="h-4 w-4" />
                    <AlertTitle>Contact Selection</AlertTitle>
                    <AlertDescription>
                      Select the contact for whom you want to create this address. You can search by name, phone, or
                      owner information.
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="contact_id" className="flex items-center font-medium">
                        <User className="text-muted-foreground mr-2 h-4 w-4" />
                        Select Contact <span className="text-destructive ml-1">*</span>
                      </Label>
                      {contactOptions.length > 0 ? (
                        <Combobox
                          options={contactOptions}
                          value={String(data.contact_id)}
                          onValueChange={(value) => setData("contact_id", Number(value))}
                          placeholder="Search and select a contact..."
                          searchPlaceholder="Search contacts by name, phone, or owner..."
                          emptyText="No contacts found."
                          className="max-w-md"
                        />
                      ) : (
                        <div className="text-muted-foreground rounded-md border p-4 text-sm">
                          No contacts available. Please create contacts first before adding addresses.
                        </div>
                      )}
                      {errors.contact_id && <InputError id="contact_id-error" message={errors.contact_id} />}
                      <p className="text-muted-foreground text-xs">
                        Select the contact who will be associated with this address
                      </p>
                    </div>

                    {selectedContact && (
                      <Card className="border-muted bg-muted/30">
                        <CardHeader className="pb-3">
                          <CardTitle className="flex items-center gap-2 text-lg">
                            <Info className="text-primary h-5 w-5" />
                            Selected Contact Information
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="grid gap-3 md:grid-cols-2">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Name:</span>
                              <span className="font-medium">{selectedContact.name}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Phone:</span>
                              <span className="font-mono font-medium">{formatPhoneNumber(selectedContact.phone)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Gender:</span>
                              <Badge variant={selectedContact.gender === "MAN" ? "default" : "secondary"}>
                                {selectedContact.gender === "MAN" ? "Male" : "Female"}
                              </Badge>
                            </div>
                            {selectedContact.user && (
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Owner:</span>
                                <span className="font-medium">{selectedContact.user.username}</span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="street" className="mt-4 space-y-6">
                  <Alert
                    variant="default"
                    className="border-green-200 bg-green-50 text-green-800 dark:border-green-900 dark:bg-green-950 dark:text-green-200"
                  >
                    <Home className="h-4 w-4" />
                    <AlertTitle>Street Address Information</AlertTitle>
                    <AlertDescription>
                      Enter the detailed street address including house number, street name, and any additional
                      information like RT/RW, building name, or landmarks.
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="street" className="flex items-center font-medium">
                        <Home className="text-muted-foreground mr-2 h-4 w-4" />
                        Street Address <span className="text-destructive ml-1">*</span>
                      </Label>
                      <Input
                        id="street"
                        name="street"
                        type="text"
                        placeholder="e.g., Jl. Merdeka No. 123"
                        value={data.street}
                        onChange={(e) => setData("street", e.target.value)}
                        aria-invalid={errors.street ? "true" : "false"}
                        aria-describedby={errors.street ? "street-error" : undefined}
                        required
                      />
                      {errors.street && <InputError id="street-error" message={errors.street} />}
                      <p className="text-muted-foreground text-xs">
                        Enter the complete street address including house/building number
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="more" className="flex items-center font-medium">
                        <Navigation className="text-muted-foreground mr-2 h-4 w-4" />
                        Additional Information <span className="text-muted-foreground">(optional)</span>
                      </Label>
                      <Textarea
                        id="more"
                        name="more"
                        placeholder="e.g., RT 01/RW 02, Komplek ABC, Dekat Masjid Al-Ikhlas"
                        value={data.more}
                        onChange={(e) => setData("more", e.target.value)}
                        aria-invalid={errors.more ? "true" : "false"}
                        aria-describedby={errors.more ? "more-error" : undefined}
                        rows={3}
                      />
                      {errors.more && <InputError id="more-error" message={errors.more} />}
                      <p className="text-muted-foreground text-xs">
                        Additional details like RT/RW, complex name, landmarks, or special instructions
                      </p>
                    </div>

                    {/* Address Preview */}
                    {(data.street || data.more) && (
                      <Card className="border-muted bg-muted/30">
                        <CardHeader className="pb-3">
                          <CardTitle className="flex items-center gap-2 text-sm">
                            <Navigation className="text-primary h-4 w-4" />
                            Street Address Preview
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-sm">
                            {data.street && <p className="font-medium">{data.street}</p>}
                            {data.more && <p className="text-muted-foreground mt-1">{data.more}</p>}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="location" className="mt-4 space-y-6">
                  <Alert
                    variant="default"
                    className="border-purple-200 bg-purple-50 text-purple-800 dark:border-purple-900 dark:bg-purple-950 dark:text-purple-200"
                  >
                    <Globe className="h-4 w-4" />
                    <AlertTitle>Location Details</AlertTitle>
                    <AlertDescription>
                      Specify the city, province, country, and postal code for this address. This information is used
                      for mapping and delivery purposes.
                    </AlertDescription>
                  </Alert>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="city" className="flex items-center font-medium">
                        <Building className="text-muted-foreground mr-2 h-4 w-4" />
                        City <span className="text-destructive ml-1">*</span>
                      </Label>
                      <Input
                        id="city"
                        name="city"
                        type="text"
                        placeholder="e.g., Jakarta, Surabaya, Bandung"
                        value={data.city}
                        onChange={(e) => setData("city", e.target.value)}
                        aria-invalid={errors.city ? "true" : "false"}
                        aria-describedby={errors.city ? "city-error" : undefined}
                        required
                      />
                      {errors.city && <InputError id="city-error" message={errors.city} />}
                      <p className="text-muted-foreground text-xs">Enter the city or regency name</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="province" className="flex items-center font-medium">
                        <MapPin className="text-muted-foreground mr-2 h-4 w-4" />
                        Province <span className="text-destructive ml-1">*</span>
                      </Label>
                      <Input
                        id="province"
                        name="province"
                        type="text"
                        placeholder="e.g., Jawa Timur, DKI Jakarta"
                        value={data.province}
                        onChange={(e) => setData("province", e.target.value)}
                        aria-invalid={errors.province ? "true" : "false"}
                        aria-describedby={errors.province ? "province-error" : undefined}
                        list="provinces"
                        required
                      />
                      <datalist id="provinces">
                        {indonesianProvinces.map((province) => (
                          <option key={province} value={province} />
                        ))}
                      </datalist>
                      {errors.province && <InputError id="province-error" message={errors.province} />}
                      <p className="text-muted-foreground text-xs">Select or type the province name</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="country" className="flex items-center font-medium">
                        <Globe className="text-muted-foreground mr-2 h-4 w-4" />
                        Country <span className="text-destructive ml-1">*</span>
                      </Label>
                      <Input
                        id="country"
                        name="country"
                        type="text"
                        placeholder="e.g., Indonesia"
                        value={data.country}
                        onChange={(e) => setData("country", e.target.value)}
                        aria-invalid={errors.country ? "true" : "false"}
                        aria-describedby={errors.country ? "country-error" : undefined}
                        list="countries"
                        required
                      />
                      <datalist id="countries">
                        {countries.map((country) => (
                          <option key={country} value={country} />
                        ))}
                      </datalist>
                      {errors.country && <InputError id="country-error" message={errors.country} />}
                      <p className="text-muted-foreground text-xs">Select or type the country name</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="post_code" className="flex items-center font-medium">
                        <Mail className="text-muted-foreground mr-2 h-4 w-4" />
                        Postal Code <span className="text-destructive ml-1">*</span>
                      </Label>
                      <Input
                        id="post_code"
                        name="post_code"
                        type="text"
                        placeholder="e.g., 12345"
                        value={data.post_code}
                        onChange={(e) => setData("post_code", e.target.value)}
                        aria-invalid={errors.post_code ? "true" : "false"}
                        aria-describedby={errors.post_code ? "post_code-error" : undefined}
                        className="font-mono"
                        required
                      />
                      {errors.post_code && <InputError id="post_code-error" message={errors.post_code} />}
                      <p className="text-muted-foreground text-xs">Enter the 5-digit postal code</p>
                    </div>
                  </div>

                  {/* Complete Address Preview */}
                  {(data.street || data.city || data.province || data.country) && (
                    <Card className="border-muted bg-muted/30">
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-sm">
                          <Navigation className="text-primary h-4 w-4" />
                          Complete Address Preview
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-1 text-sm">
                          <p className="font-medium">
                            {[data.street, data.more, data.city, data.province, data.country, data.post_code]
                              .filter(Boolean)
                              .join(", ")}
                          </p>
                          {data.street && data.city && data.country && (
                            <Button variant="link" size="sm" className="h-auto p-0 text-xs" asChild>
                              <a
                                href={`https://maps.google.com/?q=${encodeURIComponent(
                                  [data.street, data.more, data.city, data.province, data.country]
                                    .filter(Boolean)
                                    .join(", "),
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1"
                              >
                                <Search className="h-3 w-3" />
                                Preview on Google Maps
                              </a>
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              </CardContent>
            </Tabs>

            <Separator />

            <div className="flex items-center justify-between p-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => window.history.back()}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Back to Addresses
              </Button>

              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    reset("contact_id", "street", "more", "city", "province", "country", "post_code")
                  }}
                  disabled={processing || isSubmitting}
                >
                  Reset Form
                </Button>

                <Button type="submit" disabled={processing || isSubmitting} className="min-w-[140px]">
                  {processing || isSubmitting ? (
                    <>
                      <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Address
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </Card>
      </div>
    </AppLayout>
  )
}
