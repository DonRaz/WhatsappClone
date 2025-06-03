"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Smile, Heart, Moon, Zap, Meh } from 'lucide-react';
import { format } from 'date-fns';

const moodIcons = {
  happy: { icon: Smile, color: 'text-yellow-500', bg: 'bg-yellow-50' },
  sad: { icon: Heart, color: 'text-blue-500', bg: 'bg-blue-50' },
  sleepy: { icon: Moon, color: 'text-purple-500', bg: 'bg-purple-50' },
  angry: { icon: Zap, color: 'text-red-500', bg: 'bg-red-50' },
  neutral: { icon: Meh, color: 'text-gray-500', bg: 'bg-gray-50' }
};

export default function MoodHistory({ moodDetections = [] }) {
  return (
    <Card className="h-full bg-gradient-to-br from-green-50 to-teal-50 border-green-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-gray-800 text-sm md:text-base">
          <Clock className="w-4 h-4 md:w-5 md:h-5 text-teal-600" />
          Mood History
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 md:px-6">
        <div className="space-y-3 max-h-64 md:max-h-80 lg:max-h-96 overflow-y-auto">
          {moodDetections.length === 0 ? (
            <div className="text-center py-6 md:py-8">
              <div className="w-12 h-12 md:w-16 md:h-16 mx-auto bg-teal-100 rounded-full flex items-center justify-center mb-3">
                <Smile className="w-6 h-6 md:w-8 md:h-8 text-teal-500" />
              </div>
              <p className="text-sm md:text-base text-gray-600">No mood detections yet</p>
              <p className="text-xs md:text-sm text-gray-500 mt-1">Start detecting to see history</p>
            </div>
          ) : (
            moodDetections.map((detection) => {
              const MoodIcon = moodIcons[detection.detected_mood]?.icon || Smile;
              const iconColor = moodIcons[detection.detected_mood]?.color || 'text-gray-500';
              const bgColor = moodIcons[detection.detected_mood]?.bg || 'bg-gray-50';
              
              return (
                <div 
                  key={detection.id}
                  className={`${bgColor} rounded-xl md:rounded-2xl p-3 md:p-4 border border-white/50 shadow-sm hover:shadow-md transition-shadow`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2 md:gap-3">
                      {detection.face_image_url ? (
                        <img 
                          src={detection.face_image_url}
                          alt="Baby face"
                          className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover border-2 border-white shadow-sm"
                        />
                      ) : (
                        <div className={`w-8 h-8 md:w-10 md:h-10 ${bgColor} rounded-full flex items-center justify-center border-2 border-white shadow-sm`}>
                          <MoodIcon className={`w-4 h-4 md:w-5 md:h-5 ${iconColor}`} />
                        </div>
                      )}
                      
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-xs md:text-sm text-gray-800 capitalize">
                            {detection.detected_mood}
                          </span>
                          <Badge 
                            variant="secondary" 
                            className="text-xs bg-white/70"
                          >
                            {Math.round(detection.confidence_score * 100)}%
                          </Badge>
                        </div>
                        
                        <p className="text-xs text-gray-600">
                          {format(new Date(detection.created_date), 'h:mm a')}
                        </p>
                        
                        {detection.song_played && (
                          <p className="text-xs text-gray-500 max-w-32 md:max-w-40 truncate">
                            ♪ {detection.song_played}
                          </p>
                        )}
                      </div>
                    </div>

                    <Badge 
                      variant={detection.detection_method === 'manual' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {detection.detection_method === 'manual' ? 'M' : 'A'}
                    </Badge>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}