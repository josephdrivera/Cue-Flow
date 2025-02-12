'use client';

import React from 'react';
import { Play, Settings, Calendar, Clock, MoreVertical } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Show } from '@/types/show';

interface ShowHeaderProps {
  show: Show;
  onStart?: () => void;
  onSettings?: () => void;
  onDelete?: () => void;
}

const ShowHeader = ({ 
  show,
  onStart,
  onSettings,
  onDelete
}: ShowHeaderProps) => {
  const lastUpdated = formatDistanceToNow(new Date(show.updated_at), { addSuffix: true });

  return (
    <Card className="w-full mb-6">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-2xl font-bold">{show.name}</CardTitle>
          <CardDescription className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Last updated {lastUpdated}
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="default" 
            size="sm"
            className="flex items-center gap-2"
            onClick={onStart}
          >
            <Play className="h-4 w-4" />
            Start Show
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Show menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onSettings}>
                <Settings className="mr-2 h-4 w-4" />
                Show Settings
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={onDelete}
                className="text-destructive"
              >
                Delete Show
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Created {formatDistanceToNow(new Date(show.created_at), { addSuffix: true })}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShowHeader;