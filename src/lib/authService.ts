import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  type User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getFirebaseInstance } from './firebase';
import { User, ExperienceLevel } from '@/types';

export interface StudentSignUpData {
  email: string;
  password: string;
  name: string;
  university: string;
  major: string;
  hourlyRate: number;
  skills: string[];
  experienceLevel: ExperienceLevel;
  bio?: string;
  location?: string;
}

export interface ClientSignUpData {
  email: string;
  password: string;
  name: string;
  country: string;
  bio?: string;
}

export class AuthService {
  // Register a new Student
  static async registerStudent(data: StudentSignUpData): Promise<User> {
    const { auth, db } = getFirebaseInstance();
    if (!auth || !db) {
      throw new Error('Firebase Auth is not connected. Please verify your configuration.');
    }

    const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
    const fbUser = userCredential.user;

    await updateProfile(fbUser, { displayName: data.name });

    const newUser: User = {
      id: fbUser.uid,
      name: data.name,
      email: data.email,
      role: 'student',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(data.name)}`,
      university: data.university || '',
      major: data.major || '',
      bio: data.bio || '',
      hourlyRate: data.hourlyRate || 15,
      skills: data.skills || [],
      experienceLevel: data.experienceLevel || 'Entry Level',
      location: data.location || '',
      verified: false,
      avgRating: 0,
      totalReviews: 0,
      portfolio: [],
      reviews: [],
    };

    // Save to Firestore
    await setDoc(doc(db, 'users', fbUser.uid), newUser);
    return newUser;
  }

  // Register a new Client / Employer
  static async registerClient(data: ClientSignUpData): Promise<User> {
    const { auth, db } = getFirebaseInstance();
    if (!auth || !db) {
      throw new Error('Firebase Auth is not connected. Please verify your configuration.');
    }

    const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
    const fbUser = userCredential.user;

    await updateProfile(fbUser, { displayName: data.name });

    const newUser: User = {
      id: fbUser.uid,
      name: data.name,
      email: data.email,
      role: 'client',
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(data.name)}`,
      bio: data.bio || '',
      skills: [],
      experienceLevel: 'Intermediate',
      location: data.country || '',
      verified: false,
      avgRating: 0,
      totalReviews: 0,
      portfolio: [],
      reviews: [],
      hiredCount: 0,
    };

    // Save to Firestore
    await setDoc(doc(db, 'users', fbUser.uid), newUser);
    return newUser;
  }

  // Sign In with Email & Password
  static async login(email: string, password: string): Promise<User> {
    const { auth, db } = getFirebaseInstance();
    if (!auth || !db) {
      throw new Error('Firebase Auth is not connected.');
    }

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const fbUser = userCredential.user;

    // Fetch user document from Firestore
    const userDoc = await getDoc(doc(db, 'users', fbUser.uid));
    if (userDoc.exists()) {
      return userDoc.data() as User;
    }

    // Fallback if profile document doesn't exist yet
    const fallbackUser: User = {
      id: fbUser.uid,
      name: fbUser.displayName || email.split('@')[0],
      email: fbUser.email || email,
      role: 'student',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`,
      university: '',
      major: '',
      bio: '',
      hourlyRate: 15,
      skills: [],
      experienceLevel: 'Entry Level',
      location: '',
      verified: false,
      avgRating: 0,
      totalReviews: 0,
      portfolio: [],
      reviews: [],
    };
    await setDoc(doc(db, 'users', fbUser.uid), fallbackUser);
    return fallbackUser;
  }

  // Sign Out
  static async logout(): Promise<void> {
    const { auth } = getFirebaseInstance();
    if (auth) {
      await signOut(auth);
    }
  }

  // Listen to Auth State Changes
  static onAuthState(callback: (user: FirebaseUser | null) => void): (() => void) | null {
    const { auth } = getFirebaseInstance();
    if (!auth) return null;
    return onAuthStateChanged(auth, callback);
  }
}

