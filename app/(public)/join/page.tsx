import { redirect } from "next/navigation";

export default function JoinRedirectPage() {
  redirect("/register?mode=join");
}
