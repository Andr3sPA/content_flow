import { Signup1 } from "@/components/signup1";
import { CardContent, CardDescription,Card,CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function SignUpPage() {
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardContent>
          <Signup1/>
        </CardContent>
      </Card>
    </div>

  );
}