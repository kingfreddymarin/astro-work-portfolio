// Shared types across portfolio and dashboard

export interface Lead {
  id?: string;
  name: string;
  email: string;
  company?: string;
  service?: string;
  package?: string;
  message: string;
  specialRequest?: boolean;
  specialEvidence?: string;
  source?: string;
  userAgent?: string;
  pageUrl?: string;
  createdAt?: { seconds: number; nanoseconds: number };
  userId?: string | null;
}

export interface BuildConfig {
  id?: string;
  userId: string;
  goalId: string;
  featureIds: string[];
  scaleId: string;
  timelineId: string;
  qualityId: string;
  name: string;
  createdAt?: { seconds: number; nanoseconds: number };
  updatedAt?: { seconds: number; nanoseconds: number };
}

export interface SharedBuild extends Omit<BuildConfig, 'userId'> {
  userId?: string | null;
}

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  isAdmin?: boolean;
}

export interface SignInResult {
  user: User;
  token: string;
}

export interface Task {
  id?: string;
  userId: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'done';
  priority?: 'low' | 'medium' | 'high';
  createdAt?: { seconds: number; nanoseconds: number };
  updatedAt?: { seconds: number; nanoseconds: number };
}
