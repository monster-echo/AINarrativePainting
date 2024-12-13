"use client"
import { signIn, signOut, useSession } from "next-auth/react"

const Welcome = () => {
  const { data: session, status } = useSession()

  return (
    <div className="h-screen flex flex-col items-center justify-center gap-4 ">
      <h1 className="-mt-48">Welcome to the app!</h1>

      {/* session status */}
      {status && (
        <p className=" text-center bg-gray-50 p-4 rounded-md mx-4">
          {status === "loading" && "Loading..."}
          {status === "unauthenticated" && "Not authenticated"}
          {status === "authenticated" && "Authenticated"}
        </p>
      )}

      {!session && (
        <button
          className="bg-blue-500 hover:bg-blue-700 active:bg-blue-800 text-white font-bold py-2 px-4 rounded"
          onClick={() => {
            signIn("github")
          }}
        >
          Login
        </button>
      )}

      {session && (
        <>
          <p className=" text-center bg-gray-50 p-4 rounded-md mx-4">
            {JSON.stringify(session, null, 2)}
          </p>
          <button
            className="bg-red-500 hover:bg-red-700 active:bg-red-800 text-white font-bold py-2 px-4 rounded"
            onClick={() => {
              signOut()
            }}
          >
            Logout
          </button>
        </>
      )}
    </div>
  )
}

export default Welcome
