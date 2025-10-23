import { WebCrawler } from "./crawler";

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

// Run the examples
main().catch((error) => {
  console.error("Error running crawler:", error);
  process.exit(1);
});
