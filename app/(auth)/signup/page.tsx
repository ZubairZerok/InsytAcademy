import { AuthForm } from "@/components/auth/auth-form";
import { GlassCard } from "@/components/ui/glass-card";

export default function SignupPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-agri-black px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] bg-repeat opacity-20 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -ml-[40rem] -mt-[20rem] w-[80rem] h-[40rem] bg-neon-green/5 blur-3xl rounded-full pointer-events-none" />

            <GlassCard className="w-full max-w-md p-8 z-10">
                <AuthForm view="signup" />
            </GlassCard>
        </div>
    );
}
