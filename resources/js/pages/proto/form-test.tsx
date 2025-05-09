"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Inertia } from "@inertiajs/inertia"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/fragments/form"
import Input from "@/components/elements/input"
import { Button } from "@/components/elements/button"
import Checkbox from "@/components/elements/checkbox"

// Skema validasi dengan Zod
const formSchema = z
  .object({
    name: z.string().min(2, {
      message: "Nama minimal 2 karakter.",
    }),
    email: z.string().email({
      message: "Email tidak valid.",
    }),
    password: z.string().min(8, {
      message: "Password minimal 8 karakter.",
    }),
    password_confirmation: z.string().min(8, {
      message: "Konfirmasi password minimal 8 karakter.",
    }),
    terms: z.boolean().refine((val) => val === true, {
      message: "Anda harus menyetujui syarat dan ketentuan.",
    }),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Password tidak cocok.",
    path: ["password_confirmation"],
  })

export default function RegisterForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
      terms: false,
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    Inertia.post("/register", values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Lengkap</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="********" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password_confirmation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Konfirmasi Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="********" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="terms"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Syarat dan Ketentuan</FormLabel>
                <FormDescription>Saya menyetujui syarat dan ketentuan yang berlaku.</FormDescription>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Daftar
        </Button>
      </form>
    </Form>
  );
};