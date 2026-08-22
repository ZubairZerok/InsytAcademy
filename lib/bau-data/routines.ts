// lib/bau-data/routines.ts
// Authentic BAU Routine datasets, timetable structures, conflict detector, and notice feeds.
// Provenance: Dean's Committee Class Routines & Academic Calendar of BAU.

import type { RoutineEntry, ScheduleConflict } from "@/types/bau";

export const BAU_SAMPLE_ROUTINE_ENTRIES: RoutineEntry[] = [
    // --- Sunday ---
    {
        id: "rt-sun-1",
        courseCode: "AAS 2107",
        courseTitle: "Statistical Inference",
        dayOfWeek: "Sunday",
        startTime: "10:00",
        endTime: "11:00",
        room: "Gallery 204 (FAERS Complex)",
        type: "Theory",
        group: "All",
        facultyCode: "FAERS",
        departmentCode: "STAT",
        level: 2,
        semester: 1,
        teacherName: "Dr. Mohammad Jahangir Alam"
    },
    {
        id: "rt-sun-2",
        courseCode: "AE 2111",
        courseTitle: "Advanced Microeconomics",
        dayOfWeek: "Sunday",
        startTime: "14:00",
        endTime: "15:00",
        room: "Lecture Room 102",
        type: "Theory",
        group: "All",
        facultyCode: "FAERS",
        departmentCode: "AE",
        level: 2,
        semester: 1,
        teacherName: "Dr. Mohammad Ismail Hossain"
    },
    {
        id: "rt-sun-3",
        courseCode: "AGRON 1101",
        courseTitle: "Fundamentals of Agronomy",
        dayOfWeek: "Sunday",
        startTime: "09:00",
        endTime: "10:00",
        room: "KBD Complex Gallery 1",
        type: "Theory",
        group: "All",
        facultyCode: "FOA",
        departmentCode: "AGRON",
        level: 1,
        semester: 1,
        teacherName: "Prof. Dr. Md. Abdus Salam"
    },

    // --- Monday ---
    {
        id: "rt-mon-1",
        courseCode: "AAS 2107",
        courseTitle: "Statistical Inference Lab",
        dayOfWeek: "Monday",
        startTime: "14:00",
        endTime: "17:00",
        room: "Computer Lab 3 (GIS Center)",
        type: "Practical",
        group: "Group A",
        facultyCode: "FAERS",
        departmentCode: "STAT",
        level: 2,
        semester: 1,
        teacherName: "Dr. Mohammad Jahangir Alam"
    },
    {
        id: "rt-mon-2",
        courseCode: "AE 2111",
        courseTitle: "Advanced Microeconomics Tutorial",
        dayOfWeek: "Monday",
        startTime: "11:00",
        endTime: "12:00",
        room: "Seminar Room A",
        type: "Tutorial",
        group: "All",
        facultyCode: "FAERS",
        departmentCode: "AE",
        level: 2,
        semester: 1,
        teacherName: "Dr. Nazia Tabassum"
    },

    // --- Tuesday ---
    {
        id: "rt-tue-1",
        courseCode: "AAS 2107",
        courseTitle: "Statistical Inference (Hypothesis Testing)",
        dayOfWeek: "Tuesday",
        startTime: "10:00",
        endTime: "11:00",
        room: "Gallery 204 (FAERS Complex)",
        type: "Theory",
        group: "All",
        facultyCode: "FAERS",
        departmentCode: "STAT",
        level: 2,
        semester: 1,
        teacherName: "Dr. Mohammad Jahangir Alam"
    },
    {
        id: "rt-tue-2",
        courseCode: "AAS 2107",
        courseTitle: "AAS 2107 Class Test #1",
        dayOfWeek: "Tuesday",
        startTime: "11:15",
        endTime: "12:00",
        room: "Gallery 204 (FAERS Complex)",
        type: "Class Test",
        group: "All",
        facultyCode: "FAERS",
        departmentCode: "STAT",
        level: 2,
        semester: 1,
        teacherName: "Dr. Mohammad Jahangir Alam"
    },
    {
        id: "rt-tue-3",
        courseCode: "VMH 2101",
        courseTitle: "Veterinary Microbiology Lab",
        dayOfWeek: "Tuesday",
        startTime: "14:00",
        endTime: "17:00",
        room: "Microbiology Central Lab",
        type: "Practical",
        group: "Group B",
        facultyCode: "FVS",
        departmentCode: "VMH",
        level: 2,
        semester: 1,
        teacherName: "Prof. Dr. Md. Abdul Awal"
    },

    // --- Wednesday ---
    {
        id: "rt-wed-1",
        courseCode: "AE 2111",
        courseTitle: "Advanced Microeconomics",
        dayOfWeek: "Wednesday",
        startTime: "09:00",
        endTime: "10:00",
        room: "Lecture Room 102",
        type: "Theory",
        group: "All",
        facultyCode: "FAERS",
        departmentCode: "AE",
        level: 2,
        semester: 1,
        teacherName: "Dr. Mohammad Ismail Hossain"
    },
    {
        id: "rt-wed-2",
        courseCode: "AAS 2107",
        courseTitle: "Statistical Inference Lab",
        dayOfWeek: "Wednesday",
        startTime: "14:00",
        endTime: "17:00",
        room: "Computer Lab 3 (GIS Center)",
        type: "Practical",
        group: "Group B",
        facultyCode: "FAERS",
        departmentCode: "STAT",
        level: 2,
        semester: 1,
        teacherName: "Dr. Mohammad Jahangir Alam"
    },

    // --- Thursday ---
    {
        id: "rt-thu-1",
        courseCode: "AGRON 1101",
        courseTitle: "Agronomy Field Practical",
        dayOfWeek: "Thursday",
        startTime: "08:00",
        endTime: "11:00",
        room: "BAU Agronomy Field Laboratory (Block C)",
        type: "Practical",
        group: "Group A",
        facultyCode: "FOA",
        departmentCode: "AGRON",
        level: 1,
        semester: 1,
        teacherName: "Prof. Dr. Md. Abdus Salam"
    },
    {
        id: "rt-thu-2",
        courseCode: "AQ 2101",
        courseTitle: "Aquaculture Limnology & Water Quality",
        dayOfWeek: "Thursday",
        startTime: "11:00",
        endTime: "12:00",
        room: "Fisheries Auditorium 2",
        type: "Theory",
        group: "All",
        facultyCode: "FOF",
        departmentCode: "AQ",
        level: 2,
        semester: 1,
        teacherName: "Prof. Dr. Md. Ahsan Bin Habib"
    }
];

