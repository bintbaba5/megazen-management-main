import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button"; // Assuming you're using shadcn/ui Button

interface NavButtonProps {
  icon: React.ElementType;
  label: string;
  route: string;
  color: string; // Add a color prop
}

export function NavButton({ icon: Icon, label, route, color }: NavButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    if (route === "#") return; // Do nothing if no route is provided
    setIsLoading(true);
    setTimeout(() => {
      router.push(route).then(() => setIsLoading(false));
    }, 500); // Optional: Add a small delay to show the animation
  };

  return (
    <button
      // variant="outline"
      className={`flex flex-col items-center justify-center border   transition-all transform hover:scale-105 h-40 sm:h-40 md:h-48 lg:h-56 w-full p-2 relative shadow-md `} // Apply the color
      onClick={handleClick}
      disabled={isLoading || route === "#"}
    >
      {isLoading ? (
        <Loader2 className="h-6 w-6 mb-2 animate-spin " />
      ) : (
        <>
          <div
            className={`p-4 rounded-full border-2 border-${color}-500 hover:bg-${color}-500 text-${color}-500 hover:text-white `}
          >
            <Icon className="h-8 w-8 md:h-20 md:w-20 mb-2 " color={color} />
          </div>
          <span className={`text-sm mt-4`}>{label}</span>
        </>
      )}
    </button>
  );
}
