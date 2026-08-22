"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Sparkles, Microscope, Wheat, Trees, Anchor, Zap } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";

interface SkillNode {
    id: string;
    label: string;
    description: string;
    branch: "Genetics" | "Forestry" | "Agri-Tech" | "Aquaculture";
    status: "LOCKED" | "UNLOCKED" | "COMPLETED";
    x: number;
    y: number;
    icon: React.ComponentType<{ className?: string }>;
}

const initialNodes: SkillNode[] = [
    { id: "gen-1", label: "CRISPR Editing Basics", description: "Learn gene sequencing alignments and genomic splicing algorithms.", branch: "Genetics", status: "COMPLETED", x: 150, y: 100, icon: Microscope },
    { id: "gen-2", label: "Marker Assisted Selection", description: "Implement genotyping models to predict yield resilience.", branch: "Genetics", status: "UNLOCKED", x: 150, y: 220, icon: Microscope },
    { id: "gen-3", label: "Bioinformatics Pipeline", description: "Design fully autonomous parsing pipelines for FASTA genomic sequence datasets.", branch: "Genetics", status: "LOCKED", x: 150, y: 340, icon: Microscope },
    
    { id: "for-1", label: "Canopy Multispectral GIS", description: "Leverage satellite GIS data to classify forestry canopy densities.", branch: "Forestry", status: "COMPLETED", x: 350, y: 100, icon: Trees },
    { id: "for-2", label: "Carbon Offset Analytics", description: "Simulate dynamic carbon biomass offset capacities over time.", branch: "Forestry", status: "UNLOCKED", x: 350, y: 220, icon: Trees },
    
    { id: "agr-1", label: "Soil Salinity Prediction", description: "Map electro-conductivity datasets onto soil classification charts.", branch: "Agri-Tech", status: "COMPLETED", x: 550, y: 100, icon: Wheat },
    { id: "agr-2", label: "Precision NPK Dosing", description: "Deploy localized sensor tracking formulas to calculate optimal nutrient doses.", branch: "Agri-Tech", status: "UNLOCKED", x: 550, y: 220, icon: Wheat },
    
    { id: "aq-1", label: "FCR Optimization Models", description: "Forecast Feed Conversion Ratio matrices inside simulated recirculating aquaculture loops.", branch: "Aquaculture", status: "UNLOCKED", x: 750, y: 150, icon: Anchor },
];

