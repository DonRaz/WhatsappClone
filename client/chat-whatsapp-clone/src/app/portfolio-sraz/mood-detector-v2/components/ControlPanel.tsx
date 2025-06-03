"use client";

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Settings, 
  Hand, 
  Timer, 
  Smile, 
  Heart, 
  Moon, 
  Zap, 
  Meh,
  PlayCircle
} from 'lucide-react';
import { ControlPanelProps, MOOD_OPTIONS } from '../types';

export default function ControlPanel({ 
  detectionInterval, 
  onIntervalChange, 
  onManualMoodSelect,
  onPlayRandomSong 
}: ControlPanelProps) {
  return (
    <Card className="h-full bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-200">
      <CardContent className="p-4 md:p-6 h-full">
        <div className="h-full flex flex-col space-y-4 md:space-y-6">
          {/* Header */}
          <div className="flex items-center gap-2 text-gray-800">
            <Settings className="w-4 h-4 md:w-5 md:h-5 text-orange-600" />
            <h3 className="font-semibold text-sm md:text-base">Controls</h3>
          </div>

          {/* Detection Interval */}
          <div className="space-y-2 md:space-y-3">
            <div className="flex items-center gap-2 text-xs md:text-sm font-medium text-gray-700">
              <Timer className="w-3 h-3 md:w-4 md:h-4 text-orange-500" />
              Detection Interval
            </div>
            <Select 
              value={detectionInterval.toString()} 
              onValueChange={(value: string) => onIntervalChange(parseInt(value))}
            >
              <SelectTrigger className="bg-white/80 border-orange-200 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">Every 3 seconds</SelectItem>
                <SelectItem value="5">Every 5 seconds</SelectItem>
                <SelectItem value="10">Every 10 seconds</SelectItem>
                <SelectItem value="30">Every 30 seconds</SelectItem>
                <SelectItem value="60">Every minute</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Manual Mood Selection */}
          <div className="flex-1 space-y-2 md:space-y-3">
            <div className="flex items-center gap-2 text-xs md:text-sm font-medium text-gray-700">
              <Hand className="w-3 h-3 md:w-4 md:h-4 text-orange-500" />
              Manual Mood Override
            </div>
            <div className="grid grid-cols-2 gap-2">
              {MOOD_OPTIONS.map((mood) => {
                return (
                  <Button
                    key={mood.value}
                    onClick={() => onManualMoodSelect(mood.value)}
                    variant="outline"
                    className="h-auto p-2 md:p-3 flex flex-col items-center gap-1 md:gap-2 bg-white/80 border-orange-200 hover:bg-orange-50 text-xs"
                  >
                    <span className="text-sm md:text-lg">{mood.emoji}</span>
                    <span className="text-xs font-medium">{mood.label}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-2 md:space-y-3">
            <div className="text-xs md:text-sm font-medium text-gray-700">Quick Actions</div>
            <Button 
              onClick={onPlayRandomSong}
              className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white text-xs md:text-sm"
            >
              <PlayCircle className="w-3 h-3 md:w-4 md:h-4 mr-2" />
              Play Random Song
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 