"use client";

import { Button } from "@/components/ui/button";
import { useLogout } from "@/hooks/useLogout";
import { useUser } from "reactfire";

export default function Home() {
  const user = useUser();
  const logout = useLogout();
  return (
    <div>
      {user.data?.displayName}
      <Button onClick={logout} className="ml-4" variant="outline">
        Logout
      </Button>
    </div>
  );
}
