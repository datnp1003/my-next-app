import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"

export default async function ProtectedPage() {
  const session = await getServerSession()
  
  if (!session) {
    redirect('/login')
  }

  return (
    <div>
      <h1>Protected Page</h1>
      <p>Welcome {session.user?.email}</p>
    </div>
  )
}
