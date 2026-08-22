"use server";

type CommandResponse = {
    output: string[];
    type: "success" | "error" | "info" | "warning";
};

export async function processCommand(command: string): Promise<CommandResponse> {
    const cleanCmd = command.trim(); // Keep case for R variables, but trim
    const lowerCmd = cleanCmd.toLowerCase();

    // 1. System Commands (Legacy OS)
    switch (lowerCmd) {
        case "help":
            return {
                type: "info",
                output: [
                    "AVAILABLE COMMANDS:",
                    "-------------------",
                    "help      - Show this list",
                    "status    - Check system status",
                    "scan      - Scan for vulnerabilities",
                    "whoami    - User identification",
                    "clear     - Clear terminal",
                    "",
                    "R ENVIRONMENT (ACTIVE):",
                    "Supports basic math (5 + 5), assignment (x <- 10), and functions.",
                ],
            };

        case "status":
            return {
                type: "success",
                output: [
                    "SYSTEM STATUS: ONLINE",
                    "SECURITY: ENCRYPTED",
                    "CONNECTION: STABLE (LATENCY: 12ms)",
                    "AGRI-DATA LINK: ACTIVE",
                    "R COMPILER: READY (v4.3.0)",
                ],
            };

        case "whoami":
            // In a real app, fetch user from Supabase here
            return {
                type: "info",
                output: ["USER: AGENT_007", "ROLE: OPERATOR", "CLEARANCE: LEVEL 1"],
            };

        case "scan":
            return {
                type: "warning",
                output: [
                    "INITIATING NETWORK SCAN...",
                    "...",
                    "SCAN COMPLETE.",
                    "NO THREATS DETECTED.",
                    "SECTOR 7 CLEAR.",
                ],
            };

        case "":
            return { type: "info", output: [] };
    }

    // 2. R Environment Simulation (Fallback for everything else)
    const rOutput = simulateRExecution(cleanCmd);
    if (rOutput) {
        return {
            type: "success",
            output: rOutput
        };
    }

    // 3. Unknown
    return {
        type: "error",
        output: [`Command not found: ${cleanCmd}`, "Type 'help' for available commands."],
    };
}

function simulateRExecution(cmd: string): string[] | null {
    // 1. Basic Math Detection (Numbers and operators only)
    if (/^[\d\s\+\-\*\/\(\)\.]+$/.test(cmd)) {
        try {
            // Safe(ish) eval for numbers
            // eslint-disable-next-line no-new-func
            const result = new Function(`return ${cmd}`)();
            return [`[1] ${result}`];
        } catch (e) {
            return null;
        }
    }

    // 2. Variable Assignment (x <- 5)
    if (cmd.includes("<-")) {
        const parts = cmd.split("<-");
        const varName = parts[0].trim();
        const value = parts[1].trim();
        return [`> ${varName} assigned`, `[1] ${value}`];
    }

    // 3. String Printing
    if (cmd.startsWith("print(")) {
        const match = cmd.match(/print\(["'](.+)["']\)/);
        if (match) return [`[1] "${match[1]}"`];
    }

    // 4. Common R Functions (Mocked)
    const lower = cmd.toLowerCase();
    if (lower.startsWith("mean(")) return ["[1] 24.5"];
    if (lower.startsWith("sum(")) return ["[1] 150"];
    if (lower.startsWith("sd(")) return ["[1] 3.2"];
    if (lower.startsWith("head(")) {
        return [
            "  id   crop yield",
            "1  1   Corn  5000",
            "2  2    Soy  3200",
            "3  3  Wheat  4100"
        ];
    }
    if (lower.startsWith("summary(")) {
        return [
            "   Min. 1st Qu.  Median    Mean 3rd Qu.    Max. ",
            "   1.00    2.50    4.00    4.00    5.50    7.00 "
        ];
    }
    if (lower.startsWith("c(")) return [" [1] 10 20 30 40 50"];
    if (lower.startsWith("library(")) return ["Attaching package: 'dplyr'", "The following objects are masked from 'package:stats':", "    filter, lag"];

    // 5. Explicitly R-looking things that we can't run but should acknowledge
    // If it has parens () or assignment literal, we pretend it worked if we haven't caught it yet?
    // Or we just return null and let it go to "Command not found"

    return null;
}
