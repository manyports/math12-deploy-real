import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

export function Skeleton() {
  return (
    <Card className="h-full border-blue-600 border-opacity-50">
      <CardHeader>
        <div className="h-6 bg-blue-200 rounded w-3/4"></div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center">
          <div className="w-4 h-4 mr-2 bg-blue-200 rounded-full"></div>
          <div className="h-4 bg-blue-200 rounded w-1/2"></div>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 mr-2 bg-blue-200 rounded-full"></div>
          <div className="h-4 bg-blue-200 rounded w-1/3"></div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="h-9 bg-blue-200 rounded w-full"></div>
      </CardFooter>
    </Card>
  );
}
