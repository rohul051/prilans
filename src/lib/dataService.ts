import { Project, User, Proposal, Notification, Review, PortfolioItem, ExperienceLevel, ApplicationStatus } from '@/types';
import { getFirebaseInstance } from './firebase';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc,
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy,
  where,
  onSnapshot
} from 'firebase/firestore';

export class DataService {
  // Check Firebase connection
  static isFirebaseConnected(): boolean {
    const { isConfigured, db } = getFirebaseInstance();
    return !!(isConfigured && db);
  }

  // REAL-TIME FIRESTORE SUBSCRIPTIONS
  static subscribeToProjects(callback: (projects: Project[]) => void): (() => void) | null {
    const { db, isConfigured } = getFirebaseInstance();
    if (!isConfigured || !db) return null;

    try {
      const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
      return onSnapshot(q, (snapshot) => {
        const loaded = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        } as Project));
        callback(loaded);
      }, (err) => {
        console.warn('Firestore projects subscription error:', err);
      });
    } catch (e) {
      console.warn('Could not set up projects listener:', e);
      return null;
    }
  }

  static subscribeToUsers(callback: (users: User[]) => void): (() => void) | null {
    const { db, isConfigured } = getFirebaseInstance();
    if (!isConfigured || !db) return null;

    try {
      return onSnapshot(collection(db, 'users'), (snapshot) => {
        const loaded = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        } as User));
        callback(loaded);
      }, (err) => {
        console.warn('Firestore users subscription error:', err);
      });
    } catch (e) {
      console.warn('Could not set up users listener:', e);
      return null;
    }
  }

  static subscribeToProposals(callback: (proposals: Proposal[]) => void): (() => void) | null {
    const { db, isConfigured } = getFirebaseInstance();
    if (!isConfigured || !db) return null;

    try {
      return onSnapshot(collection(db, 'proposals'), (snapshot) => {
        const loaded = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        } as Proposal));
        callback(loaded);
      }, (err) => {
        console.warn('Firestore proposals subscription error:', err);
      });
    } catch (e) {
      console.warn('Could not set up proposals listener:', e);
      return null;
    }
  }

  // USERS (Pure Firebase Firestore)
  static async getUsers(): Promise<User[]> {
    const { db, isConfigured } = getFirebaseInstance();
    if (isConfigured && db) {
      try {
        const snap = await getDocs(collection(db, 'users'));
        return snap.docs.map((d) => ({ ...d.data(), id: d.id } as User));
      } catch (err) {
        console.error('Firestore users fetch error:', err);
      }
    }
    return [];
  }

  static async getUserById(userId: string): Promise<User | null> {
    const { db, isConfigured } = getFirebaseInstance();
    if (isConfigured && db) {
      try {
        const snap = await getDoc(doc(db, 'users', userId));
        if (snap.exists()) {
          return { ...snap.data(), id: snap.id } as User;
        }
      } catch (err) {
        console.error('Firestore user fetch error:', err);
      }
    }
    return null;
  }

  static async updateUser(user: User): Promise<void> {
    const { db, isConfigured } = getFirebaseInstance();
    if (isConfigured && db) {
      await setDoc(doc(db, 'users', user.id), user, { merge: true });
    }
  }

  static async registerUser(newUser: User): Promise<User> {
    const { db, isConfigured } = getFirebaseInstance();
    if (isConfigured && db) {
      await setDoc(doc(db, 'users', newUser.id), newUser);
    }
    return newUser;
  }

  // PROJECTS (Pure Firebase Firestore)
  static async getProjects(): Promise<Project[]> {
    const { db, isConfigured } = getFirebaseInstance();
    if (isConfigured && db) {
      try {
        const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        return snap.docs.map((d) => ({ ...d.data(), id: d.id } as Project));
      } catch (err) {
        console.error('Firestore projects fetch error:', err);
      }
    }
    return [];
  }

  static async addProject(project: Project): Promise<void> {
    const { db, isConfigured } = getFirebaseInstance();
    if (isConfigured && db) {
      await setDoc(doc(db, 'projects', project.id), project);
    }
  }

  static async updateProject(project: Project): Promise<void> {
    const { db, isConfigured } = getFirebaseInstance();
    if (isConfigured && db) {
      await updateDoc(doc(db, 'projects', project.id), { ...project });
    }
  }

  static async deleteProject(projectId: string): Promise<void> {
    const { db, isConfigured } = getFirebaseInstance();
    if (isConfigured && db) {
      await deleteDoc(doc(db, 'projects', projectId));
    }
  }

  // PROPOSALS / APPLICATIONS (Pure Firebase Firestore)
  static async getProposals(): Promise<Proposal[]> {
    const { db, isConfigured } = getFirebaseInstance();
    if (isConfigured && db) {
      try {
        const snap = await getDocs(collection(db, 'proposals'));
        return snap.docs.map((d) => ({ ...d.data(), id: d.id } as Proposal));
      } catch (err) {
        console.error('Firestore proposals fetch error:', err);
      }
    }
    return [];
  }

  static async applyForProject(proposal: Proposal): Promise<void> {
    const { db, isConfigured } = getFirebaseInstance();
    if (!isConfigured || !db) return;

    await setDoc(doc(db, 'proposals', proposal.id), proposal);

    // Update proposal count in project document
    try {
      const projectRef = doc(db, 'projects', proposal.projectId);
      const projSnap = await getDoc(projectRef);
      if (projSnap.exists()) {
        const currentCount = projSnap.data()?.proposalsCount || 0;
        await updateDoc(projectRef, { proposalsCount: currentCount + 1 });
      }
    } catch (e) {
      console.warn('Could not update project proposals count:', e);
    }

    // Send notification to project owner
    try {
      await this.addNotification({
        id: `notif-${Date.now()}`,
        userId: proposal.projectId,
        title: 'New Project Proposal Received',
        message: `${proposal.studentName} applied for "${proposal.projectTitle}".`,
        read: false,
        createdAt: new Date().toISOString(),
        type: 'proposal',
      });
    } catch (e) {
      console.warn('Could not add proposal notification:', e);
    }
  }

  static async updateProposalStatus(
    proposalId: string, 
    status: ApplicationStatus, 
    clientFeedback?: string
  ): Promise<void> {
    const { db, isConfigured } = getFirebaseInstance();
    if (!isConfigured || !db) return;

    await updateDoc(doc(db, 'proposals', proposalId), {
      status,
      ...(clientFeedback ? { clientFeedback } : {}),
    });

    const statusTitles: Record<ApplicationStatus, string> = {
      pending: 'Proposal Pending',
      under_review: 'Application Under Review 🔍',
      shortlisted: 'You Got Shortlisted! ⭐',
      accepted: 'Proposal Accepted! 🎉',
      rejected: 'Application Status Update',
      completed: 'Project Marked Completed! 🏆',
    };

    try {
      const propSnap = await getDoc(doc(db, 'proposals', proposalId));
      if (propSnap.exists()) {
        const propData = propSnap.data() as Proposal;
        await this.addNotification({
          id: `notif-${Date.now()}`,
          userId: propData.studentId,
          title: statusTitles[status] || 'Application Status Update',
          message: `Your proposal for "${propData.projectTitle}" has been updated to "${status.replace('_', ' ').toUpperCase()}".`,
          read: false,
          createdAt: new Date().toISOString(),
          type: 'status_update',
        });
      }
    } catch (e) {
      console.warn('Notification error:', e);
    }
  }

  // RATINGS & REVIEWS
  static async submitReview(review: Review): Promise<void> {
    const { db, isConfigured } = getFirebaseInstance();
    if (!isConfigured || !db) return;

    const targetUserRef = doc(db, 'users', review.toUserId);
    const snap = await getDoc(targetUserRef);
    if (snap.exists()) {
      const targetUser = snap.data() as User;
      const existingReviews = targetUser.reviews || [];
      const updatedReviews = [review, ...existingReviews];
      const sumRatings = updatedReviews.reduce((acc, r) => acc + r.rating, 0);
      const avgRating = parseFloat((sumRatings / updatedReviews.length).toFixed(1));

      await updateDoc(targetUserRef, {
        reviews: updatedReviews,
        totalReviews: updatedReviews.length,
        avgRating,
      });
    }

    // Update proposal review flag
    try {
      const propRef = doc(db, 'proposals', review.projectId);
      if (review.fromUserRole === 'client') {
        await updateDoc(propRef, { clientReviewSubmitted: true });
      } else {
        await updateDoc(propRef, { studentReviewSubmitted: true });
      }
    } catch (e) {
      console.warn('Could not update proposal review flag:', e);
    }

    await this.addNotification({
      id: `notif-${Date.now()}`,
      userId: review.toUserId,
      title: 'New Rating & Review Received ⭐',
      message: `${review.fromUserName} left you a ${review.rating}-star review for "${review.projectTitle}".`,
      read: false,
      createdAt: new Date().toISOString(),
      type: 'review',
    });
  }

  // NOTIFICATIONS (Pure Firebase Firestore)
  static async getNotifications(userId: string): Promise<Notification[]> {
    const { db, isConfigured } = getFirebaseInstance();
    if (isConfigured && db) {
      try {
        const q = query(
          collection(db, 'notifications'), 
          where('userId', 'in', [userId, 'all']),
          orderBy('createdAt', 'desc')
        );
        const snap = await getDocs(q);
        return snap.docs.map((d) => ({ ...d.data(), id: d.id } as Notification));
      } catch (err) {
        // In case composite index isn't created yet, simple query
        try {
          const snap = await getDocs(collection(db, 'notifications'));
          return snap.docs
            .map((d) => ({ ...d.data(), id: d.id } as Notification))
            .filter((n) => n.userId === userId || n.userId === 'all');
        } catch (e) {
          console.error(e);
        }
      }
    }
    return [];
  }

  static async addNotification(notif: Notification): Promise<void> {
    const { db, isConfigured } = getFirebaseInstance();
    if (isConfigured && db) {
      await setDoc(doc(db, 'notifications', notif.id), notif);
    }
  }

  static async markNotificationRead(notifId: string): Promise<void> {
    const { db, isConfigured } = getFirebaseInstance();
    if (isConfigured && db) {
      await updateDoc(doc(db, 'notifications', notifId), { read: true });
    }
  }

  // MATCHING ALGORITHM (Advanced Feature 1)
  static calculateProjectMatch(studentSkills: string[], projectSkills: string[]): {
    score: number;
    matchedSkills: string[];
    missingSkills: string[];
  } {
    if (!projectSkills || projectSkills.length === 0) {
      return { score: 100, matchedSkills: [], missingSkills: [] };
    }

    const normalizedStudentSkills = (studentSkills || []).map((s) => s.toLowerCase().trim());
    const matched: string[] = [];
    const missing: string[] = [];

    projectSkills.forEach((reqSkill) => {
      const lowerReq = reqSkill.toLowerCase().trim();
      const hasMatch = normalizedStudentSkills.some(
        (stSkill) => stSkill.includes(lowerReq) || lowerReq.includes(stSkill)
      );
      if (hasMatch) {
        matched.push(reqSkill);
      } else {
        missing.push(reqSkill);
      }
    });

    const score = Math.round((matched.length / projectSkills.length) * 100);
    return { score, matchedSkills: matched, missingSkills: missing };
  }

  // BONUS CHALLENGE MATCHING ALGORITHM (5 marks)
  static getRecommendedStudentsForProject(project: Project, students: User[]): Array<{
    student: User;
    matchScore: number;
    matchedSkills: string[];
    missingSkills: string[];
    reasons: string[];
  }> {
    const studentList = students.filter((u) => u.role === 'student');

    const scoredStudents = studentList.map((student) => {
      const { score, matchedSkills, missingSkills } = this.calculateProjectMatch(
        student.skills || [],
        project.skillsRequired || []
      );

      let weightedScore = score * 0.7;
      const reasons: string[] = [];

      if (matchedSkills.length > 0) {
        reasons.push(`Matches ${matchedSkills.length}/${project.skillsRequired.length} skills (${matchedSkills.slice(0, 3).join(', ')})`);
      }

      const expLevels: ExperienceLevel[] = ['Entry Level', 'Intermediate', 'Expert'];
      const projIdx = expLevels.indexOf(project.experienceLevel);
      const studIdx = expLevels.indexOf(student.experienceLevel);

      if (studIdx >= projIdx) {
        weightedScore += 15;
        reasons.push(`Experience level matches requirement (${student.experienceLevel})`);
      } else {
        weightedScore += 5;
      }

      const ratingBonus = ((student.avgRating || 5.0) / 5) * 15;
      weightedScore += ratingBonus;
      if (student.avgRating >= 4.8) {
        reasons.push(`Rating: ${student.avgRating} ★`);
      }

      return {
        student,
        matchScore: Math.min(100, Math.round(weightedScore)),
        matchedSkills,
        missingSkills,
        reasons,
      };
    });

    return scoredStudents.sort((a, b) => b.matchScore - a.matchScore);
  }
}
