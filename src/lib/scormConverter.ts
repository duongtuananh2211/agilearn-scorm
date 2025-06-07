import {
  FirestoreDataConverter,
  Timestamp,
  DocumentData,
} from "firebase/firestore";
import { Scorm, WithId } from "@/app/types/types";

export const scormConverter: FirestoreDataConverter<WithId<Scorm>> = {
  toFirestore(scorm: WithId<Scorm>): DocumentData {
    // Remove 'id' before saving to Firestore
    const data = Object.assign({}, scorm);

    return {
      ...data,
      createdAt:
        data.createdAt instanceof Date
          ? Timestamp.fromDate(data.createdAt)
          : data.createdAt,
    };
  },
  fromFirestore(snapshot, options): WithId<Scorm> {
    const data = snapshot.data(options);
    return {
      ...data,
      createdAt: data.createdAt?.toDate
        ? data.createdAt.toDate()
        : data.createdAt,
      id: snapshot.id,
    } as WithId<Scorm>;
  },
};
