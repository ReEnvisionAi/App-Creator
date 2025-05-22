import { LoginForm } from "@/components/ui/auth"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            ReEnvision AI
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Transform your ideas into fully functional applications with AI
          </p>
        </div>

        <LoginForm />
      </div>
    </div>
  )
}