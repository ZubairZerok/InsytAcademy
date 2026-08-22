// lib/bau-data/field-specimens.ts
// Multimodal Agricultural, Veterinary, Soil, and Aquaculture Field Specimens for Gemini Vision Diagnostics.
// Provenance: BAU Field Laboratory & Departmental Specimen Archives.

import type { FieldSpecimen } from "@/types/bau";

export const BAU_FIELD_SPECIMENS: FieldSpecimen[] = [
    {
        id: "spec-rice-blast",
        name: "Rice Blast (Magnaporthe oryzae)",
        category: "Crop Pathology",
        commonName: "Leaf and Neck Blast of Paddy",
        scientificName: "Magnaporthe oryzae (Pyricularia oryzae)",
        relatedCourseCode: "PPATH 2101",
        imageUrl: "https://images.unsplash.com/photo-1599813398327-024843d1a3eb?auto=format&fit=crop&w=800&q=80",
        symptomsOrCharacteristics: [
            "Spindle-shaped or eye-shaped lesions with gray/whitish centers and dark brown margins.",
            "Lesions enlarge and coalesce during high relative humidity (>90%) and cloudy weather.",
            "Neck infection causes complete panicle blanking and lodging in BRRI dhan28/29."
        ],
        educationalNotes: "Rice blast is the most devastating fungal disease in Bangladesh's Boro and Aman seasons. Airborne conidia infect through appressoria formation. Trikicyclazole or Isoprothiolane spraying at booting stage provides effective management.",
        managementOrPracticalTask: "Collect leaf samples from BAU Agronomy Field Block B. Prepare a water mount slide to observe pyriform three-celled hyaline conidia under 40x magnification.",
        safetyCaution: "Educational interpretation only. For commercial crop spray prescriptions, verify field symptoms with the Upazila Agriculture Officer (DAE).",
        provenance: "VERIFIED"
    },
    {
        id: "spec-blb-rice",
        name: "Bacterial Leaf Blight (BLB)",
        category: "Crop Pathology",
        commonName: "Bacterial Blight of Rice",
        scientificName: "Xanthomonas oryzae pv. oryzae",
        relatedCourseCode: "PPATH 2101",
        imageUrl: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=800&q=80",
        symptomsOrCharacteristics: [
            "Water-soaked to yellowish-white wavy stripes starting from leaf tips and margins.",
            "Milky bacterial ooze beads on young leaves in early morning hours.",
            "Systemic 'kresek' wilting phase in seedlings within 3-4 weeks of transplanting."
        ],
        educationalNotes: "Enters through hydathodes or mechanical clipping wounds during transplanting. Unlike fungal blast, lesions have irregular wavy margins without eye-shaped rings.",
        managementOrPracticalTask: "Perform the Bacterial Ooze Test: Cut a fresh leaf blade across the lesion border, immerse in a clean test tube with water, and observe turbid streaming of bacterial strands against light.",
        safetyCaution: "Ensure clean shears when clipping leaves to avoid spreading inocula between test plots.",
        provenance: "VERIFIED"
    },
    {
        id: "spec-liver-fluke",
        name: "Giant Liver Fluke (Fasciola gigantica)",
        category: "Veterinary Parasitology",
        commonName: "Tropical Liver Fluke of Cattle & Buffalo",
        scientificName: "Fasciola gigantica",
        relatedCourseCode: "VPAR 2101",
        imageUrl: "https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?auto=format&fit=crop&w=800&q=80",
        symptomsOrCharacteristics: [
            "Large leaf-like flat trematode worm (25-75 mm in length) with prominent cephalic cone.",
            "Hyperplastic cholangitis and pipe-stem calcification of bovine bile ducts.",
            "Submandibular bottle-jaw edema, severe anemia, and emaciation in grazing ruminants."
        ],
        educationalNotes: "Intermediate host is the freshwater aquatic snail Lymnaea auricularia. Cattle contract metacercariae by grazing on infected aquatic weeds (water hyacinth). Triclabendazole is the drug of choice.",
        managementOrPracticalTask: "Examine sedimentation fecal smear under microscope to identify large operculated golden-yellow eggs (130-150 microns).",
        safetyCaution: "Zoonotic potential exists if raw infected watercress is consumed. Wear protective gloves during parasitology dissection.",
        provenance: "VERIFIED"
    },
    {
        id: "spec-saline-soil",
        name: "Coastal Saline Soil Profile (AEZ 13)",
        category: "Soil Science",
        commonName: "Ganges Tidal Floodplain Saline Crust",
        relatedCourseCode: "SS 2101",
        imageUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80",
        symptomsOrCharacteristics: [
            "White salt efflorescence on the soil surface during the dry winter (Rabi) season.",
            "Electrical Conductivity of saturation extract ($EC_e$) > 4.0 dS/m at 25°C.",
            "Stunted crop growth, tip burn, and severe osmotic moisture stress in glycophyte crops."
        ],
        educationalNotes: "Capillary rise of saline groundwater during November–May concentrates soluble sodium, magnesium, and chloride ions in the root zone. Ameliorated via gypsum ($CaSO_4$) application and salt-tolerant cultivars (Binadhan-8/10, BRRI dhan67).",
        managementOrPracticalTask: "Measure soil suspension Electrical Conductivity (EC 1:5 ratio) using a calibrated digital EC meter in the BAU Soil Chemistry Lab.",
        safetyCaution: "Rinse EC electrode with deionized water between readings to prevent cross-contamination.",
        provenance: "VERIFIED"
    }
];

export function getSpecimenById(id: string): FieldSpecimen | undefined {
    return BAU_FIELD_SPECIMENS.find(s => s.id === id);
}
