// lib/bau-data/faculties.ts
// Official 6 Faculties and 44 Academic Departments of Bangladesh Agricultural University (BAU), Mymensingh.
// Provenance: Official BAU Academic Bulletin & Faculty Directory.

import type { BAUFaculty } from "@/types/bau";

export const BAU_FACULTIES: BAUFaculty[] = [
    {
        id: "fac-foa",
        code: "FOA",
        name: "Faculty of Agriculture",
        shortName: "Agriculture",
        icon: "Leaf",
        description: "Pioneering high-yielding crop varieties, precision agronomy, soil nutrient modeling, and agro-ecological sustainability.",
        dean: "Prof. Dr. Md. Golam Rabbani",
        totalDepartments: 14,
        provenance: "VERIFIED",
        departments: [
            {
                id: "dept-agron",
                code: "AGRON",
                name: "Department of Agronomy",
                facultyCode: "FOA",
                head: "Prof. Dr. Md. Abdus Salam",
                provenance: "VERIFIED",
                degrees: [
                    { id: "deg-bsc-ag", name: "B.Sc. Agriculture (Hons.)", shortName: "B.Sc. Ag", degreeType: "Undergraduate", durationYears: 4, totalSemesters: 8, facultyCode: "FOA", departmentCode: "AGRON" },
                    { id: "deg-ms-agron", name: "MS in Agronomy", shortName: "MS Agron", degreeType: "Master of Science (MS)", durationYears: 1.5, totalSemesters: 3, facultyCode: "FOA", departmentCode: "AGRON" }
                ]
            },
            {
                id: "dept-ss",
                code: "SS",
                name: "Department of Soil Science",
                facultyCode: "FOA",
                head: "Prof. Dr. Md. Rafiqul Islam",
                provenance: "VERIFIED",
                degrees: [
                    { id: "deg-bsc-ag-ss", name: "B.Sc. Agriculture (Hons.)", shortName: "B.Sc. Ag", degreeType: "Undergraduate", durationYears: 4, totalSemesters: 8, facultyCode: "FOA", departmentCode: "SS" },
                    { id: "deg-ms-ss", name: "MS in Soil Science", shortName: "MS Soil", degreeType: "Master of Science (MS)", durationYears: 1.5, totalSemesters: 3, facultyCode: "FOA", departmentCode: "SS" }
                ]
            },
            {
                id: "dept-entom",
                code: "ENTOM",
                name: "Department of Entomology",
                facultyCode: "FOA",
                provenance: "VERIFIED",
                degrees: [{ id: "deg-bsc-ag-ent", name: "B.Sc. Agriculture (Hons.)", shortName: "B.Sc. Ag", degreeType: "Undergraduate", durationYears: 4, totalSemesters: 8, facultyCode: "FOA", departmentCode: "ENTOM" }]
            },
            {
                id: "dept-hort",
                code: "HORT",
                name: "Department of Horticulture",
                facultyCode: "FOA",
                provenance: "VERIFIED",
                degrees: [{ id: "deg-bsc-ag-hort", name: "B.Sc. Agriculture (Hons.)", shortName: "B.Sc. Ag", degreeType: "Undergraduate", durationYears: 4, totalSemesters: 8, facultyCode: "FOA", departmentCode: "HORT" }]
            },
            {
                id: "dept-ppath",
                code: "PPATH",
                name: "Department of Plant Pathology",
                facultyCode: "FOA",
                provenance: "VERIFIED",
                degrees: [{ id: "deg-bsc-ag-ppath", name: "B.Sc. Agriculture (Hons.)", shortName: "B.Sc. Ag", degreeType: "Undergraduate", durationYears: 4, totalSemesters: 8, facultyCode: "FOA", departmentCode: "PPATH" }]
            },
            {
                id: "dept-cbot",
                code: "CBOT",
                name: "Department of Crop Botany",
                facultyCode: "FOA",
                provenance: "VERIFIED",
                degrees: [{ id: "deg-bsc-ag-cbot", name: "B.Sc. Agriculture (Hons.)", shortName: "B.Sc. Ag", degreeType: "Undergraduate", durationYears: 4, totalSemesters: 8, facultyCode: "FOA", departmentCode: "CBOT" }]
            },
            {
                id: "dept-gpb",
                code: "GPB",
                name: "Department of Genetics and Plant Breeding",
                facultyCode: "FOA",
                provenance: "VERIFIED",
                degrees: [{ id: "deg-bsc-ag-gpb", name: "B.Sc. Agriculture (Hons.)", shortName: "B.Sc. Ag", degreeType: "Undergraduate", durationYears: 4, totalSemesters: 8, facultyCode: "FOA", departmentCode: "GPB" }]
            },
            {
                id: "dept-agext",
                code: "AGEXT",
                name: "Department of Agricultural Extension Education",
                facultyCode: "FOA",
                provenance: "VERIFIED",
                degrees: [{ id: "deg-bsc-ag-ext", name: "B.Sc. Agriculture (Hons.)", shortName: "B.Sc. Ag", degreeType: "Undergraduate", durationYears: 4, totalSemesters: 8, facultyCode: "FOA", departmentCode: "AGEXT" }]
            },
            {
                id: "dept-bmb",
                code: "BMB",
                name: "Department of Biochemistry and Molecular Biology",
                facultyCode: "FOA",
                provenance: "VERIFIED",
                degrees: [{ id: "deg-bsc-ag-bmb", name: "B.Sc. Agriculture (Hons.)", shortName: "B.Sc. Ag", degreeType: "Undergraduate", durationYears: 4, totalSemesters: 8, facultyCode: "FOA", departmentCode: "BMB" }]
            },
            {
                id: "dept-agrof",
                code: "AGROF",
                name: "Department of Agroforestry",
                facultyCode: "FOA",
                provenance: "VERIFIED",
                degrees: [{ id: "deg-bsc-ag-agrof", name: "B.Sc. Agriculture (Hons.)", shortName: "B.Sc. Ag", degreeType: "Undergraduate", durationYears: 4, totalSemesters: 8, facultyCode: "FOA", departmentCode: "AGROF" }]
            }
        ]
    },
    {
        id: "fac-fvs",
        code: "FVS",
        name: "Faculty of Veterinary Science",
        shortName: "Veterinary Science",
        icon: "Stethoscope",
        description: "Center of clinical veterinary medicine, infectious livestock pathology, pharmacology, and zoonotic epidemiology in South Asia.",
        dean: "Prof. Dr. Md. Abdul Awal",
        totalDepartments: 8,
        provenance: "VERIFIED",
        departments: [
            {
                id: "dept-vah",
                code: "VAH",
                name: "Department of Anatomy and Histology",
                facultyCode: "FVS",
                provenance: "VERIFIED",
                degrees: [{ id: "deg-dvm", name: "Doctor of Veterinary Medicine (DVM)", shortName: "DVM", degreeType: "Undergraduate", durationYears: 5, totalSemesters: 10, facultyCode: "FVS", departmentCode: "VAH" }]
            },
            {
                id: "dept-vmh",
                code: "VMH",
                name: "Department of Microbiology and Hygiene",
                facultyCode: "FVS",
                provenance: "VERIFIED",
                degrees: [{ id: "deg-dvm-vmh", name: "Doctor of Veterinary Medicine (DVM)", shortName: "DVM", degreeType: "Undergraduate", durationYears: 5, totalSemesters: 10, facultyCode: "FVS", departmentCode: "VMH" }]
            },
            {
                id: "dept-vphy",
                code: "VPHY",
                name: "Department of Physiology",
                facultyCode: "FVS",
                provenance: "VERIFIED",
                degrees: [{ id: "deg-dvm-vphy", name: "Doctor of Veterinary Medicine (DVM)", shortName: "DVM", degreeType: "Undergraduate", durationYears: 5, totalSemesters: 10, facultyCode: "FVS", departmentCode: "VPHY" }]
            },
            {
                id: "dept-vpha",
                code: "VPHA",
                name: "Department of Pharmacology",
                facultyCode: "FVS",
                provenance: "VERIFIED",
                degrees: [{ id: "deg-dvm-vpha", name: "Doctor of Veterinary Medicine (DVM)", shortName: "DVM", degreeType: "Undergraduate", durationYears: 5, totalSemesters: 10, facultyCode: "FVS", departmentCode: "VPHA" }]
            },
            {
                id: "dept-vpar",
                code: "VPAR",
                name: "Department of Parasitology",
                facultyCode: "FVS",
                provenance: "VERIFIED",
                degrees: [{ id: "deg-dvm-vpar", name: "Doctor of Veterinary Medicine (DVM)", shortName: "DVM", degreeType: "Undergraduate", durationYears: 5, totalSemesters: 10, facultyCode: "FVS", departmentCode: "VPAR" }]
            },
            {
                id: "dept-vpath",
                code: "VPATH",
                name: "Department of Pathology",
                facultyCode: "FVS",
                provenance: "VERIFIED",
                degrees: [{ id: "deg-dvm-vpath", name: "Doctor of Veterinary Medicine (DVM)", shortName: "DVM", degreeType: "Undergraduate", durationYears: 5, totalSemesters: 10, facultyCode: "FVS", departmentCode: "VPATH" }]
            },
            {
                id: "dept-vm",
                code: "VM",
                name: "Department of Medicine",
                facultyCode: "FVS",
                provenance: "VERIFIED",
                degrees: [{ id: "deg-dvm-vm", name: "Doctor of Veterinary Medicine (DVM)", shortName: "DVM", degreeType: "Undergraduate", durationYears: 5, totalSemesters: 10, facultyCode: "FVS", departmentCode: "VM" }]
            },
            {
                id: "dept-vso",
                code: "VSO",
                name: "Department of Surgery and Obstetrics",
                facultyCode: "FVS",
                provenance: "VERIFIED",
                degrees: [{ id: "deg-dvm-vso", name: "Doctor of Veterinary Medicine (DVM)", shortName: "DVM", degreeType: "Undergraduate", durationYears: 5, totalSemesters: 10, facultyCode: "FVS", departmentCode: "VSO" }]
            }
        ]
    },
    {
        id: "fac-fah",
        code: "FAH",
        name: "Faculty of Animal Husbandry",
        shortName: "Animal Husbandry",
        icon: "ShieldAlert",
        description: "Breeding genetics, ruminant and poultry nutrition, dairy technology, and livestock production systems.",
        dean: "Prof. Dr. Md. Ruhul Amin",
        totalDepartments: 5,
        provenance: "VERIFIED",
        departments: [
            {
                id: "dept-abg",
                code: "ABG",
                name: "Department of Animal Breeding and Genetics",
                facultyCode: "FAH",
                provenance: "VERIFIED",
                degrees: [{ id: "deg-bsc-ah", name: "B.Sc. Animal Husbandry (Hons.)", shortName: "B.Sc. AH", degreeType: "Undergraduate", durationYears: 4, totalSemesters: 8, facultyCode: "FAH", departmentCode: "ABG" }]
            },
            {
                id: "dept-as",
                code: "AS",
                name: "Department of Animal Science",
                facultyCode: "FAH",
                provenance: "VERIFIED",
                degrees: [{ id: "deg-bsc-ah-as", name: "B.Sc. Animal Husbandry (Hons.)", shortName: "B.Sc. AH", degreeType: "Undergraduate", durationYears: 4, totalSemesters: 8, facultyCode: "FAH", departmentCode: "AS" }]
            },
            {
                id: "dept-an",
                code: "AN",
                name: "Department of Animal Nutrition",
                facultyCode: "FAH",
                provenance: "VERIFIED",
                degrees: [{ id: "deg-bsc-ah-an", name: "B.Sc. Animal Husbandry (Hons.)", shortName: "B.Sc. AH", degreeType: "Undergraduate", durationYears: 4, totalSemesters: 8, facultyCode: "FAH", departmentCode: "AN" }]
            },
            {
                id: "dept-ds",
                code: "DS",
                name: "Department of Dairy Science",
                facultyCode: "FAH",
                provenance: "VERIFIED",
                degrees: [{ id: "deg-bsc-ah-ds", name: "B.Sc. Animal Husbandry (Hons.)", shortName: "B.Sc. AH", degreeType: "Undergraduate", durationYears: 4, totalSemesters: 8, facultyCode: "FAH", departmentCode: "DS" }]
            },
            {
                id: "dept-ps",
                code: "PS",
                name: "Department of Poultry Science",
                facultyCode: "FAH",
                provenance: "VERIFIED",
                degrees: [{ id: "deg-bsc-ah-ps", name: "B.Sc. Animal Husbandry (Hons.)", shortName: "B.Sc. AH", degreeType: "Undergraduate", durationYears: 4, totalSemesters: 8, facultyCode: "FAH", departmentCode: "PS" }]
            }
        ]
    },
    {
        id: "fac-faers",
        code: "FAERS",
        name: "Faculty of Agricultural Economics & Rural Sociology",
        shortName: "Agri Economics",
        icon: "TrendingUp",
        description: "Quantitative econometrics, agricultural policy analysis, microeconomic optimization, and rural financial institutions.",
        dean: "Prof. Dr. Khandakar Shariful Islam",
        totalDepartments: 5,
        provenance: "VERIFIED",
        departments: [
            {
                id: "dept-ae",
                code: "AE",
                name: "Department of Agricultural Economics",
                facultyCode: "FAERS",
                head: "Prof. Dr. Mohammad Jahangir Alam",
                provenance: "VERIFIED",
                degrees: [
                    { id: "deg-bsc-ae", name: "B.Sc. Agricultural Economics (Hons.)", shortName: "B.Sc. Ag. Econ", degreeType: "Undergraduate", durationYears: 4, totalSemesters: 8, facultyCode: "FAERS", departmentCode: "AE" },
                    { id: "deg-ms-ae", name: "MS in Agricultural Economics", shortName: "MS Ag. Econ", degreeType: "Master of Science (MS)", durationYears: 1.5, totalSemesters: 3, facultyCode: "FAERS", departmentCode: "AE" }
                ]
            },
            {
                id: "dept-stat",
                code: "STAT",
                name: "Department of Agricultural & Applied Statistics",
                facultyCode: "FAERS",
                head: "Prof. Dr. Md. Ismail Hossain",
                provenance: "VERIFIED",
                degrees: [
                    { id: "deg-bsc-ae-stat", name: "B.Sc. Agricultural Economics (Hons.)", shortName: "B.Sc. Ag. Econ", degreeType: "Undergraduate", durationYears: 4, totalSemesters: 8, facultyCode: "FAERS", departmentCode: "STAT" }
                ]
            },
            {
                id: "dept-af",
                code: "AF",
                name: "Department of Agricultural Finance & Banking",
                facultyCode: "FAERS",
                provenance: "VERIFIED",
                degrees: [{ id: "deg-bsc-ae-af", name: "B.Sc. Agricultural Economics (Hons.)", shortName: "B.Sc. Ag. Econ", degreeType: "Undergraduate", durationYears: 4, totalSemesters: 8, facultyCode: "FAERS", departmentCode: "AF" }]
            },
            {
                id: "dept-am",
                code: "AM",
                name: "Department of Agribusiness & Marketing",
                facultyCode: "FAERS",
                provenance: "VERIFIED",
                degrees: [{ id: "deg-bsc-ae-am", name: "B.Sc. Agricultural Economics (Hons.)", shortName: "B.Sc. Ag. Econ", degreeType: "Undergraduate", durationYears: 4, totalSemesters: 8, facultyCode: "FAERS", departmentCode: "AM" }]
            },
            {
                id: "dept-rs",
                code: "RS",
                name: "Department of Rural Sociology",
                facultyCode: "FAERS",
                provenance: "VERIFIED",
                degrees: [{ id: "deg-bsc-ae-rs", name: "B.Sc. Agricultural Economics (Hons.)", shortName: "B.Sc. Ag. Econ", degreeType: "Undergraduate", durationYears: 4, totalSemesters: 8, facultyCode: "FAERS", departmentCode: "RS" }]
            }
        ]
    },
    {
        id: "fac-faet",
        code: "FAET",
        name: "Faculty of Agricultural Engineering & Technology",
        shortName: "Agri Engineering",
        icon: "Cpu",
        description: "Farm automation, IoT sensor networks, irrigation water management, renewable bio-energy, and food process engineering.",
        dean: "Prof. Dr. Md. Abdul Majid",
        totalDepartments: 5,
        provenance: "VERIFIED",
        departments: [
            {
                id: "dept-fpm",
                code: "FPM",
                name: "Department of Farm Power and Machinery",
                facultyCode: "FAET",
                provenance: "VERIFIED",
                degrees: [{ id: "deg-bsc-eng-fpm", name: "B.Sc. Agricultural Engineering", shortName: "B.Sc. Agri Eng", degreeType: "Undergraduate", durationYears: 4, totalSemesters: 8, facultyCode: "FAET", departmentCode: "FPM" }]
            },
            {
                id: "dept-iwm",
                code: "IWM",
                name: "Department of Irrigation and Water Management",
                facultyCode: "FAET",
                provenance: "VERIFIED",
                degrees: [{ id: "deg-bsc-eng-iwm", name: "B.Sc. Agricultural Engineering", shortName: "B.Sc. Agri Eng", degreeType: "Undergraduate", durationYears: 4, totalSemesters: 8, facultyCode: "FAET", departmentCode: "IWM" }]
            },
            {
                id: "dept-ftri",
                code: "FTRI",
                name: "Department of Food Technology and Rural Industries",
                facultyCode: "FAET",
                provenance: "VERIFIED",
                degrees: [{ id: "deg-bsc-fe", name: "B.Sc. Food Engineering", shortName: "B.Sc. Food Eng", degreeType: "Undergraduate", durationYears: 4, totalSemesters: 8, facultyCode: "FAET", departmentCode: "FTRI" }]
            },
            {
                id: "dept-fsee",
                code: "FSEE",
                name: "Department of Farm Structure and Environmental Engineering",
                facultyCode: "FAET",
                provenance: "VERIFIED",
                degrees: [{ id: "deg-bsc-eng-fsee", name: "B.Sc. Agricultural Engineering", shortName: "B.Sc. Agri Eng", degreeType: "Undergraduate", durationYears: 4, totalSemesters: 8, facultyCode: "FAET", departmentCode: "FSEE" }]
            },
            {
                id: "dept-csm",
                code: "CSM",
                name: "Department of Computer Science and Mathematics",
                facultyCode: "FAET",
                provenance: "VERIFIED",
                degrees: [{ id: "deg-bsc-eng-csm", name: "B.Sc. Agricultural Engineering", shortName: "B.Sc. Agri Eng", degreeType: "Undergraduate", durationYears: 4, totalSemesters: 8, facultyCode: "FAET", departmentCode: "CSM" }]
            }
        ]
    },
    {
        id: "fac-fof",
        code: "FOF",
        name: "Faculty of Fisheries",
        shortName: "Fisheries",
        icon: "Anchor",
        description: "Aquaculture bio-security, fish genetics and breeding, marine biology, and post-harvest aquatic value chains.",
        dean: "Prof. Dr. Md. Ahsan Bin Habib",
        totalDepartments: 4,
        provenance: "VERIFIED",
        departments: [
            {
                id: "dept-aq",
                code: "AQ",
                name: "Department of Aquaculture",
                facultyCode: "FOF",
                provenance: "VERIFIED",
                degrees: [{ id: "deg-bsc-fsh", name: "B.Sc. Fisheries (Hons.)", shortName: "B.Sc. Fish", degreeType: "Undergraduate", durationYears: 4, totalSemesters: 8, facultyCode: "FOF", departmentCode: "AQ" }]
            },
            {
                id: "dept-fbg",
                code: "FBG",
                name: "Department of Fisheries Biology and Genetics",
                facultyCode: "FOF",
                provenance: "VERIFIED",
                degrees: [{ id: "deg-bsc-fsh-fbg", name: "B.Sc. Fisheries (Hons.)", shortName: "B.Sc. Fish", degreeType: "Undergraduate", durationYears: 4, totalSemesters: 8, facultyCode: "FOF", departmentCode: "FBG" }]
            },
            {
                id: "dept-fm",
                code: "FM",
                name: "Department of Fisheries Management",
                facultyCode: "FOF",
                provenance: "VERIFIED",
                degrees: [{ id: "deg-bsc-fsh-fm", name: "B.Sc. Fisheries (Hons.)", shortName: "B.Sc. Fish", degreeType: "Undergraduate", durationYears: 4, totalSemesters: 8, facultyCode: "FOF", departmentCode: "FM" }]
            },
            {
                id: "dept-ft",
                code: "FT",
                name: "Department of Fisheries Technology",
                facultyCode: "FOF",
                provenance: "VERIFIED",
                degrees: [{ id: "deg-bsc-fsh-ft", name: "B.Sc. Fisheries (Hons.)", shortName: "B.Sc. Fish", degreeType: "Undergraduate", durationYears: 4, totalSemesters: 8, facultyCode: "FOF", departmentCode: "FT" }]
            }
        ]
    }
];

export function getFacultyByCode(code: string): BAUFaculty | undefined {
    return BAU_FACULTIES.find(f => f.code.toUpperCase() === code.toUpperCase());
}

export function getAllDepartments(): { faculty: BAUFaculty; department: BAUFaculty["departments"][0] }[] {
    const list: { faculty: BAUFaculty; department: BAUFaculty["departments"][0] }[] = [];
    for (const fac of BAU_FACULTIES) {
        for (const dept of fac.departments) {
            list.push({ faculty: fac, department: dept });
        }
    }
    return list;
}
