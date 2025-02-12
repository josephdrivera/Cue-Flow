'use client';

import { useState } from 'react';
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MoreVertical, Edit, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Cue } from '@/types/cue';
import { cn } from '@/lib/utils';

export default function CueRow({ cue }: { cue: Cue }) {
  const [isEditing, setIsEditing] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-red-500/10 text-red-500';
      case 'active':
        return 'bg-green-500/10 text-green-500';
      case 'standby':
        return 'bg-yellow-500/10 text-yellow-500';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleDelete = async () => {
    // TODO: Implement delete functionality
    console.log('Delete cue:', cue.id);
  };

  if (isEditing) {
    // TODO: Implement inline editing
    return null;
  }

  return (
    <TableRow>
      <TableCell className="font-medium">{cue.cue_number}</TableCell>
      <TableCell>{cue.start_time}</TableCell>
      <TableCell>{cue.run_time}</TableCell>
      <TableCell>{cue.end_time}</TableCell>
      <TableCell>{cue.activity}</TableCell>
      <TableCell>{cue.graphics}</TableCell>
      <TableCell>{cue.video}</TableCell>
      <TableCell>{cue.audio}</TableCell>
      <TableCell>{cue.lighting}</TableCell>
      <TableCell>
        <span className={cn(
          'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
          getStatusColor(cue.status)
        )}>
          {cue.status}
        </span>
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleEdit}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Cue
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={handleDelete}
              className="text-destructive"
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete Cue
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}