"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { 
    User, Shield, CreditCard, Calendar, CheckCircle, XCircle,
    FileText, Award, Check, Loader2, Save, ArrowUpRight,
    MessageSquare, Plus, Clock, Filter, Info
} from "lucide-react";
import { updateSettings, type UserSettings } from "@/actions/settings";
import { cn } from "@/lib/utils";
import { type UserActivity } from "@/actions/activity";
import { createClient } from "@/lib/supabase/client";

/** Safely extract up to 2 initials from a name string. */
function getInitials(name: string | null | undefined): string {
    if (!name || !name.trim()) return "A";
    return name
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .map((word) => word[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "A";
}

interface ProfileDetailsProps {
    initialData: {
        id: string;
        email: string;
        full_name: string | null;
        role: string;
        avatar_url: string | null;
        settings: UserSettings;
    };
    activityLog?: UserActivity[];
    transactions?: {
        id: string;
        amount: number;
        currency: string;
        gateway: string;
        trx_id: string;
        status: string;
        created_at: string;
        courses?: {
            title: string;
        } | null;
    }[];
}

type ActivityFilter = "all" | "post" | "comment" | "upvote";

export function ProfileDetails({ initialData, activityLog = [], transactions = [] }: ProfileDetailsProps) {
    const [fullName, setFullName] = useState(initialData.full_name || "");
    const [avatarUrl, setAvatarUrl] = useState(initialData.avatar_url || "");
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
    const [activityFilter, setActivityFilter] = useState<ActivityFilter>("all");

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];

        // Validate size (2MB limit)
        if (file.size > 2 * 1024 * 1024) {
            setMessage({ text: "File size exceeds 2MB limit.", type: "error" });
            return;
        }

        // Validate type
        if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) {
            setMessage({ text: "Invalid file type. JPEG, PNG, GIF, WebP only.", type: "error" });
            return;
        }

        setUploading(true);
        setMessage(null);

        try {
            const supabase = createClient();
            const fileExt = file.name.split('.').pop();
            const filePath = `${initialData.id}/avatar-${Date.now()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file, { upsert: true });

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            // Update user profile record
            const { error: updateError } = await supabase
                .from('profiles')
                .update({ avatar_url: publicUrl })
                .eq('id', initialData.id);

            if (updateError) throw updateError;

            setAvatarUrl(publicUrl);
            setMessage({ text: "Avatar updated successfully.", type: "success" });
        } catch (err) {
            const message = err instanceof Error ? err.message : "Failed to upload avatar.";
            console.error("Avatar upload error:", err);
            setMessage({ text: message, type: "error" });
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async () => {
        setLoading(true);
        setMessage(null);
        try {
            const res = await updateSettings(fullName, initialData.settings);
            if (res.error) {
                setMessage({ text: "Failed to update codename.", type: "error" });
            } else {
                setMessage({ text: "Agent credentials updated successfully.", type: "success" });
            }
        } catch {
            setMessage({ text: "Network latency error. Sync aborted.", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    // Format purchases dynamically from real Supabase transaction records
    const formatGateway = (gw: string) => {
        if (gw === "BKASH") return "bKash";
        if (gw === "NAGAD") return "Nagad";
        if (gw === "CARD_SSLCOMMERZ") return "SSLCommerz";
        if (gw === "FREE" || !gw) return "Free";
        return gw; // Show raw gateway name for unknown types
    };

    const getStatusInfo = (status: string) => {
        if (status === "SUCCESS") return { label: "Active", color: "text-neon-green bg-neon-green/10 border-neon-green/20" };
        if (status === "PENDING") return { label: "Pending", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" };
        if (status === "FAILED") return { label: "Failed", color: "text-red-400 bg-red-500/10 border-red-500/20" };
        if (status === "REFUNDED") return { label: "Refunded", color: "text-sky-400 bg-sky-500/10 border-sky-500/20" };
        return { label: status, color: "text-gray-400 bg-white/5 border-white/10" };
    };

    const purchases = transactions.map((t) => ({
        id: t.id,
        course: t.courses?.title || "Specialized Syllabus Access",
        date: new Date(t.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        amount: `${t.currency} ${Number(t.amount).toLocaleString()}`,
        gateway: formatGateway(t.gateway),
        txnId: t.trx_id,
        status: t.status,
        statusInfo: getStatusInfo(t.status),
    }));

    // Format billing history dynamically from payment receipts
    const billingHistory = transactions.map((t) => ({
        period: new Date(t.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" }),
        amount: `${t.currency} ${Number(t.amount).toLocaleString()}`,
        method: t.gateway === "BKASH" ? "bKash" : t.gateway === "NAGAD" ? "Nagad" : "SSLCommerz",
        status: t.status === "SUCCESS" ? "Paid" : "Pending"
    }));

    // Activity filter counts
    const activityCounts = {
        all: activityLog.length,
        post: activityLog.filter(a => a.action_type === "post").length,
        comment: activityLog.filter(a => a.action_type === "comment").length,
        upvote: activityLog.filter(a => a.action_type === "upvote").length,
    };

    const filteredActivity = activityFilter === "all"
        ? activityLog
        : activityLog.filter(a => a.action_type === activityFilter);

    const filterOptions: { key: ActivityFilter; label: string; icon: React.ElementType }[] = [
        { key: "all",     label: "ALL",      icon: Filter },
        { key: "post",    label: "POSTS",    icon: Plus },
        { key: "comment", label: "COMMENTS", icon: MessageSquare },
        { key: "upvote",  label: "UPVOTES",  icon: ArrowUpRight },
    ];

    return (
        <div className="space-y-8 max-w-5xl mx-auto pb-20">
            {/* Identity section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <GlassCard className="p-8 flex flex-col items-center justify-center text-center relative overflow-hidden group">
                    <div className="relative group h-24 w-24 mb-4 select-none">
                        <div className="h-24 w-24 min-w-[6rem] rounded-2xl bg-neon-green/10 border border-neon-green/20 flex items-center justify-center text-3xl font-extrabold text-emerald-700 dark:text-neon-green overflow-hidden flex-shrink-0">
                            {avatarUrl ? (
                                <img
                                    src={avatarUrl}
                                    alt={fullName || "User avatar"}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                getInitials(fullName)
                            )}
                        </div>
                        
                        <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center rounded-2xl text-white text-xs font-mono font-bold transition-opacity duration-200 cursor-pointer border border-neon-green/35">
                            <Plus className="h-5 w-5 mb-1 text-neon-green animate-bounce" />
                            <span>UPLOAD</span>
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleAvatarUpload}
                                disabled={uploading}
                            />
                        </label>

                        {uploading && (
                            <div className="absolute inset-0 bg-black/70 flex items-center justify-center rounded-2xl border border-neon-green/20">
                                <Loader2 className="h-6 w-6 text-neon-green animate-spin" />
                            </div>
                        )}
                    </div>
                    
                    <h3 className="text-xl font-bold mb-1 font-mono tracking-tight w-full overflow-hidden text-ellipsis whitespace-nowrap px-2" style={{color: 'var(--text-primary)'}}>{fullName || "Agent"}</h3>
                    <p className="text-xs text-gray-400 font-mono mb-4 w-full truncate px-2">{initialData.email}</p>
                    
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neon-green/10 border border-neon-green/20 text-emerald-700 dark:text-neon-green text-xs font-mono font-bold uppercase tracking-wider">
                        <Shield className="h-3 w-3" />
                        {initialData.role}
                    </div>
                </GlassCard>

                <GlassCard className="lg:col-span-2 p-8 relative overflow-hidden">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2 font-mono">
                        <User className="text-neon-green h-5 w-5" />
                        AGENT IDENTITY PARAMETERS
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-2">
                            <label className="text-xs font-mono text-gray-400 tracking-wider">AGENT CODENAME</label>
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                maxLength={50}
                                minLength={2}
                                placeholder="Enter your display name"
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-green focus:ring-1 focus:ring-neon-green/30 transition-all font-mono"
                            />
                            <p className="text-[10px] font-mono text-gray-400 mt-1">{fullName.trim().length}/50 characters</p>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-mono text-gray-400 tracking-wider">COMMUNICATION LINK (EMAIL)</label>
                            <input
                                type="text"
                                value={initialData.email}
                                disabled
                                className="w-full bg-black/20 border border-white/5 rounded-xl px-4 py-3 text-gray-400 cursor-not-allowed font-mono dashed-border"
                            />
                        </div>
                    </div>

                    {message && (
                        <div className={cn(
                            "p-4 rounded-xl text-sm font-mono flex items-center gap-2 mb-6 animate-in fade-in duration-200",
                            message.type === 'success' ? "bg-neon-green/10 text-neon-green border border-neon-green/20" : "bg-red-500/10 text-red-500 border border-red-500/20"
                        )} role="alert">
                            {message.type === 'success' ? <Check className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                            {message.text}
                        </div>
                    )}

                    <div className="flex justify-end">
                        <Button onClick={handleSave} disabled={loading || fullName.trim().length < 2} className="w-full md:w-auto bg-neon-green text-black hover:bg-neon-green/90 font-bold px-6">
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            SAVE CHANGES
                        </Button>
                    </div>
                </GlassCard>
            </div>

            {/* Course Purchase Information */}
            <GlassCard className="p-8">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2 font-mono">
                    <Award className="text-neon-green h-5 w-5" />
                    ACQUIRED SYLLABUS ACCESS (PURCHASES)
                </h3>

                {/* Desktop View (Table) */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/[0.06] text-xs font-mono text-gray-400 uppercase tracking-wider pb-3">
                                <th className="pb-3">Course / Path</th>
                                <th className="pb-3">Transaction ID</th>
                                <th className="pb-3">Date</th>
                                <th className="pb-3">Amount Paid</th>
                                <th className="pb-3">Gateway</th>
                                <th className="pb-3 text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.04] text-sm">
                            {purchases.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-8 text-center font-mono text-xs text-gray-400">
                                        NO ACQUIRED ACCESS RECORDS FOUND. GO TO ACADEMY TO ENROLL!
                                    </td>
                                </tr>
                            ) : (
                                purchases.map((p) => (
                                    <tr key={p.id} className="hover:bg-white/[0.01] transition-colors group">
                                        <td className="py-4 font-medium text-white group-hover:text-neon-green transition-colors">{p.course}</td>
                                        <td className="py-4 font-mono text-xs text-gray-400">{p.txnId}</td>
                                        <td className="py-4 text-gray-400">{p.date}</td>
                                        <td className="py-4 text-white font-semibold">{p.amount}</td>
                                        <td className="py-4">
                                            <span className={cn(
                                                "inline-block px-2.5 py-0.5 rounded text-xs font-bold",
                                                p.gateway === "bKash" ? "bg-bkash-pink/10 text-bkash-pink border border-bkash-pink/20" : 
                                                p.gateway === "Nagad" ? "bg-nagad-orange/10 text-nagad-orange border border-nagad-orange/20" :
                                                "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                            )}>
                                                {p.gateway}
                                            </span>
                                        </td>
                                        <td className="py-4 text-right">
                                            <span className={cn("inline-flex items-center gap-1 text-xs font-mono uppercase font-bold px-2 py-0.5 rounded-full border", p.statusInfo.color)}>
                                                {p.status === "SUCCESS" ? <CheckCircle className="h-3 w-3" /> : <Info className="h-3 w-3" />}
                                                {p.statusInfo.label}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile View (Cards) */}
                <div className="block md:hidden space-y-4">
                    {purchases.length === 0 ? (
                        <div className="py-8 text-center font-mono text-xs text-gray-400">
                            NO ACQUIRED ACCESS RECORDS FOUND. GO TO ACADEMY TO ENROLL!
                        </div>
                    ) : (
                        purchases.map((p) => (
                            <div key={p.id} className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.01] space-y-3">
                                <div className="flex justify-between items-start gap-2">
                                    <h4 className="font-bold text-white text-sm leading-snug">{p.course}</h4>
                                    <span className={cn("inline-flex items-center gap-1 text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-full border shrink-0", p.statusInfo.color)}>
                                        {p.status === "SUCCESS" ? <CheckCircle className="h-3 w-3" /> : <Info className="h-3 w-3" />}
                                        {p.statusInfo.label}
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-3 text-xs font-mono text-gray-400">
                                    <div>
                                        <span className="block text-[9px] text-gray-500 uppercase tracking-wider mb-0.5">Transaction ID</span>
                                        <span className="truncate block max-w-[120px] text-white">{p.txnId}</span>
                                    </div>
                                    <div>
                                        <span className="block text-[9px] text-gray-500 uppercase tracking-wider mb-0.5">Date</span>
                                        <span className="text-white">{p.date}</span>
                                    </div>
                                    <div>
                                        <span className="block text-[9px] text-gray-500 uppercase tracking-wider mb-0.5">Amount Paid</span>
                                        <span className="text-white font-bold">{p.amount}</span>
                                    </div>
                                    <div>
                                        <span className="block text-[9px] text-gray-500 uppercase tracking-wider mb-0.5">Gateway</span>
                                        <span className={cn(
                                            "inline-block px-1.5 py-0.5 rounded text-[10px] font-bold mt-0.5",
                                            p.gateway === "bKash" ? "bg-bkash-pink/10 text-bkash-pink border border-bkash-pink/20" : 
                                            p.gateway === "Nagad" ? "bg-nagad-orange/10 text-nagad-orange border border-nagad-orange/20" :
                                            "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                        )}>
                                            {p.gateway}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </GlassCard>

            {/* Payment & Billing Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Payment Methods — Dynamic from transactions */}
                <GlassCard className="p-8">
                    <h3 className="text-lg font-bold flex items-center gap-2 font-mono" style={{color: 'var(--text-primary)'}}>
                        <CreditCard className="text-neon-green h-5 w-5" />
                        PAYMENT METHODS
                    </h3>

                    {purchases.length > 0 ? (
                        <div className="space-y-4 mt-6">
                            {/* Show unique gateways used */}
                            {Array.from(new Set(purchases.map(p => p.gateway))).map((gw) => (
                                <div key={gw} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/10 transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                            "h-10 w-10 rounded-lg flex items-center justify-center font-extrabold text-xs border",
                                            gw === "bKash" ? "bg-bkash-pink/10 border-bkash-pink/20 text-bkash-pink" :
                                            gw === "Nagad" ? "bg-nagad-orange/10 border-nagad-orange/20 text-nagad-orange" :
                                            "bg-blue-500/10 border-blue-500/20 text-blue-400"
                                        )}>
                                            {gw.slice(0, 2)}
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold" style={{color: 'var(--text-primary)'}}>{gw}</h4>
                                            <p className="text-xs text-gray-400 font-mono">Used in {purchases.filter(p => p.gateway === gw).length} transaction(s)</p>
                                        </div>
                                    </div>
                                    <span className="text-xs text-neon-green bg-neon-green/10 border border-neon-green/20 px-2 py-0.5 rounded font-mono font-bold">USED</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-10 text-center border border-dashed border-white/5 rounded-xl bg-white/[0.01] mt-6">
                            <CreditCard className="h-8 w-8 text-gray-400 mb-2 opacity-40" />
                            <p className="text-xs font-mono text-gray-400">NO PAYMENT METHODS ON FILE</p>
                            <p className="text-[10px] font-mono text-gray-400 mt-1">Payment methods appear after your first purchase.</p>
                        </div>
                    )}
                </GlassCard>

                {/* Billing Summary */}
                <GlassCard className="p-8 flex flex-col justify-between">
                    <div>
                        <h3 className="text-lg font-bold flex items-center gap-2 font-mono" style={{color: 'var(--text-primary)'}}>
                            <Calendar className="text-neon-green h-5 w-5" />
                            BILLING HISTORY
                        </h3>

                        {billingHistory.length > 0 ? (
                            <div className="space-y-2 mt-6">
                                {billingHistory.map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between text-xs font-mono bg-white/[0.01] border border-white/[0.04] p-3 rounded-lg">
                                        <span className="text-gray-400">{item.period} ({item.method})</span>
                                        <span className="text-neon-green font-bold">{item.amount}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-10 text-center border border-dashed border-white/5 rounded-xl bg-white/[0.01] mt-6">
                                <FileText className="h-8 w-8 text-gray-400 mb-2 opacity-40" />
                                <p className="text-xs font-mono text-gray-400">NO BILLING RECORDS YET</p>
                                <p className="text-[10px] font-mono text-gray-400 mt-1">Your payment history will appear here after enrollment.</p>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center justify-center pt-4 border-t border-white/[0.06] mt-6">
                        <p className="text-[10px] font-mono text-gray-400 text-center">All transactions are processed securely via bKash, Nagad, or SSLCommerz.</p>
                    </div>
                </GlassCard>
            </div>

            {/* Agent Activity Log — with type filtering */}
            <GlassCard className="p-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2 font-mono">
                        <Clock className="text-neon-green h-5 w-5" />
                        AGENT ACTIVITY LOG (TELEMETRY)
                    </h3>

                    {/* Type Filter Tabs - Allow Horizontal Scroll on Mobile */}
                    {activityLog.length > 0 && (
                        <div className="flex items-center gap-1 bg-white/[0.03] border border-white/[0.06] rounded-xl p-1 overflow-x-auto max-w-full scrollbar-none snap-x snap-mandatory">
                            {filterOptions.map(({ key, label, icon: Icon }) => (
                                <button
                                    key={key}
                                    onClick={() => setActivityFilter(key)}
                                    className={cn(
                                        "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider transition-all shrink-0 snap-start",
                                        activityFilter === key
                                            ? "bg-neon-green/10 text-neon-green border border-neon-green/20"
                                            : "text-gray-400 hover:text-gray-300 hover:bg-white/[0.04]"
                                    )}
                                >
                                    <Icon className="h-3 w-3" />
                                    {label}
                                    {activityCounts[key] > 0 && (
                                        <span className={cn(
                                            "px-1 rounded text-[9px] font-black",
                                            activityFilter === key ? "bg-neon-green/20 text-neon-green" : "bg-white/10 text-gray-400"
                                        )}>
                                            {activityCounts[key]}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {filteredActivity.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-center border border-dashed border-white/5 rounded-xl bg-white/[0.01]">
                        <Clock className="h-8 w-8 text-gray-400 mb-2 opacity-40 animate-pulse" />
                        <p className="text-xs font-mono text-gray-400">
                            {activityFilter === "all" ? "NO SECURE ACTIVITY DETECTED YET" : `NO ${activityFilter.toUpperCase()} ACTIVITY FOUND`}
                        </p>
                        <p className="text-[10px] font-mono text-gray-400 mt-1">
                            {activityFilter === "all"
                                ? "Platform activities are securely cataloged here."
                                : "Try selecting a different filter."}
                        </p>
                    </div>
                ) : (
                    <div className="relative border-l border-white/10 pl-6 space-y-6 ml-3">
                        {filteredActivity.map((act) => {
                            let Icon = Plus;
                            let badgeColor = "bg-neon-green/10 text-neon-green border-neon-green/20";
                            if (act.action_type === "upvote") {
                                Icon = ArrowUpRight;
                                badgeColor = "bg-sky-500/10 text-sky-400 border-sky-500/20";
                            } else if (act.action_type === "comment") {
                                Icon = MessageSquare;
                                badgeColor = "bg-amber-500/10 text-amber-400 border-amber-500/20";
                            }

                            return (
                                <div key={act.id} className="relative group">
                                    {/* Timeline dot */}
                                    <div className="absolute -left-[31px] top-1.5 h-3.5 w-3.5 rounded-full bg-agri-black border-2 border-white/20 flex items-center justify-center group-hover:border-neon-green transition-colors">
                                        <div className="h-1 w-1 rounded-full bg-white/40 group-hover:bg-neon-green transition-colors" />
                                    </div>

                                    {/* Activity Details */}
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-white/10 transition-all">
                                        <div className="flex items-center gap-3">
                                            <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center border shrink-0", badgeColor)}>
                                                <Icon className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-white group-hover:text-neon-green transition-colors font-mono">
                                                    {act.target_title}
                                                </p>
                                                <p className="text-[10px] text-gray-400 font-mono mt-0.5">
                                                    Target Resource ID: {act.target_id}
                                                </p>
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-mono text-gray-400 bg-white/5 px-2.5 py-1 rounded-lg shrink-0 sm:self-center">
                                            {new Date(act.created_at).toLocaleString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </GlassCard>
        </div>
    );
}
