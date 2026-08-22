// components/schedule/routine-calendar.tsx
"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import type { RoutineEntry, ScheduleConflict } from "@/types/bau";
import {
    Calendar, Clock, MapPin, AlertTriangle
} from "lucide-react";
import Link from "next/link";

interface RoutineCalendarProps {
    events: RoutineEntry[];
    conflicts?: ScheduleConflict[];
}

const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"] as const;

export function RoutineCalendar({ events, conflicts = [] }: RoutineCalendarProps) {
    const [selectedDay, setSelectedDay] = useState<string>("Sunday");
    const [selectedGroup, setSelectedGroup] = useState<"All" | "Group A" | "Group B">("All");
    const [selectedType, setSelectedType] = useState<"All" | "Theory" | "Practical" | "Class Test">("All");

    // Filter events by day, group, and type
    const filteredEvents = events.filter((e) => {
        const matchesDay = e.dayOfWeek === selectedDay;
        const matchesGroup = selectedGroup === "All" || e.group === "All" || e.group === selectedGroup;
        const matchesType = selectedType === "All" || e.type === selectedType;
        return matchesDay && matchesGroup && matchesType;
    });

    const dayClashes = conflicts.filter((c) => c.entries.some(e => e.dayOfWeek === selectedDay));

    return (
        <div className="space-y-6">
            {/* Day Selector Tabs (Sunday to Thursday) */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-black/[0.06] dark:border-white/10 pb-4">
                <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                    {DAYS_OF_WEEK.map((day) => {
                        const count = events.filter(e => e.dayOfWeek === day).length;
                        const isSelected = selectedDay === day;
                        return (
                            <button
                                key={day}
                                onClick={() => setSelectedDay(day)}
                                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 ${
                                    isSelected
                                        ? "bg-neon-green text-black shadow-[0_0_15px_rgba(0,255,148,0.3)]"
                                        : "bg-black/[0.03] dark:bg-white/[0.04] text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                                }`}
                            >
                                <span>{day.toUpperCase()}</span>
                                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? "bg-black/20 text-black" : "bg-black/10 dark:bg-white/10 text-gray-500"}`}>
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Filter Controls */}
                <div className="flex items-center gap-2">
                    <select
                        value={selectedGroup}
                        onChange={(e) => setSelectedGroup(e.target.value as "All" | "Group A" | "Group B")}
                        className="bg-black/[0.03] dark:bg-black/40 border border-black/10 dark:border-white/10 rounded-lg px-2.5 py-1.5 text-xs font-mono text-gray-700 dark:text-gray-300 focus:outline-none focus:border-neon-green"
                    >
                        <option value="All">All Groups</option>
                        <option value="Group A">Group A Only</option>
                        <option value="Group B">Group B Only</option>
                    </select>

                    <select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value as "All" | "Theory" | "Practical" | "Class Test")}
                        className="bg-black/[0.03] dark:bg-black/40 border border-black/10 dark:border-white/10 rounded-lg px-2.5 py-1.5 text-xs font-mono text-gray-700 dark:text-gray-300 focus:outline-none focus:border-neon-green"
                    >
                        <option value="All">All Types</option>
                        <option value="Theory">Theory Only</option>
                        <option value="Practical">Practical Lab Only</option>
                        <option value="Class Test">Class Test Only</option>
                    </select>
                </div>
            </div>

            {/* Schedule Clashes Alert if detected on this day */}
            {dayClashes.length > 0 && (
                <div className="space-y-2">
                    {dayClashes.map((clash, idx) => (
                        <div key={idx} className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-xs text-red-700 dark:text-red-300 font-mono">
                            <AlertTriangle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                            <div>
                                <strong className="font-bold">SCHEDULE CONFLICT DETECTED:</strong> {clash.message}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Timetable Events Stream */}
            {filteredEvents.length === 0 ? (
                <GlassCard className="p-12 text-center space-y-3">
                    <Calendar className="h-10 w-10 text-gray-400 mx-auto animate-pulse" />
                    <h3 className="font-bold text-base text-gray-900 dark:text-white font-mono">No Sessions Scheduled on {selectedDay}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-mono max-w-sm mx-auto">
                        No active classes match your current group/type filters. Drop a new routine PDF above to populate this day.
                    </p>
                </GlassCard>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredEvents.map((event) => {
                        const isPractical = event.type === "Practical";
                        const isClassTest = event.type === "Class Test";

                        return (
                            <GlassCard
                                key={event.id}
                                className={`p-5 space-y-4 hover:border-emerald-500/40 transition-all ${
                                    isClassTest
                                        ? "border-amber-500/40 bg-amber-500/5"
                                        : isPractical
                                        ? "border-blue-500/30 bg-blue-500/5"
                                        : "border-black/[0.06] dark:border-white/10"
                                }`}
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="space-y-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="font-mono text-xs font-bold text-emerald-800 dark:text-neon-green bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded">
                                                {event.courseCode}
                                            </span>
                                            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                                                isClassTest
                                                    ? "bg-amber-500/20 text-amber-700 dark:text-amber-300"
                                                    : isPractical
                                                    ? "bg-blue-500/20 text-blue-700 dark:text-blue-300"
                                                    : "bg-black/5 dark:bg-white/10 text-gray-600 dark:text-gray-400"
                                            }`}>
                                                {event.type}
                                            </span>
                                            {event.group && event.group !== "All" && (
                                                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20">
                                                    {event.group}
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="font-bold text-base text-gray-900 dark:text-white leading-snug pt-1">
                                            {event.courseTitle}
                                        </h3>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2 text-xs font-mono text-gray-600 dark:text-gray-400 pt-2 border-t border-black/[0.04] dark:border-white/5">
                                    <div className="flex items-center gap-1.5">
                                        <Clock className="h-3.5 w-3.5 text-emerald-600 dark:text-neon-green shrink-0" />
                                        <span className="font-bold text-gray-900 dark:text-gray-200">{event.startTime} – {event.endTime}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 truncate">
                                        <MapPin className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                                        <span className="truncate">{event.room}</span>
                                    </div>
                                </div>

                                {event.teacherName && (
                                    <div className="text-[11px] font-mono text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                                        <span>Faculty:</span>
                                        <strong className="text-gray-700 dark:text-gray-300">{event.teacherName}</strong>
                                    </div>
                                )}

                                <div className="pt-2 flex items-center justify-between border-t border-black/[0.04] dark:border-white/5">
                                    <Link href={`/academy/courses/${event.courseCode.toLowerCase().replace(/\s+/g, "-")}`}>
                                        <Button variant="ghost" size="sm" className="text-xs font-mono text-emerald-700 dark:text-neon-green hover:underline p-0 h-auto">
                                            Course Workspace →
                                        </Button>
                                    </Link>
                                    <Link href={`/academy/viva?course=${encodeURIComponent(event.courseCode)}`}>
                                        <Button size="sm" variant="outline" className="text-xs font-mono h-7 px-2.5">
                                            Prepare Viva
                                        </Button>
                                    </Link>
                                </div>
                            </GlassCard>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
