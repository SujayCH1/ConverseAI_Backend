import { SignIn, SignUp } from '@clerk/clerk-react'

export function SignInPage() {
  return <div className="h-screen flex justify-center items-center"><SignIn routing="path" path="/sign-in" /></div>
}

export function SignUpPage() {
  return <div className="h-screen flex justify-center items-center"><SignUp routing="path" path="/sign-up" /></div>
}
