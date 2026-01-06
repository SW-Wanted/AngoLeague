import { db, auth } from "./firebase";
import {
  collection,
  getDocs,
  addDoc,
  setDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { Match, MatchType, RecruitmentPost, Position, User } from "../types";

export async function getProvinces(): Promise<string[]> {
  const snap = await getDocs(collection(db, "provinces"));
  const names = snap.docs
    .map((d) => (d.data() as any).name)
    .filter(Boolean) as string[];
  return names.length ? names.sort() : [];
}

export async function getMatches(): Promise<Match[]> {
  const snap = await getDocs(collection(db, "matches"));
  return snap.docs.map((d) => {
    const data = d.data() as any;
    const match: Match = {
      id: d.id,
      type: (data.type as MatchType) ?? MatchType.FRIENDLY,
      teamA: data.teamA ?? "Provisória A",
      teamB: data.teamB ?? "Provisória B",
      date: data.date ?? "",
      location: data.location ?? "",
      status: data.status ?? "SCHEDULED",
    };
    return match;
  });
}

export async function getRecruitmentPosts(): Promise<RecruitmentPost[]> {
  const snap = await getDocs(collection(db, "recruitmentPosts"));
  return snap.docs.map((d) => {
    const data = d.data() as any;
    const posValue = data.positionNeeded as string;
    const positionNeeded = (Object.values(Position) as string[]).includes(
      posValue
    )
      ? (posValue as Position)
      : Position.MID;
    const post: RecruitmentPost = {
      id: d.id,
      teamId: data.teamId ?? "unknown",
      teamName: data.teamName ?? "Equipa",
      positionNeeded,
      description: data.description ?? "",
      date: data.date ?? "",
    };
    return post;
  });
}

export async function createUserProfile(
  profile: Partial<User>
): Promise<string> {
  const currentUid = auth.currentUser?.uid;
  const currentEmail = auth.currentUser?.email ?? "";
  const data = {
    ...profile,
    email: profile.email ?? currentEmail,
    createdAt: new Date().toISOString(),
  };
  if (currentUid) {
    await setDoc(doc(db, "users", currentUid), { id: currentUid, ...data });
    return currentUid;
  }
  const ref = await addDoc(collection(db, "users"), data);
  return ref.id;
}

export async function getUserProfile(uid: string): Promise<User | null> {
  try {
    const ref = doc(db, "users", uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    const data = snap.data() as any;
    const user: User = {
      id: uid,
      name: data.name ?? "",
      email: data.email ?? "",
      modality: data.modality ?? "Futsal",
      position: data.position ?? "MID",
      province: data.province ?? "",
      municipality: data.municipality ?? "",
      avatar: data.avatar ?? undefined,
    };
    return user;
  } catch (e) {
    return null;
  }
}
