'use client';

import { signOut, useSession } from "next-auth/react";
import Image from "next/image";

export default function Home() {
  const { data: session } = useSession();
  console.log(session)
  return (
    <div>
      <button onClick={() => signOut({ callbackUrl: "/" })}>logout</button>
    </div>
  );
}
