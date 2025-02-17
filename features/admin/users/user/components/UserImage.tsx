import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

export function UserImage() {
  return (
    <Card className="futuristic-card">
      <CardContent className="flex items-center justify-center p-6">
        <div className="relative w-48 h-48 rounded-full overflow-hidden futuristic-glow">
          <Image
            src="/placeholder.svg"
            alt="User profile"
            layout="fill"
            objectFit="cover"
          />
        </div>
      </CardContent>
    </Card>
  );
}
