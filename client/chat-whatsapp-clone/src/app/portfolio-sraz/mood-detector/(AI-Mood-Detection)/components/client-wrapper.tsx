'use client';

import React from 'react';
import ErrorBoundaryClient from './error-boundary';
import { BabyMoodDetectorComponent } from './baby-mood-detector';

export function ClientWrapper() {
  return (
    <ErrorBoundaryClient>
      <BabyMoodDetectorComponent />
    </ErrorBoundaryClient>
  );
} 