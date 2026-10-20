// lib/safe-math.ts
// A tiny, safe arithmetic expression evaluator.
// Supports: +, -, *, /, parentheses, decimal numbers, unary minus.
// NO use of eval, new Function, or any form of code execution.
//
// Grammar (recursive descent):
//   expr   = term (('+' | '-') term)*
//   term   = factor (('*' | '/') factor)*
//   factor = '-' factor | atom
//   atom   = NUMBER | '(' expr ')'

export function safeEvalMath(input: string): number {
  const tokens = tokenize(input);
  const ctx = { tokens, pos: 0 };
  const result = parseExpr(ctx);
  if (ctx.pos < ctx.tokens.length) {
    throw new Error("Unexpected token: " + ctx.tokens[ctx.pos]);
  }
  return result;
}

type Token = string;
interface Ctx { tokens: Token[]; pos: number }

function tokenize(s: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  while (i < s.length) {
    if (/\s/.test(s[i])) { i++; continue; }
    if ("+-*/()".includes(s[i])) {
      tokens.push(s[i]);
      i++;
      continue;
    }
    if (/[\d.]/.test(s[i])) {
      let num = "";
      while (i < s.length && /[\d.]/.test(s[i])) { num += s[i]; i++; }
      tokens.push(num);
      continue;
    }
    throw new Error("Invalid character: " + s[i]);
  }
  return tokens;
}

function parseExpr(ctx: Ctx): number {
  let left = parseTerm(ctx);
  while (ctx.pos < ctx.tokens.length && (ctx.tokens[ctx.pos] === "+" || ctx.tokens[ctx.pos] === "-")) {
    const op = ctx.tokens[ctx.pos++];
    const right = parseTerm(ctx);
    left = op === "+" ? left + right : left - right;
  }
  return left;
}

function parseTerm(ctx: Ctx): number {
  let left = parseFactor(ctx);
  while (ctx.pos < ctx.tokens.length && (ctx.tokens[ctx.pos] === "*" || ctx.tokens[ctx.pos] === "/")) {
    const op = ctx.tokens[ctx.pos++];
    const right = parseFactor(ctx);
    left = op === "*" ? left * right : left / right;
  }
  return left;
}

function parseFactor(ctx: Ctx): number {
  if (ctx.tokens[ctx.pos] === "-") {
    ctx.pos++;
    return -parseFactor(ctx);
  }
  return parseAtom(ctx);
}

function parseAtom(ctx: Ctx): number {
  const tok = ctx.tokens[ctx.pos];
  if (!tok) throw new Error("Unexpected end of expression");
  if (tok === "(") {
    ctx.pos++;
    const val = parseExpr(ctx);
    if (ctx.tokens[ctx.pos] !== ")") throw new Error("Missing closing parenthesis");
    ctx.pos++;
    return val;
  }
  const num = Number(tok);
  if (isNaN(num)) throw new Error("Expected number, got: " + tok);
  ctx.pos++;
  return num;
}
