
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

const colorOptions = [
  "#06b6d4", // teal
  "#0ea5e9", // sky
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#f97316", // orange
  "#22c55e", // green
  "#f43f5e", // rose
];

interface NewActivityDialogProps {
  onSave: (name: string, color: string) => void;
}

const NewActivityDialog = ({ onSave }: NewActivityDialogProps) => {
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState(colorOptions[0]);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Please enter an activity name",
        variant: "destructive",
      });
      return;
    }
    
    onSave(name, selectedColor);
    setName('');
    setSelectedColor(colorOptions[0]);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-teal-600 hover:bg-teal-700">
          Add New Activity
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Activity</DialogTitle>
            <DialogDescription>
              Create a new activity to track your habit
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="name" className="text-right text-sm font-medium">
                Name
              </label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Meditation"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right text-sm font-medium">
                Color
              </label>
              <div className="flex flex-wrap gap-2 col-span-3">
                {colorOptions.map((color) => (
                  <div
                    key={color}
                    className={`w-8 h-8 rounded-full cursor-pointer transition-transform ${
                      selectedColor === color ? 'ring-2 ring-offset-2 ring-teal-500 scale-110' : ''
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setSelectedColor(color)}
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" className="bg-teal-600 hover:bg-teal-700">Create Activity</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewActivityDialog;