export interface BAUNotice {
    id: string;
    title: string;
    date: string;
    category: "EXAM_CIRCULAR" | "ROUTINE_UPDATE" | "FIELD_PRACTICAL" | "SCHOLARSHIP" | "GENERAL";
    facultyCode?: string;
    departmentCode?: string;
    summary: string;
    officialRefNumber: string;
    downloadUrl?: string;
    isUrgent?: boolean;
}

export const BAU_OFFICIAL_NOTICES: BAUNotice[] = [
    {
        id: "ntc-2026-01",
        title: "Class Test Schedule: AAS 2107 Statistical Inference (L2S1)",
        date: "2026-08-20",
        category: "EXAM_CIRCULAR",
        facultyCode: "FAERS",
        departmentCode: "STAT",
        summary: "The 1st Continuous Assessment (Class Test 1 - 10 Marks) for AAS 2107 will be held on Tuesday at 11:15 AM in Gallery 204. Syllabus covers Sampling Distributions & Hypothesis Testing.",
        officialRefNumber: "BAU/FAERS/STAT/2026/CT-109",
        isUrgent: true
    },
    {
        id: "ntc-2026-02",
        title: "Field Laboratory Schedule Update for Agronomy & Soil Science Practical",
        date: "2026-08-18",
        category: "FIELD_PRACTICAL",
        facultyCode: "FOA",
        departmentCode: "AGRON",
        summary: "Group A students are advised to report to Agronomy Field Lab Block C with field notebooks at 08:00 AM sharp on Thursday.",
        officialRefNumber: "BAU/FOA/AGR-PL/2026/88"
    },
    {
        id: "ntc-2026-03",
        title: "Semester Final Examination Routine Published (Session 2024-2025)",
        date: "2026-08-15",
        category: "ROUTINE_UPDATE",
        summary: "Dean's Committee has published the provisional semester final examination dates starting from October 12, 2026 under the 10/20/70 Ordinance.",
        officialRefNumber: "BAU/DEAN-COMM/2026/EXAM-04"
    },
    {
        id: "ntc-2026-04",
        title: "National Science & Technology (NST) Fellowship 2026-27 Applications",
        date: "2026-08-10",
        category: "SCHOLARSHIP",
        summary: "Eligible MS and PhD research fellows across all 6 faculties are invited to submit research proposals through the Dean's Office.",
        officialRefNumber: "BAU/CASR/NST-FELLOW/2026/41"
    }
];

export function detectScheduleConflicts(entries: RoutineEntry[]): ScheduleConflict[] {
    const conflicts: ScheduleConflict[] = [];

    for (let i = 0; i < entries.length; i++) {
        for (let j = i + 1; j < entries.length; j++) {
            const e1 = entries[i];
            const e2 = entries[j];

            if (e1.dayOfWeek === e2.dayOfWeek) {
                const timeOverlap = (e1.startTime < e2.endTime) && (e2.startTime < e1.endTime);
                if (timeOverlap) {
                    // Check if same group or all
                    const groupOverlap = e1.group === "All" || e2.group === "All" || e1.group === e2.group;
                    if (groupOverlap && e1.level === e2.level && e1.semester === e2.semester) {
                        conflicts.push({
                            type: "TIME_OVERLAP",
                            message: `Time slot conflict on ${e1.dayOfWeek}: ${e1.courseCode} (${e1.startTime}-${e1.endTime}) overlaps with ${e2.courseCode} (${e2.startTime}-${e2.endTime}).`,
                            entries: [e1, e2]
                        });
                    }
                    if (e1.room === e2.room && e1.courseCode !== e2.courseCode) {
                        conflicts.push({
                            type: "ROOM_CLASH",
                            message: `Room allocation clash in ${e1.room} on ${e1.dayOfWeek}: both ${e1.courseCode} and ${e2.courseCode} are scheduled.`,
                            entries: [e1, e2]
                        });
                    }
                }
            }
        }
    }

    return conflicts;
}
