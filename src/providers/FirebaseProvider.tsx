"use client";

import { getAuth } from "firebase/auth";
import { PropsWithChildren, useMemo } from "react";
import { AuthProvider, FirebaseAppProvider, useFirebaseApp } from "reactfire";

const FirebaseServicesProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const firebaseApp = useFirebaseApp();

  const auth = useMemo(() => getAuth(firebaseApp), [firebaseApp]);

  return (
    <>
      <AuthProvider sdk={auth}>{children}</AuthProvider>
    </>
  );
};

export const FirebaseProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const firebaseConfig = useMemo(
    () => ({
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
    }),
    []
  );

  return (
    <>
      <FirebaseAppProvider firebaseConfig={firebaseConfig}>
        <FirebaseServicesProvider>{children}</FirebaseServicesProvider>
      </FirebaseAppProvider>
    </>
  );
};
