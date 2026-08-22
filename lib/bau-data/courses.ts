// lib/bau-data/courses.ts
// Authentic BAU Course Catalog, Syllabi, Modules, and Prerequisite Knowledge Maps.
// Provenance: Official BAU Academic Ordinances, Faculty Syllabi & Curriculum Mapping.

import type { BAUCourse } from "@/types/bau";

export const BAU_COURSES: BAUCourse[] = [
    {
        id: "course-aas-2107",
        code: "AAS 2107",
        title: "Statistical Inference & Agricultural Experimentation",
        slug: "aas-2107-statistical-inference",
        facultyCode: "FAERS",
        departmentCode: "STAT",
        degreeId: "deg-bsc-ae",
        level: 2,
        semester: 1,
        credits: {
            theoryCredits: 2,
            practicalCredits: 1,
            totalCredits: 3,
            theoryHoursPerWeek: 2,
            practicalHoursPerWeek: 3,
        },
        description: "Comprehensive foundation in statistical inference, parametric and non-parametric hypothesis testing, ANOVA, linear regression, and agricultural field experiment design (RCBD, CRD, Split-Plot).",
        objectives: [
            "Formulate and evaluate null and alternative hypotheses for agricultural and economic datasets.",
            "Conduct Z-test, two-sample Student's t-test, Paired t-test, and Chi-square test of independence.",
            "Construct Analysis of Variance (ANOVA) models for agricultural yield trials.",
            "Apply R and SPSS commands to compute p-values, confidence intervals, and test diagnostics."
        ],
        prerequisites: [
            {
                courseCode: "AAS 1101",
                courseTitle: "Descriptive Statistics & Probability",
                requiredGrade: "C+",
                reason: "Requires fundamental knowledge of random variables, normal distribution, and probability density functions."
            }
        ],
        modules: [
            {
                id: "aas-m1",
                moduleNumber: 1,
                title: "Probability Distributions & Sampling Theory",
                description: "Standard normal distribution, Student's t-distribution, Fisher's F-distribution, and Central Limit Theorem.",
                topics: [
                    {
                        id: "aas-t1-1",
                        title: "Sampling Distributions & Standard Error",
                        description: "Derivation of sample mean distribution, standard error calculations, and finite population correction factor.",
                        estimatedMinutes: 25,
                        isKeyExamTopic: true,
                        learningOutcomes: [
                            "Differentiate standard deviation from standard error of the mean.",
                            "Apply Central Limit Theorem to sample sizes n >= 30."
                        ]
                    },
                    {
                        id: "aas-t1-2",
                        title: "Point Estimation & Confidence Intervals",
                        description: "Unbiasedness, efficiency, consistency, and maximum likelihood estimation (MLE). Constructing 95% and 99% confidence intervals.",
                        estimatedMinutes: 30,
                        isKeyExamTopic: true,
                        learningOutcomes: [
                            "Calculate symmetric confidence limits using t-critical values.",
                            "Interpret margin of error in crop sample surveys."
                        ]
                    }
                ]
            },
            {
                id: "aas-m2",
                moduleNumber: 2,
                title: "Hypothesis Testing & Significance Tests",
                description: "Formulation of Null ($H_0$) and Alternative ($H_1$) hypotheses, Type I and Type II errors, and power of the test.",
                topics: [
                    {
                        id: "aas-t2-1",
                        title: "One-Sample & Two-Sample Student's t-Test",
                        description: "Comparing sample mean against known benchmark; independent two-sample t-test with pooled variance.",
                        estimatedMinutes: 35,
                        isKeyExamTopic: true,
                        learningOutcomes: [
                            "Execute independent t-tests for crop fertilizer treatment groups.",
                            "Formulate decision rules using p-value and critical region bounds."
                        ]
                    },
                    {
                        id: "aas-t2-2",
                        title: "Paired t-Test & Chi-Square Independence",
                        description: "Pre-test vs. post-test paired observations and 2x2 contingency tables with Yates' continuity correction.",
                        estimatedMinutes: 30,
                        isKeyExamTopic: true,
                        learningOutcomes: [
                            "Evaluate paired milk yield before and after feed additive introduction.",
                            "Perform Chi-square test for seed germination trait independence."
                        ]
                    }
                ]
            },
            {
                id: "aas-m3",
                moduleNumber: 3,
                title: "Analysis of Variance (ANOVA) & Experimental Designs",
                description: "Completely Randomized Design (CRD), Randomized Complete Block Design (RCBD), and Duncan's Multiple Range Test (DMRT).",
                topics: [
                    {
                        id: "aas-t3-1",
                        title: "One-Way ANOVA & F-Test Derivations",
                        description: "Partitioning total sum of squares into Between-Group and Within-Group variance components.",
                        estimatedMinutes: 40,
                        isKeyExamTopic: true,
                        learningOutcomes: [
                            "Construct standard ANOVA summary tables.",
                            "Compute F-ratio and evaluate significance against F-distribution tables."
                        ]
                    },
                    {
                        id: "aas-t3-2",
                        title: "RCBD & Post-Hoc Mean Separation (LSD/DMRT)",
                        description: "Blocking environmental field gradient effects and post-hoc pairwise comparisons.",
                        estimatedMinutes: 35,
                        isKeyExamTopic: true,
                        learningOutcomes: [
                            "Perform Least Significant Difference (LSD) testing at alpha = 0.05.",
                            "Control soil fertility gradients in BAU Farm field plots."
                        ]
                    }
                ]
            }
        ],
        practicalModules: [
            {
                id: "aas-p1",
                moduleNumber: 1,
                title: "Statistical Computing in R & SPSS Lab",
                description: "Hands-on data analysis using R scripts for t-test, ANOVA, and linear regression models.",
                topics: [
                    {
                        id: "aas-p1-1",
                        title: "R Scripting: t.test() and aov() execution",
                        description: "Importing CSV field trial data, checking normality with Shapiro-Wilk test, and running ANOVA models in R.",
                        estimatedMinutes: 45,
                        isKeyExamTopic: true,
                        learningOutcomes: ["Write reproducible R scripts for BAU field trial analysis."]
                    }
                ]
            }
        ],
        recommendedBooks: [
            "Gomez, K. A., & Gomez, A. A. (1984). Statistical Procedures for Agricultural Research. John Wiley & Sons.",
            "Islam, M. N. (2018). An Introduction to Statistics and Probability. Book World, Dhaka.",
            "Montgomery, D. C. (2017). Design and Analysis of Experiments. Wiley."
        ],
        provenance: "VERIFIED",
        sourceReference: "BAU FAERS Official Course Syllabus 2024-2025",
        enrolledCount: 142,
        averageGrade: "3.48",
        instructor: {
            name: "Dr. Mohammad Jahangir Alam",
            designation: "Professor, Department of Agricultural Economics",
            email: "mjahangir.alam@bau.edu.bd",
            photoUrl: "https://erp.bau.edu.bd/public/photos/employee_photo/f80799322a37673b7f2ce5de32c361a8.jpg"
        }
    },
    {
        id: "course-ae-2111",
        code: "AE 2111",
        title: "Advanced Microeconomics & Production Economics",
        slug: "ae-2111-advanced-microeconomics",
        facultyCode: "FAERS",
        departmentCode: "AE",
        degreeId: "deg-bsc-ae",
        level: 2,
        semester: 1,
        credits: {
            theoryCredits: 3,
            practicalCredits: 0,
            totalCredits: 3,
            theoryHoursPerWeek: 3,
            practicalHoursPerWeek: 0,
        },
        description: "Consumer behavior theory, Cobb-Douglas & CES production functions, profit maximization, cost duality, risk and uncertainty in agrarian markets, and general equilibrium models.",
        objectives: [
            "Derive Marshallian and Hicksian demand curves via Lagrangian optimization.",
            "Analyze neoclassical agricultural production functions (Stages I, II, III).",
            "Calculate Marginal Rate of Technical Substitution (MRTS) and Elasticity of Substitution.",
            "Model price volatility under Cobweb theorem in Bangladesh rice and jute markets."
        ],
        prerequisites: [
            {
                courseCode: "AE 1101",
                courseTitle: "Principles of Microeconomics",
                requiredGrade: "B-",
                reason: "Requires understanding of utility maximization and supply-demand equilibrium."
            }
        ],
        modules: [
            {
                id: "ae-m1",
                moduleNumber: 1,
                title: "Advanced Theory of Consumer Choice",
                description: "Indifference curves, budget constraints, Slutsky equation decomposition (income and substitution effects), and revealed preference theory.",
                topics: [
                    {
                        id: "ae-t1-1",
                        title: "Slutsky Equation & Compensated Demand",
                        description: "Mathematical derivation of price changes into pure substitution effect and real income effect for normal and Giffen goods.",
                        estimatedMinutes: 30,
                        isKeyExamTopic: true,
                        learningOutcomes: ["Calculate compensated price elasticity using Slutsky decomposition."]
                    }
                ]
            },
            {
                id: "ae-m2",
                moduleNumber: 2,
                title: "Theory of Production & Neoclassical Cost",
                description: "Cobb-Douglas production function properties, returns to scale, expansion paths, and cost minimization duality.",
                topics: [
                    {
                        id: "ae-t2-1",
                        title: "Cobb-Douglas Production Functions & Euler's Theorem",
                        description: "Elasticity of output with respect to labor and capital; testing constant, increasing, and decreasing returns to scale.",
                        estimatedMinutes: 35,
                        isKeyExamTopic: true,
                        learningOutcomes: ["Determine optimal input ratio where MRTS equals input price ratio (w/r)."]
                    }
                ]
            }
        ],
        recommendedBooks: [
            "Varian, H. R. (2014). Intermediate Microeconomics: A Modern Approach. W.W. Norton.",
            "Debertin, D. L. (2012). Agricultural Production Economics. CreateSpace.",
            "Sadoulet, E., & de Janvry, A. (1995). Quantitative Development Policy Analysis. Johns Hopkins."
        ],
        provenance: "VERIFIED",
        sourceReference: "BAU Faculty of Agricultural Economics Curriculum",
        enrolledCount: 138,
        averageGrade: "3.55",
        instructor: {
            name: "Dr. Mohammad Ismail Hossain",
            designation: "Professor, Department of Agricultural Economics",
            email: "m.ismail_hossain@bau.edu.bd"
        }
    },
    {
        id: "course-agron-1101",
        code: "AGRON 1101",
        title: "Fundamentals of Agronomy & Crop Production",
        slug: "agron-1101-fundamentals-of-agronomy",
        facultyCode: "FOA",
        departmentCode: "AGRON",
        degreeId: "deg-bsc-ag",
        level: 1,
        semester: 1,
        credits: {
            theoryCredits: 3,
            practicalCredits: 1,
            totalCredits: 4,
            theoryHoursPerWeek: 3,
            practicalHoursPerWeek: 3,
        },
        description: "Principles of field crop production, agro-climatic zones of Bangladesh, seed viability, tillage practices, cropping patterns (Aman, Boro, Aus), weed management, and nutrient scheduling.",
        objectives: [
            "Identify major field crops and agro-ecological zones (AEZ) of Bangladesh.",
            "Calculate seed rate, plant population density, and fertilizer requirement.",
            "Explain physiological phases of rice growth and critical irrigation stages.",
            "Demonstrate weed identification and integrated weed management (IWM)."
        ],
        prerequisites: [],
        modules: [
            {
                id: "agron-m1",
                moduleNumber: 1,
                title: "Agro-Ecological Zones & Agronomic Classification",
                description: "30 Agro-Ecological Zones (AEZs) of Bangladesh, soil-physiography relationships, and crop seasonal classifications (Kharif-I, Kharif-II, Rabi).",
                topics: [
                    {
                        id: "agron-t1-1",
                        title: "AEZs of Bangladesh & Seasonality",
                        description: "Climatic characteristics, flooding depth, and dominant cropping systems across Old Himalayan Piedmont Plain, Barind Tract, and Haor Basin.",
                        estimatedMinutes: 30,
                        isKeyExamTopic: true,
                        learningOutcomes: ["Map crop varieties to specific AEZs in Bangladesh."]
                    }
                ]
            },
            {
                id: "agron-m2",
                moduleNumber: 2,
                title: "Seed Technology, Sowing & Plant Population",
                description: "Seed dormancy breaking, germination testing, real value of seed, and row-spacing calculations for yield optimization.",
                topics: [
                    {
                        id: "agron-t2-1",
                        title: "Seed Rate Formulae & Germination Percentage",
                        description: "Calculating seed requirement (kg/ha) adjusting for purity %, germination %, and expected field emergence.",
                        estimatedMinutes: 25,
                        isKeyExamTopic: true,
                        learningOutcomes: ["Solve real-world seed rate calculation problems for Boro rice and wheat."]
                    }
                ]
            }
        ],
        practicalModules: [
            {
                id: "agron-p1",
                moduleNumber: 1,
                title: "BAU Agronomy Field Laboratory Practical",
                description: "Field identification of crop seeds, fertilizers, weeds, and calculation of field plot layouts.",
                topics: [
                    {
                        id: "agron-p1-1",
                        title: "Weed & Crop Seed Identification",
                        description: "Visual diagnosis of 30 common crop weeds (Echinochloa crus-galli, Cyperus rotundus) and seed purity assessment.",
                        estimatedMinutes: 40,
                        isKeyExamTopic: true,
                        learningOutcomes: ["Identify common weeds and state their scientific names."]
                    }
                ]
            }
        ],
        recommendedBooks: [
            "Reddy, T. Y., & Reddi, G. H. S. (2016). Principles of Agronomy. Kalyani Publishers.",
            "BARC (2018). Fertilizer Recommendation Guide. Bangladesh Agricultural Research Council.",
            "De Datta, S. K. (1981). Principles and Practices of Rice Production. John Wiley & Sons."
        ],
        provenance: "VERIFIED",
        sourceReference: "BAU Faculty of Agriculture Syllabus 2024",
        enrolledCount: 310,
        averageGrade: "3.62",
        instructor: {
            name: "Prof. Dr. Md. Abdus Salam",
            designation: "Professor, Department of Agronomy",
            email: "abdus.salam@bau.edu.bd"
        }
    },
    {
        id: "course-vmh-2101",
        code: "VMH 2101",
        title: "Veterinary Microbiology & Immunology",
        slug: "vmh-2101-veterinary-microbiology",
        facultyCode: "FVS",
        departmentCode: "VMH",
        degreeId: "deg-dvm",
        level: 2,
        semester: 1,
        credits: {
            theoryCredits: 3,
            practicalCredits: 1,
            totalCredits: 4,
            theoryHoursPerWeek: 3,
            practicalHoursPerWeek: 3,
        },
        description: "Morphology, pathogenesis, and culture of veterinary bacteria, viruses, and fungi. Antigen-antibody interactions, humoral and cell-mediated immunity, and vaccine development against anthrax, FMD, and PPR.",
        objectives: [
            "Classify major bacterial and viral pathogens affecting cattle, sheep, goats, and poultry in Bangladesh.",
            "Describe the replication cycle and antigenic variation of Foot and Mouth Disease (FMD) virus.",
            "Conduct Gram staining, acid-fast staining, and antibiotic susceptibility testing in the lab.",
            "Formulate vaccination regimens for commercial poultry and dairy farms."
        ],
        prerequisites: [],
        modules: [
            {
                id: "vmh-m1",
                moduleNumber: 1,
                title: "Bacterial Pathogenesis & Toxins",
                description: "Endotoxins vs. exotoxins, virulence factors of Bacillus anthracis, Pasteurella multocida, and Salmonella enterica.",
                topics: [
                    {
                        id: "vmh-t1-1",
                        title: "Anthrax & Hemorrhagic Septicemia (HS)",
                        description: "Capsular antigens, protective toxin components, spore survival in soil, and post-mortem diagnostic precautions.",
                        estimatedMinutes: 35,
                        isKeyExamTopic: true,
                        learningOutcomes: ["Explain why anthrax carcasses must never be opened for autopsy."]
                    }
                ]
            }
        ],
        recommendedBooks: [
            "Quinn, P. J. et al. (2011). Veterinary Microbiology and Microbial Disease. Wiley-Blackwell.",
            "Tizard, I. R. (2018). Veterinary Immunology. Elsevier."
        ],
        provenance: "VERIFIED",
        sourceReference: "BAU Faculty of Veterinary Science Bulletin",
        enrolledCount: 185,
        averageGrade: "3.50",
        instructor: {
            name: "Prof. Dr. Md. Abdul Awal",
            designation: "Dean & Professor, Faculty of Veterinary Science",
            email: "awal.vet@bau.edu.bd"
        }
    },
    {
        id: "course-abg-3101",
        code: "ABG 3101",
        title: "Molecular Genetics & Animal Breeding Systems",
        slug: "abg-3101-molecular-genetics-animal-breeding",
        facultyCode: "FAH",
        departmentCode: "ABG",
        degreeId: "deg-bsc-ah",
        level: 3,
        semester: 1,
        credits: {
            theoryCredits: 2,
            practicalCredits: 1,
            totalCredits: 3,
            theoryHoursPerWeek: 2,
            practicalHoursPerWeek: 3,
        },
        description: "Hardy-Weinberg equilibrium, gene and genotype frequencies, selection index theory, BLUP estimation, breeding value prediction, and genomic selection in Red Chittagong Cattle and Black Bengal Goat.",
        objectives: [
            "Calculate gene and genotype frequencies under forces of selection and mutation.",
            "Estimate heritability ($h^2$) and repeatability using paternal half-sib analysis.",
            "Construct multi-trait selection indexes for milk yield and lactation length."
        ],
        prerequisites: [],
        modules: [
            {
                id: "abg-m1",
                moduleNumber: 1,
                title: "Population Genetics & Selection Pressure",
                description: "Equilibrium principles, inbreeding coefficient ($F$), and effective population size ($N_e$).",
                topics: [
                    {
                        id: "abg-t1-1",
                        title: "Hardy-Weinberg Law & Inbreeding Calculation",
                        description: "Testing deviation from equilibrium with Chi-square goodness-of-fit in indigenous livestock populations.",
                        estimatedMinutes: 30,
                        isKeyExamTopic: true,
                        learningOutcomes: ["Calculate Wright's inbreeding coefficient from pedigree charts."]
                    }
                ]
            }
        ],
        recommendedBooks: [
            "Falconer, D. S., & Mackay, T. F. (1996). Introduction to Quantitative Genetics. Longman.",
            "Bourdon, R. M. (2013). Understanding Animal Breeding. Pearson."
        ],
        provenance: "VERIFIED",
        sourceReference: "BAU Faculty of Animal Husbandry Syllabus",
        enrolledCount: 120,
        averageGrade: "3.58",
        instructor: {
            name: "Prof. Dr. Md. Ruhul Amin",
            designation: "Professor, Animal Breeding and Genetics",
            email: "ruhul.amin@bau.edu.bd"
        }
    },
    {
        id: "course-aq-2101",
        code: "AQ 2101",
        title: "Aquaculture Limnology & Water Quality Dynamics",
        slug: "aq-2101-aquaculture-limnology",
        facultyCode: "FOF",
        departmentCode: "AQ",
        degreeId: "deg-bsc-fsh",
        level: 2,
        semester: 1,
        credits: {
            theoryCredits: 2,
            practicalCredits: 1,
            totalCredits: 3,
            theoryHoursPerWeek: 2,
            practicalHoursPerWeek: 3,
        },
        description: "Physicochemical and biological parameters of aquaculture ponds, dissolved oxygen diurnal curves, nitrogen cycles, phytoplankton blooms, and biofloc management in commercial pangas, tilapia, and shrimp farming.",
        objectives: [
            "Monitor critical water quality parameters: DO, pH, total ammonia nitrogen (TAN), alkalinity, and hardness.",
            "Explain the dynamics of morning oxygen depletion and emergency aeration protocols.",
            "Design biofloc and recirculating aquaculture systems (RAS) for high-density culture."
        ],
        prerequisites: [],
        modules: [
            {
                id: "aq-m1",
                moduleNumber: 1,
                title: "Dissolved Oxygen Dynamics & Nitrogen Transformations",
                description: "Photosynthesis-respiration balance, un-ionized ammonia ($NH_3$) toxicity, and nitrification pathways.",
                topics: [
                    {
                        id: "aq-t1-1",
                        title: "Diurnal Oxygen Curve & TAN Equilibrium",
                        description: "Modeling pH-dependent ammonia-ammonium equilibrium in intensive fish culture ponds.",
                        estimatedMinutes: 30,
                        isKeyExamTopic: true,
                        learningOutcomes: ["Calculate toxic free ammonia concentration at given pH and temperature."]
                    }
                ]
            }
        ],
        recommendedBooks: [
            "Boyd, C. E. (2019). Water Quality: An Introduction. Springer.",
            "Pillay, T. V. R., & Kutty, M. N. (2005). Aquaculture: Principles and Practices. Blackwell."
        ],
        provenance: "VERIFIED",
        sourceReference: "BAU Faculty of Fisheries Curriculum",
        enrolledCount: 115,
        averageGrade: "3.60",
        instructor: {
            name: "Prof. Dr. Md. Ahsan Bin Habib",
            designation: "Professor, Department of Aquaculture",
            email: "ahsan.habib@bau.edu.bd"
        }
    }
];

export function getCourseByCode(code: string): BAUCourse | undefined {
    return BAU_COURSES.find(c => c.code.replace(/\s+/g, "").toUpperCase() === code.replace(/\s+/g, "").toUpperCase());
}

export function getCourseBySlug(slug: string): BAUCourse | undefined {
    return BAU_COURSES.find(c => c.slug === slug || c.id === slug || c.code.toLowerCase().replace(/\s+/g, "-") === slug.toLowerCase());
}

export function getCoursesByFaculty(facultyCode: string): BAUCourse[] {
    return BAU_COURSES.filter(c => c.facultyCode.toUpperCase() === facultyCode.toUpperCase());
}

export function getCoursesByLevelSemester(level: number, semester: number, facultyCode?: string): BAUCourse[] {
    return BAU_COURSES.filter(c => {
        const matchesLS = c.level === level && c.semester === semester;
        if (facultyCode) {
            return matchesLS && c.facultyCode.toUpperCase() === facultyCode.toUpperCase();
        }
        return matchesLS;
    });
}
