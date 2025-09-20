
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Trash2, PlusCircle, Sparkles, XCircle } from "lucide-react";
import { getShoppingList, addIngredientsToShoppingList, updateShoppingListItem, deleteShoppingListItem, clearCheckedItems } from "@/lib/shopping-list-actions";
import { cn } from "@/lib/utils";

type ShoppingListItem = {
  id: string;
  name: string;
  checked: boolean;
};

export default function ShoppingListPage() {
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([]);
  const [newItemName, setNewItemName] = useState("");

  useEffect(() => {
    setShoppingList(getShoppingList());
  }, []);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItemName.trim()) {
      addIngredientsToShoppingList([newItemName.trim()]);
      setShoppingList(getShoppingList()); // Refresh list
      setNewItemName("");
    }
  };

  const handleToggleItem = (item: ShoppingListItem) => {
    const updatedItem = { ...item, checked: !item.checked };
    updateShoppingListItem(updatedItem);
    setShoppingList(getShoppingList()); // Refresh list
  };

  const handleDeleteItem = (itemId: string) => {
    deleteShoppingListItem(itemId);
    setShoppingList(getShoppingList()); // Refresh list
  };
  
  const handleClearChecked = () => {
    clearCheckedItems();
    setShoppingList(getShoppingList()); // Refresh list
  };

  const checkedCount = shoppingList.filter(item => item.checked).length;
  const totalCount = shoppingList.length;

  return (
    <div className="space-y-8 p-4 md:p-8 pb-24">
      <div>
        <h1 className="text-3xl font-bold font-headline md:text-4xl">Shopping List</h1>
        <p className="text-muted-foreground">Your ingredients for healthy meals.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add an Item</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddItem} className="flex flex-col gap-4 sm:flex-row">
            <Input
              placeholder="e.g., Chicken breast"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              className="flex-grow"
            />
            <Button type="submit" className="w-full sm:w-auto">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
                <CardTitle>Your List</CardTitle>
                <CardDescription>
                    {checkedCount} of {totalCount} items checked.
                </CardDescription>
            </div>
            {checkedCount > 0 && (
                 <Button onClick={handleClearChecked} variant="outline" className="mt-4 sm:mt-0">
                    <XCircle className="mr-2 h-4 w-4"/>
                    Clear Checked Items
                </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
            {shoppingList.length > 0 ? (
                <ul className="space-y-4">
                    {shoppingList.map(item => (
                        <li key={item.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                            <div className="flex items-center gap-4">
                                <Checkbox
                                    id={`item-${item.id}`}
                                    checked={item.checked}
                                    onCheckedChange={() => handleToggleItem(item)}
                                    className="h-6 w-6"
                                />
                                <label
                                    htmlFor={`item-${item.id}`}
                                    className={cn(
                                        "font-medium transition-colors",
                                        item.checked && "text-muted-foreground line-through"
                                    )}
                                >
                                    {item.name}
                                </label>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteItem(item.id)}>
                                <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive"/>
                            </Button>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg">
                    <Sparkles className="h-10 w-10 text-muted-foreground mb-4"/>
                    <p className="font-semibold">Your shopping list is empty!</p>
                    <p className="text-muted-foreground">Generate a diet plan to automatically add ingredients.</p>
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
