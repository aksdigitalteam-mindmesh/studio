import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import Image from "next/image";

const recipes = [
  {
    title: "Avocado Toast",
    category: "Breakfast",
    image: "https://placehold.co/600x400.png",
    hint: "avocado toast",
  },
  {
    title: "Chicken Salad",
    category: "Lunch",
    image: "https://placehold.co/600x400.png",
    hint: "chicken salad",
  },
  {
    title: "Salmon and Veggies",
    category: "Dinner",
    image: "https://placehold.co/600x400.png",
    hint: "salmon vegetables",
  },
    {
    title: "Protein Smoothie",
    category: "Snack",
    image: "https://placehold.co/600x400.png",
    hint: "protein smoothie",
  },
];

export default function RecipesPage() {
  return (
    <div className="space-y-8 p-4 md:p-8 pb-24">
      <div>
        <h1 className="text-3xl font-bold font-headline md:text-4xl">Healthy Recipes</h1>
        <p className="text-muted-foreground">Find delicious and healthy meals.</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input placeholder="Search for recipes..." className="pl-10" />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {recipes.map((recipe) => (
          <Card key={recipe.title} className="overflow-hidden">
            <CardHeader className="p-0">
              <Image src={recipe.image} alt={recipe.title} width={600} height={400} className="w-full h-48 object-cover" data-ai-hint={recipe.hint} />
            </CardHeader>
            <CardContent className="p-4">
              <p className="text-sm font-semibold text-primary">{recipe.category}</p>
              <CardTitle className="mt-1 text-lg">{recipe.title}</CardTitle>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
