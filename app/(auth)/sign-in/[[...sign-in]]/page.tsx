import LoginForm from "@/features/auth/components/LoginForm";
import { Card, CardContent, CardDescription, CardHeader} from "@/components/ui/card";
import Image from "next/image"; // Import next/image for optimized images

export default async function LoginPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-background">

            <Card className="w-full max-w-md">
                <CardHeader>
                    <div className="flex flex-row items-center justify-center pt-2 pb-2">
                        <Image src="/logo.png" alt="Company Logo" width={120} height={120} priority />
                    </div>
                    <CardDescription className="text-center">Enter your credentials to access your account</CardDescription>
                </CardHeader>
                <CardContent>
                    <LoginForm />
                </CardContent>
            </Card>
        </div>
    );
}
