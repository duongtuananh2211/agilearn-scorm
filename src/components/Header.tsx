import Image from "next/image";
import { useUser } from "reactfire";
import { useLogout } from "@/hooks/useLogout";
import { Button } from "@/components/ui/button";
import Avatar from "@/components/ui/Avatar";

export default function Header() {
  const { data: user } = useUser();
  const logout = useLogout();

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between px-8 py-3 bg-background border-b shadow-sm">
      <div className="flex items-center gap-2">
        {/* <Image src="/globe.svg" alt="Logo" width={36} height={36} />
        <span className="font-bold text-lg text-primary">Agilearn</span> */}

        <img
          src={"/Agilearn-logo.png"}
          alt="Agilearn"
          className="max-w-[80px] md:max-w-[150px]"
        />
      </div>
      <div className="flex items-center gap-4">
        {user && (
          <>
            {user.photoURL && (
              <div>
                <Avatar src={user.photoURL} alt="User Avatar" size={32} />
              </div>
            )}
            <span className="font-medium text-primary hidden md:block">
              {user.displayName || user.email}
            </span>
            <Button variant="outline" onClick={logout}>
              Logout
            </Button>
          </>
        )}
      </div>
    </header>
  );
}
