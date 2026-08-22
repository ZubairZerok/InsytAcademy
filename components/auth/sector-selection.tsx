"use client";

import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";

// Define the hierarchy of sectors and sub-sectors
const sectors = [
    {
        value: "AGRI",
        label: "Agriculture",
        subSectors: [
            { value: "Agriculture (General)", label: "General Agriculture" },
            { value: "Agri Economics", label: "Agri Economics (Stat Focused)" },
            { value: "Agri Engineering", label: "Agri Engineering (Stat Focused)" },
            { value: "Soil Science", label: "Soil Science" },
            { value: "Horticulture", label: "Horticulture" },
            { value: "Agronomy", label: "Agronomy" },
        ]
    },
    {
        value: "LIFE",
        label: "Life Sciences",
        subSectors: [
            { value: "DVM", label: "Doctor of Veterinary Medicine (DVM)" },
            { value: "Fisheries", label: "Fisheries" },
            { value: "Animal Husbandry", label: "Animal Husbandry" },
            { value: "Biotechnology", label: "Biotechnology" },
        ]
    },
    {
        value: "STAT",
        label: "Statistics / Quantitative",
        subSectors: [
            { value: "Statistics", label: "Pure Statistics" },
            { value: "Agri Economics", label: "Agricultural Economics" },
            { value: "Agri Engineering", label: "Agricultural Engineering" },
        ]
    },
    {
        value: "ENV",
        label: "Environmental Science",
        subSectors: [
            { value: "Environmental Science", label: "Environmental Science" },
            { value: "Geography", label: "Geography & GIS" },
            { value: "Disaster Management", label: "Disaster Management" },
        ]
    },
    {
        value: "GEN",
        label: "General / Other",
        subSectors: [
            { value: "General", label: "General Data Science" },
        ]
    }
];

interface SectorSelectionProps {
    onSelect: (sector: string, subSector: string) => void;
}

export function SectorSelection({ onSelect }: SectorSelectionProps) {
    const [openSector, setOpenSector] = useState(false);
    const [openSub, setOpenSub] = useState(false);
    const [selectedSector, setSelectedSector] = useState<string>("");
    const [selectedSub, setSelectedSub] = useState<string>("");

    // Find the full sector object to get its sub-sectors
    const activeSector = sectors.find(s => s.value === selectedSector);

    const handleSectorSelect = (currentValue: string) => {
        setSelectedSector(currentValue);
        setSelectedSub(""); // Reset sub-sector when sector changes
        setOpenSector(false);
        // We don't notify parent yet, wait for sub-sector or if none available
    };

    const handleSubSelect = (currentValue: string) => {
        setSelectedSub(currentValue);
        setOpenSub(false);
        if (selectedSector) {
            onSelect(selectedSector, currentValue);
        }
    };

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label className="text-neon-green text-xs font-mono">PRIMARY DOMAIN</Label>
                <Popover open={openSector} onOpenChange={setOpenSector}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openSector}
                            className="w-full justify-between bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white"
                        >
                            {selectedSector
                                ? sectors.find((sector) => sector.value === selectedSector)?.label
                                : "Select your background..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0 bg-agri-black border-white/20 text-white">
                        <Command className="bg-transparent">
                            <CommandInput placeholder="Search domain..." className="text-white placeholder-gray-500" />
                            <CommandList>
                                <CommandEmpty>No domain found.</CommandEmpty>
                                <CommandGroup>
                                    {sectors.map((sector) => (
                                        <CommandItem
                                            key={sector.value}
                                            value={sector.value}
                                            onSelect={() => handleSectorSelect(sector.value)}
                                            className="text-white hover:bg-neon-green/20 aria-selected:bg-neon-green/20"
                                        >
                                            <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4 text-neon-green",
                                                    selectedSector === sector.value ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                            {sector.label}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>

            {selectedSector && activeSector && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    <Label className="text-neon-green text-xs font-mono">SPECIALIZATION</Label>
                    <Popover open={openSub} onOpenChange={setOpenSub}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={openSub}
                                className="w-full justify-between bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white"
                            >
                                {selectedSub
                                    ? activeSector.subSectors.find((sub) => sub.value === selectedSub)?.label
                                    : "Select specialization..."}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0 bg-agri-black border-white/20 text-white">
                            <Command className="bg-transparent">
                                <CommandInput placeholder="Search specialization..." className="text-white placeholder-gray-500" />
                                <CommandList>
                                    <CommandEmpty>No specialization found.</CommandEmpty>
                                    <CommandGroup>
                                        {activeSector.subSectors.map((sub) => (
                                            <CommandItem
                                                key={sub.value}
                                                value={sub.value}
                                                onSelect={() => handleSubSelect(sub.value)}
                                                className="text-white hover:bg-neon-green/20 aria-selected:bg-neon-green/20"
                                            >
                                                <Check
                                                    className={cn(
                                                        "mr-2 h-4 w-4 text-neon-green",
                                                        selectedSub === sub.value ? "opacity-100" : "opacity-0"
                                                    )}
                                                />
                                                {sub.label}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                </div>
            )}
        </div>
    );
}