export function SkillTree() {
    const [selectedNode, setSelectedNode] = useState<SkillNode | null>(null);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="font-mono text-xs font-bold text-neon-green uppercase tracking-widest flex items-center gap-2">
                        <Sparkles className="h-4 w-4 animate-pulse" />
                        OPERATIVE SKILL NETWORK
                    </h3>
                    <p className="text-xs text-gray-400 font-mono mt-1">
                        Visualize and navigate your agricultural tech specializations.
                    </p>
                </div>
                {selectedNode && (
                    <button 
                        onClick={() => setSelectedNode(null)}
                        className="text-[10px] font-mono text-gray-400 hover:text-white"
                    >
                        [RESET ACTIVE MODULE]
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* SVG Interactive Canvas */}
                <GlassCard className="lg:col-span-3 h-[420px] relative overflow-hidden bg-black/60 p-0 select-none group border-white/5">
                    {/* Grid Background */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

                    <div className="absolute top-4 left-4 flex gap-2 font-mono text-[9px]">
                        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-neon-green" /> COMPLETED</span>
                        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-blue-400" /> UNLOCKED</span>
                        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-gray-700" /> LOCKED</span>
                    </div>

                    {/* SVG Connections Container */}
                    <svg className="absolute inset-0 h-full w-full pointer-events-none">
                        {/* Connecting Lines between sequential branches */}
                        {/* Genetics */}
                        <line x1="150" y1="100" x2="150" y2="220" stroke="rgba(0, 255, 148, 0.2)" strokeWidth="2" strokeDasharray="4 4" />
                        <line x1="150" y1="220" x2="150" y2="340" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="2" />

                        {/* Forestry */}
                        <line x1="350" y1="100" x2="350" y2="220" stroke="rgba(0, 255, 148, 0.2)" strokeWidth="2" strokeDasharray="4 4" />

                        {/* Agri-Tech */}
                        <line x1="550" y1="100" x2="550" y2="220" stroke="rgba(0, 255, 148, 0.2)" strokeWidth="2" strokeDasharray="4 4" />

                        {/* Cross Connectives */}
                        <path d="M 150 220 C 250 220, 250 100, 350 100" fill="none" stroke="rgba(0, 255, 148, 0.05)" strokeWidth="1.5" />
                        <path d="M 350 220 C 450 220, 450 100, 550 100" fill="none" stroke="rgba(0, 255, 148, 0.05)" strokeWidth="1.5" />
                    </svg>

                    {/* Nodes overlay */}
                    <div className="absolute inset-0 overflow-auto scrollbar-thin">
                        <div className="relative w-[900px] h-[400px]">
                            {initialNodes.map((node) => {
                                const Icon = node.icon;
                                const isCompleted = node.status === "COMPLETED";
                                const isUnlocked = node.status === "UNLOCKED";
                                const isSelected = selectedNode?.id === node.id;

                                return (
                                    <motion.button
                                        key={node.id}
                                        onClick={() => setSelectedNode(node)}
                                        className={`absolute flex flex-col items-center justify-center p-3 w-32 rounded-xl border text-center transition-all duration-300 ${
                                            isCompleted
                                                ? isSelected 
                                                    ? "bg-neon-green text-black border-neon-green"
                                                    : "bg-neon-green/10 border-neon-green/30 text-neon-green hover:bg-neon-green/20"
                                                : isUnlocked
                                                    ? isSelected
                                                        ? "bg-blue-500 text-white border-blue-400"
                                                        : "bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20"
                                                    : "bg-white/[0.01] border-white/5 text-gray-400 cursor-not-allowed"
                                        }`}
                                        style={{ left: node.x - 64, top: node.y - 40 }}
                                        whileHover={node.status !== "LOCKED" ? { scale: 1.05 } : {}}
                                    >
                                        <Icon className="h-4 w-4 mb-1.5 shrink-0" />
                                        <span className="text-[10px] font-bold font-mono truncate w-full">{node.label}</span>
                                        <span className="text-[8px] font-mono opacity-60 uppercase tracking-widest mt-0.5">{node.branch}</span>
                                    </motion.button>
                                );
                            })}
                        </div>
                    </div>
                </GlassCard>

                {/* Info Panel / Retention details */}
                <GlassCard className="p-6 flex flex-col justify-between border-white/5 bg-[#070A08]/80 backdrop-blur-md">
                    {selectedNode ? (
                        <div className="space-y-4">
                            <div>
                                <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                                    selectedNode.status === "COMPLETED" 
                                        ? "bg-neon-green/20 text-neon-green" 
                                        : selectedNode.status === "UNLOCKED"
                                            ? "bg-blue-500/20 text-blue-400"
                                            : "bg-white/5 text-gray-400"
                                }`}>
                                    {selectedNode.status}
                                </span>
                                <h4 className="text-sm font-bold text-white mt-3 font-mono">{selectedNode.label}</h4>
                            </div>
                            <p className="text-xs text-gray-400 leading-relaxed font-mono">
                                {selectedNode.description}
                            </p>
                            {selectedNode.status === "UNLOCKED" && (
                                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 text-[10px] font-mono text-blue-300 flex items-center gap-1.5">
                                    <Zap className="h-3.5 w-3.5 text-blue-400 shrink-0 animate-pulse" />
                                    <span>UNlocks advanced interactive data sandbox!</span>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-4 my-auto text-center select-none">
                            <Microscope className="h-10 w-10 text-gray-400 mx-auto opacity-30" />
                            <h4 className="text-xs font-bold text-gray-400 font-mono">NODE DATA OFFLINE</h4>
                            <p className="text-[11px] text-gray-400 leading-relaxed leading-5">
                                Select any completed or unlocked specialization node to map sequence attributes or view dynamic career branches.
                            </p>
                        </div>
                    )}

                    <div className="border-t border-white/5 pt-4 mt-6 text-[10px] font-mono text-gray-400 leading-4">
                        <div className="flex justify-between mb-1">
                            <span>SUNK CAREER CAPITAL:</span>
                            <span className="text-neon-green">45,000 XP</span>
                        </div>
                        <div className="flex justify-between">
                            <span>RECRUITMENT LINK:</span>
                            <span className="text-white">STANDBY</span>
                        </div>
                    </div>
                </GlassCard>
            </div>
        </div>
    );
}
