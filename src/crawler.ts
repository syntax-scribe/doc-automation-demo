import axios from "axios";
import * as cheerio from "cheerio";
import { URL } from "url";

export interface CrawlOptions {
  maxDepth?: number;
  maxPages?: number;
  delay?: number;
  allowedDomains?: string[];
}

export interface CrawlResult {
  url: string;
  title: string;
  links: string[];
  depth: number;
  statusCode: number;
}

export class WebCrawler {
  private visited: Set<string> = new Set();
  private results: CrawlResult[] = [];
  private options: Required<CrawlOptions>;

  constructor(options: CrawlOptions = {}) {
    this.options = {
      maxDepth: options.maxDepth ?? 2,
      maxPages: options.maxPages ?? 50,
      delay: options.delay ?? 1000,
      allowedDomains: options.allowedDomains ?? [],
    };
  }

  /**
   * Start crawling from the given URL
   */
  async crawl(startUrl: string): Promise<CrawlResult[]> {
    this.visited.clear();
    this.results = [];

    console.log(`Starting crawl from: ${startUrl}`);
    await this.crawlUrl(startUrl, 0);

    return this.results;
  }

  /**
   * Crawl a single URL
   */
  private async crawlUrl(url: string, depth: number): Promise<void> {
    // Check if we've reached our limits
    if (
      depth > this.options.maxDepth ||
      this.visited.size >= this.options.maxPages
    ) {
      return;
    }

    // Skip if already visited
    if (this.visited.has(url)) {
      return;
    }

    // Check if domain is allowed
    if (this.options.allowedDomains.length > 0) {
      const urlObj = new URL(url);
      const isAllowed = this.options.allowedDomains.some(
        (domain) =>
          urlObj.hostname === domain || urlObj.hostname.endsWith(`.${domain}`)
      );
      if (!isAllowed) {
        return;
      }
    }

    this.visited.add(url);
    console.log(`Crawling [depth=${depth}]: ${url}`);

    try {
      // Fetch the page
      const response = await axios.get(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; SimpleWebCrawler/1.0)",
        },
        timeout: 10000,
      });

      // Parse HTML
      const $ = cheerio.load(response.data);
      const title = $("title").text().trim() || "No title";

      // Extract all links
      const links: string[] = [];
      $("a[href]").each((_, element) => {
        const href = $(element).attr("href");
        if (href) {
          try {
            const absoluteUrl = new URL(href, url).href;
            // Only include HTTP(S) URLs
            if (
              absoluteUrl.startsWith("http://") ||
              absoluteUrl.startsWith("https://")
            ) {
              links.push(absoluteUrl);
            }
          } catch (e) {
            // Invalid URL, skip
          }
        }
      });

      // Store result
      const result: CrawlResult = {
        url,
        title,
        links,
        depth,
        statusCode: response.status,
      };
      this.results.push(result);

      console.log(`  Found ${links.length} links on: ${url}`);

      // Delay before next request
      await this.delay(this.options.delay);

      // Recursively crawl discovered links
      for (const link of links) {
        await this.crawlUrl(link, depth + 1);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(`  Error crawling ${url}: ${error.message}`);
      } else {
        console.error(`  Unexpected error crawling ${url}:`, error);
      }
    }
  }

  /**
   * Delay execution for the specified milliseconds
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Get crawl statistics
   */
  getStats() {
    return {
      totalPages: this.results.length,
      uniqueUrls: this.visited.size,
      maxDepthReached: Math.max(...this.results.map((r) => r.depth), 0),
    };
  }

  private test() {
    console.log("This is a test method.");
  }
}
