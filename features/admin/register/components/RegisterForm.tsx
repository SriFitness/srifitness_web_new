"use client"

import React, { useState } from 'react'
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
import { useAuth } from '@/components/auth-provider'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'
import { toast } from "@/hooks/use-toast"

const formSchema = z.object({
    firstName: z.string().min(2, { message: "First name must be at least 2 characters." }),
    lastName: z.string().min(2, { message: "Last name must be at least 2 characters." }),
    email: z.string().email({ message: "Please enter a valid email address." }),
    phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, { message: "Please enter a valid phone number." }),
    password: z.string().min(8, { message: "Password must be at least 8 characters." }),
    confirmPassword: z.string().min(8, { message: "Password must be at least 8 characters." }),
    city: z.string().nonempty({ message: "Please select a city." }),
    membershipPlan: z.string().nonempty({ message: "Please select a membership plan." }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

const membershipPlans = [
    { value: "basic", label: "Basic Plan" },
    { value: "premium", label: "Premium Plan" },
    { value: "pro", label: "Pro Plan" },
];

const RegisterForm = () => {
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            password: "",
            confirmPassword: "",
            city: "",
            membershipPlan: "",
        },
    })

    const auth = useAuth();

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!isEmailVerified) {
            toast({
                title: "Email not verified",
                description: "Please verify your email before submitting the form.",
                variant: "destructive",
            });
            return;
        }

        try {
            await auth?.createUser({
                email: values.email,
                password: values.password,
                firstName: values.firstName,
                lastName: values.lastName,
                phoneNumber: values.phoneNumber,
                city: values.city,
                membershipPlan: values.membershipPlan,
            });
            toast({
                title: "Registration successful",
                description: "Your account has been created.",
            });
            // Handle successful user creation (e.g., redirect to login page)
        } catch (error: any) {
            console.error("User creation failed", error);
            toast({
                title: "Registration failed",
                description: error.message || "An error occurred during registration.",
                variant: "destructive",
            });
        }
    }

    const verifyEmail = async () => {
        const email = form.getValues("email");
        if (!email) {
            toast({
                title: "Email required",
                description: "Please enter an email address to verify.",
                variant: "destructive",
            });
            return;
        }

        // Here you would typically call an API to verify the email
        // For this example, we'll just simulate a delay and always succeed
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            setIsEmailVerified(true);
            toast({
                title: "Email verified",
                description: "The email address has been verified.",
            });
        } catch (error) {
            toast({
                title: "Verification failed",
                description: "Unable to verify the email address.",
                variant: "destructive",
            });
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className='sm:inline md:flex lg:flex gap-4'>
                    <div className="flex-1">
                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (

                                <FormItem>
                                    <FormLabel>First Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="John" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="flex-1">
                        <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Last Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Doe" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>


                </div>
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <div className="flex space-x-2">
                                <FormControl>
                                    <Input type="email" placeholder="example@example.com" {...field} />
                                </FormControl>
                                <Button type="button" onClick={verifyEmail} disabled={isEmailVerified}>
                                    {isEmailVerified ? "Verified" : "Verify Email"}
                                </Button>
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                                <Input type="tel" placeholder="+1234567890" {...field} />
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
                                <Input type="password" placeholder="Enter password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="Re-enter password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Select City</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a city" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Cities</SelectLabel>
                                        <SelectItem value="kurunegala">Kurunegala</SelectItem>
                                        <SelectItem value="wariyapola">Wariyapola</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="membershipPlan"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Membership Plan</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a membership plan" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Membership Plans</SelectLabel>
                                        {membershipPlans.map((plan) => (
                                            <SelectItem key={plan.value} value={plan.value}>
                                                {plan.label}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <br />
                <div className="pt-4">
                    <Button type="submit" disabled={!isEmailVerified}>Register</Button>
                </div>
            </form>
        </Form>
    )
}

export default RegisterForm

