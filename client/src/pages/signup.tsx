
import SignupForm from "@/components/SignupForm";

export default function SignupPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Student Sign Up</h1>
      <SignupForm />
      <p className="text-center mt-4">
        Are you a student with tech skills? <a href="/helper-signup" className="text-blue-500 hover:underline">Sign up as a Helper</a>
      </p>
    </div>
  );
}
