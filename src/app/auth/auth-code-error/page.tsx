import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AuthCodeError() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md bg-card">
        <CardHeader>
          <CardTitle>Authentication Error</CardTitle>
          <CardDescription>
            There was an issue verifying your authentication code. This might happen if the link has expired or was already used.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <p>Please try signing in again.</p>
          <Button asChild>
            <Link href="/">Go to Login</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
