"use client";

import ScormCard from "@/components/ScormCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { collection, orderBy, query } from "firebase/firestore";
import Link from "next/link";
import { useFirestore, useFirestoreCollectionData } from "reactfire";
import { Scorm, WithId } from "../types/types";
import { scormConverter } from "@/lib/scormConverter";

export default function Home() {
  const firestore = useFirestore();

  const { data } = useFirestoreCollectionData<WithId<Scorm>>(
    query(
      collection(firestore, "scorms").withConverter(scormConverter),
      orderBy("createdAt", "desc")
    ),
    { idField: "id", suspense: true }
  );

  if (!data) return null;
  return (
    <div className="container mx-auto grid grid-cols-4 pt-10 pb-10 gap-5">
      <Card className="bg-primary">
        <CardContent className="h-full">
          <div className="flex flex-col items-center justify-center h-full gap-5">
            <h1 className="text-xl text-center text-primary-foreground">
              Upload scorm file
            </h1>

            <Link href={"/upload"}>
              <Button className="cursor-pointer" variant={"outline"}>
                + Upload
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
      {data.map((doc) => (
        <ScormCard key={doc.id} scorm={doc} />
      ))}
    </div>
  );
}
