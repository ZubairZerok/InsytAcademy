"use server";

export type ExecutionResult = {
    output: string[];
    error?: string;
    executionTime: number; // in ms
};

export async function executeCode(code: string, language: "r" | "python"): Promise<ExecutionResult> {
    const start = Date.now();

    // Simulate processing delay for realism
    await new Promise(resolve => setTimeout(resolve, 600));

    try {
        let output: string[] = [];

        if (language === "r") {
            output = simulateR(code);
        } else {
            output = simulatePython(code);
        }

        const end = Date.now();
        return {
            output,
            executionTime: end - start
        };

    } catch (err: any) {
        return {
            output: [],
            error: err.message || "Runtime Error",
            executionTime: Date.now() - start
        };
    }
}

function simulateR(code: string): string[] {
    const lines = code.split('\n').filter(l => l.trim().length > 0);
    const output: string[] = [];
    const variables: Record<string, any> = {};

    for (const line of lines) {
        const clean = line.trim();

        // Comments
        if (clean.startsWith("#")) continue;

        // Assignments: x <- 10
        if (clean.includes("<-")) {
            const [key, val] = clean.split("<-").map(s => s.trim());
            variables[key] = val;
            // R doesn't auto-print on assignment unless wrapped in ()
            continue;
        }

        // Print: print("Hello")
        if (clean.startsWith("print(") || clean.startsWith("cat(")) {
            const match = clean.match(/["'](.+)["']/);
            if (match) output.push(`[1] "${match[1]}"`);
            else {
                // Try printing variable
                const varName = clean.replace(/print\(|\)/g, "").trim();
                if (variables[varName]) output.push(`[1] ${variables[varName]}`);
                else output.push(`[1] NULL`);
            }
            continue;
        }

        // Math (Basic)
        if (/^[\d\s\+\-\*\/\(\)\.]+$/.test(clean)) {
            try {
                // eslint-disable-next-line no-new-func
                const res = new Function(`return ${clean}`)();
                output.push(`[1] ${res}`);
            } catch (e) {
                output.push(`Error: ${e}`);
            }
            continue;
        }

        // Mock Functions
        if (clean.includes("mean")) output.push("[1] 24.5");
        else if (clean.includes("sum")) output.push("[1] 150");
        else if (clean.includes("head")) output.push("  id   crop yield\n1  1   Corn  5000\n2  2    Soy  3200");
        else if (clean.includes("library")) output.push(`Attaching package: '${clean.replace("library(", "").replace(")", "")}'`);
        else if (clean.includes("ggplot")) output.push("Plot created. [Graphics Device]");
        // Default: If it's a variable name, print it
        else if (variables[clean]) {
            output.push(`[1] ${variables[clean]}`);
        }
    }

    if (output.length === 0) return ["(No output)"];
    return output;
}

function simulatePython(code: string): string[] {
    const lines = code.split('\n').filter(l => l.trim().length > 0);
    const output: string[] = [];

    for (const line of lines) {
        const clean = line.trim();
        if (clean.startsWith("#")) continue;

        // Print
        if (clean.startsWith("print(") && clean.endsWith(")")) {
            const content = clean.slice(6, -1);
            // Quotes?
            const stringMatch = content.match(/["'](.+)["']/);
            if (stringMatch) {
                output.push(stringMatch[1]);
            } else {
                // Math inside print
                try {
                    // eslint-disable-next-line no-new-func
                    const res = new Function(`return ${content}`)();
                    output.push(String(res));
                } catch (e) {
                    output.push(`NameError: name '${content}' is not defined`);
                }
            }
            continue;
        }

        // Imports
        if (clean.startsWith("import ")) {
            continue; // Silent success
        }

        // Def
        if (clean.startsWith("def ")) {
            output.push("Function defined.");
            continue;
        }
    }

    if (output.length === 0) return ["(No output)"];
    return output;
}
