[⬅️ Back to Table of Contents](index.md)

# 📄 `example.ts`

## 📊 Analysis Summary

| Metric | Count |
|--------|-------|
| 🔧 Functions | 1 |
| 📦 Imports | 1 |
| 📊 Variables & Constants | 4 |
| ⚡ Async/Await Patterns | 1 |

## 📚 Table of Contents

- [Imports](#imports)
- [Variables & Constants](#variables-constants)
- [Async/Await Patterns](#asyncawait-patterns)
- [Functions](#functions)

## 🛠️ File Location:
📂 **`example.ts`**

## 📦 Imports

| Name | Source |
|------|--------|
| `WebCrawler` | `./crawler` |


---

## Variables & Constants

| Name | Type | Kind | Value | Exported |
|------|------|------|-------|----------|
| `crawler1` | `WebCrawler` | let/var | `new WebCrawler({ maxDepth: 1, maxPages: 10, delay: 500, })` | ✗ |
| `results1` | `CrawlResult[]` | let/var | `await crawler1.crawl("https://example.com")` | ✗ |
| `crawler2` | `WebCrawler` | let/var | `new WebCrawler({ maxDepth: 2, maxPages: 20, delay: 1000, allowedDomains: ["ex...` | ✗ |
| `results2` | `CrawlResult[]` | let/var | `await crawler2.crawl("https://example.com")` | ✗ |


---

## Async/Await Patterns

| Type | Function | Await Expressions | Promise Chains |
|------|----------|-------------------|----------------|
| async-function | `main` | crawler1.crawl("https://example.com"), crawler2.crawl("https://example.com") | *none* |


---

## Functions

### `main(): Promise<void>`

**Returns:** `Promise<void>`

**Calls:**

- `console.log`
- `crawler1.crawl`
- `results1.forEach`
- `crawler1.getStats`
- `crawler2.crawl`
- `crawler2.getStats`

**Internal Comments:**
```
// Example 1: Basic crawl (x4)
// Example 2: Domain-restricted crawl (x4)
```

<details><summary>Code</summary>

```typescript
async function main() {
  // Example 1: Basic crawl
  console.log("=== Example 1: Basic Crawl ===\n");

  const crawler1 = new WebCrawler({
    maxDepth: 1,
    maxPages: 10,
    delay: 500,
  });

  const results1 = await crawler1.crawl("https://example.com");

  console.log("\nCrawl Results:");
  results1.forEach((result) => {
    console.log(`\n[${result.depth}] ${result.title}`);
    console.log(`    URL: ${result.url}`);
    console.log(`    Status: ${result.statusCode}`);
    console.log(`    Links found: ${result.links.length}`);
  });

  console.log("\nCrawl Statistics:");
  console.log(crawler1.getStats());

  // Example 2: Domain-restricted crawl
  console.log("\n\n=== Example 2: Domain-Restricted Crawl ===\n");

  const crawler2 = new WebCrawler({
    maxDepth: 2,
    maxPages: 20,
    delay: 1000,
    allowedDomains: ["example.com"],
  });

  const results2 = await crawler2.crawl("https://example.com");

  console.log("\nDomain-Restricted Results:");
  console.log(`Total pages crawled: ${results2.length}`);
  console.log(crawler2.getStats());
}
```
</details>


---