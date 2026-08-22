"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Loader2, User, Shield, Bell, Cpu, Save } from "lucide-react";
import { updateSettings, type UserSettings } from "@/actions/settings";
import { cn } from "@/lib/utils";

// Mock Switch using standard HTML checkbox for now + Tailwind
function Toggle({ checked, onChange, label, subLabel }: { checked: boolean, onChange: () => void, label: string, subLabel: string }) {
    return (
        <div className="flex items-center justify-between pb-4 border-b border-white/5 last:border-0 last:pb-0">
            <div className="space-y-1">
                <div className="text-white font-medium">{label}</div>
                <div className="text-xs text-gray-500">{subLabel}</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={checked} onChange={onChange} />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-neon-green rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neon-green"></div>
            </label>
        </div>
    );
}

interface SettingsFormProps {
    initialData: {
        id: string;
        email: string;
        full_name: string;
        role: string;
        settings: UserSettings;
    };
}

export function SettingsForm({ initialData }: SettingsFormProps) {
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("profile");

    // Form State
    const [fullName, setFullName] = useState(initialData.full_name);
    const [config, setConfig] = useState<UserSettings>(initialData.settings);
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

    const handleSave = async () => {
        setLoading(true);
        setMessage(null);

        try {
            const res = await updateSettings(fullName, config);
            if (res.error) {
                setMessage({ text: "Failed to update settings.", type: "error" });
            } else {
                setMessage({ text: "Configuration saved successfully.", type: "success" });
            }
        } catch {
            setMessage({ text: "Connection error.", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    const toggle = (key: keyof UserSettings) => {
        setConfig(p => ({ ...p, [key]: !p[key] }));
    };

    const tabs = [
        { id: "profile", icon: User, label: "Agent Profile" },
        { id: "system", icon: Cpu, label: "System Behavior" },
        { id: "security", icon: Shield, label: "Security Protocol" },
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sidebar Nav */}
            <div className="space-y-4">
                <GlassCard className="p-4 space-y-2">
                    {tabs.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={cn(
                                "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold font-mono transition-all text-left",
                                activeTab === item.id
                                    ? "bg-neon-green text-black shadow-[0_0_10px_rgba(0,255,148,0.3)]"
                                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.label}
                        </button>
                    ))}
                </GlassCard>

                <div className="rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/10 border border-white/5 p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-50">
                        <Shield className="h-10 w-10 text-purple-400" />
                    </div>
                    <h4 className="text-white font-bold mb-2">Security Status</h4>
                    <p className="text-xs text-gray-300 mb-4">Encryption keys match generic defaults. Recommendation: Rotate keys every 30 cycles.</p>
                    <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full w-3/4 bg-purple-500" />
                    </div>
                </div>
            </div>

            {/* Main Settings Form */}
            <div className="lg:col-span-2 space-y-6">

                {/* PROFILE TAB */}
                {activeTab === "profile" && (
                    <GlassCard className="p-8 relative overflow-hidden group animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-neon-green/5 rounded-bl-full -mr-16 -mt-16 transition-all group-hover:bg-neon-green/10" />

                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <User className="text-neon-green h-5 w-5" />
                            IDENTITY PARAMETERS
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-mono text-gray-500">CODENAME (FULL NAME)</label>
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-green transition-colors font-mono"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-mono text-gray-500">COMM CHANNEL (EMAIL)</label>
                                <input
                                    type="text"
                                    value={initialData.email}
                                    disabled
                                    className="w-full bg-black/20 border border-white/5 rounded-lg px-4 py-3 text-gray-500 cursor-not-allowed font-mono dashed-border"
                                />
                            </div>
                        </div>
                    </GlassCard>
                )}

                {/* SYSTEM TAB */}
                {activeTab === "system" && (
                    <GlassCard className="p-8 animate-in fade-in slide-in-from-right-4 duration-300">
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <Cpu className="text-blue-400 h-5 w-5" />
                            SYSTEM BEHAVIOR
                        </h3>

                        <div className="space-y-6">
                            <Toggle
                                label="Mission Notifications"
                                subLabel="Receive alerts for new training modules"
                                checked={config.notifications}
                                onChange={() => toggle('notifications')}
                            />
                            <Toggle
                                label="Haptic Feedback"
                                subLabel="Device vibration on successful encryption"
                                checked={config.haptics}
                                onChange={() => toggle('haptics')}
                            />
                            <Toggle
                                label="Public Profile"
                                subLabel="Allow other agents to see your stats"
                                checked={config.publicProfile}
                                onChange={() => toggle('publicProfile')}
                            />
                        </div>
                    </GlassCard>
                )}

                {/* SECURITY TAB (Visual only for now) */}
                {activeTab === "security" && (
                    <GlassCard className="p-8 animate-in fade-in slide-in-from-right-4 duration-300 border-red-500/20">
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <Shield className="text-red-400 h-5 w-5" />
                            SECURITY PROTOCOL
                        </h3>
                        <div className="p-4 bg-red-500/10 rounded border border-red-500/20 text-red-200 text-sm font-mono">
                            RESTRICTED ACCESS. CLEARANCE LEVEL 2 REQUIRED FOR ADVANCED SECURITY SETTINGS.
                        </div>
                    </GlassCard>
                )}

                {/* Save Feedback */}
                {message && (
                    <div className={cn(
                        "p-4 rounded-lg text-sm font-mono flex items-center gap-2",
                        message.type === 'success' ? "bg-neon-green/10 text-neon-green border border-neon-green/20" : "bg-red-500/10 text-red-500 border border-red-500/20"
                    )}>
                        {message.type === 'success' ? <Shield className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
                        {message.text}
                    </div>
                )}

                {/* Save Action */}
                <div className="flex justify-end pt-4">
                    <Button onClick={handleSave} disabled={loading} size="lg" className="w-full md:w-auto">
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        UPDATE CONFIGURATION
                    </Button>
                </div>
            </div>
        </div>
    );
}
