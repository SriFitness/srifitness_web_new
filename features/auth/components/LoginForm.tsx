"use client"

//root/features/auth/components/LoginForm.tsx

import React from 'react'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/auth-provider'
import { useLoading } from '@/components/providers/LoadingContext'
import { useToast } from '@/hooks/use-toast'

const formSchema = z.object({
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    password: z.string().min(8, {
        message: "Password must be at least 8 characters.",
    }),
})

const LoginForm = () => {
    const router = useRouter()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const auth = useAuth();

    const { setIsLoading, setProgress } = useLoading()

    const { toast } = useToast();

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true)
        setProgress(0)

        try {
            // Simulate a delay for the loading bar
            for (let i = 0; i < 5; i++) {
                await new Promise(resolve => setTimeout(resolve, 200))
                setProgress((i + 1) * 20)
            }

            const response = await auth?.loginEmail({ email: values.email, password: values.password })

            if (response) {
                if (values.email.includes('admin')) {
                    router.push('/admin/dashboard');
                    setProgress(100)
                    toast({
                        title: "Login Successful",
                        description: "You have been successfully logged in.",
                        variant: "success",
                    })
                } else {
                    router.push('/'); // Assuming there's a user dashboard
                    setProgress(100)
                    toast({
                        title: "Login Successful",
                        description: "You have been successfully logged in.",
                        variant: "success",
                    })
                }
            } else {
                setProgress(100)
                toast({
                    title: "Login Failed",
                    description: "An error occurred during login.",
                    variant: "destructive",
                })
            }
            // Mock authentication logic

        } catch (error: any) {
            console.error("Login failed:", error);
            toast({
                title: "Login Failed",
                description: error.message || "An error occurred during login.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input type="email" placeholder="example@example.com" {...field} />
                            </FormControl>
                            <FormDescription>Enter your email address.</FormDescription>
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
                            <FormDescription>Enter your password.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full">Login</Button>
            </form>
        </Form>
    )
}

export default LoginForm

