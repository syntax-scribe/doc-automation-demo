[⬅️ Back to Table of Contents](index.md)

# 📄 `crawler.ts`

## 📊 Analysis Summary

| Metric | Count |
|--------|-------|
| 🔧 Functions | 4 |
| 🧱 Classes | 1 |
| 📦 Imports | 2 |
| 📊 Variables & Constants | 6 |
| 📐 Interfaces | 2 |

## 📚 Table of Contents

- [Imports](#imports)
- [Variables & Constants](#variables-constants)
- [Functions](#functions)
- [Classes](#classes)
- [Interfaces](#interfaces)

## 🛠️ File Location:
📂 **`crawler.ts`**

## 📦 Imports

| Name | Source |
|------|--------|
| `axios` | `axios` |
| `URL` | `url` |


---

## Variables & Constants

| Name | Type | Kind | Value | Exported |
|------|------|------|-------|----------|
| `urlObj` | `URL` | let/var | `new URL(url)` | ✗ |
| `response` | `AxiosResponse<any, any, {}>` | let/var | `await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Sim...` | ✗ |
| `title` | `string` | let/var | `$('title').text().trim() \|\| 'No title'` | ✗ |
| `links` | `string[]` | let/var | `[]` | ✗ |
| `absoluteUrl` | `string` | const | `new URL(href, url).href` | ✗ |
| `result` | `CrawlResult` | let/var | `{ url, title, links, depth, statusCode: response.status, }` | ✗ |


---

## Functions

### `WebCrawler.crawl(startUrl: string): Promise<CrawlResult[]>`

**JSDoc:**
```typescript
/**
   * Start crawling from the given URL
   */
```

**Parameters:**

- **`startUrl`** `string`

**Returns:** `Promise<CrawlResult[]>`

**Calls:**

- `this.visited.clear`
- `console.log`
- `this.crawlUrl`

<details><summary>Code</summary>

```typescript
async crawl(startUrl: string): Promise<CrawlResult[]> {
    this.visited.clear();
    this.results = [];

    console.log(`Starting crawl from: ${startUrl}`);
    await this.crawlUrl(startUrl, 0);

    return this.results;
  }
```
</details>

### `WebCrawler.crawlUrl(url: string, depth: number): Promise<void>`

**JSDoc:**
```typescript
/**
   * Crawl a single URL
   */
```

**Parameters:**

- **`url`** `string`
- **`depth`** `number`

**Returns:** `Promise<void>`

**Calls:**

- `this.visited.has`
- `this.options.allowedDomains.some`
- `urlObj.hostname.endsWith`
- `this.visited.add`
- `console.log`
- `axios.get`
- `cheerio.load`
- `$('title').text().trim`
- `$('a[href]').each`
- `$(element).attr`
- `absoluteUrl.startsWith`
- `links.push`
- `this.results.push`
- `this.delay`
- `this.crawlUrl`
- `axios.isAxiosError`
- `console.error`

**Internal Comments:**
```
// Check if we've reached our limits
// Skip if already visited
// Check if domain is allowed
// Fetch the page (x2)
// Parse HTML (x2)
// Extract all links (x2)
// Only include HTTP(S) URLs
// Store result (x2)
// Delay before next request (x2)
// Recursively crawl discovered links
```

<details><summary>Code</summary>

```typescript
private async crawlUrl(url: string, depth: number): Promise<void> {
    // Check if we've reached our limits
    if (depth > this.options.maxDepth || this.visited.size >= this.options.maxPages) {
      return;
    }

    // Skip if already visited
    if (this.visited.has(url)) {
      return;
    }

    // Check if domain is allowed
    if (this.options.allowedDomains.length > 0) {
      const urlObj = new URL(url);
      const isAllowed = this.options.allowedDomains.some(domain =>
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
          'User-Agent': 'Mozilla/5.0 (compatible; SimpleWebCrawler/1.0)',
        },
        timeout: 10000,
      });

      // Parse HTML
      const $ = cheerio.load(response.data);
      const title = $('title').text().trim() || 'No title';

      // Extract all links
      const links: string[] = [];
      $('a[href]').each((_, element) => {
        const href = $(element).attr('href');
        if (href) {
          try {
            const absoluteUrl = new URL(href, url).href;
            // Only include HTTP(S) URLs
            if (absoluteUrl.startsWith('http://') || absoluteUrl.startsWith('https://')) {
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
```
</details>

### `WebCrawler.delay(ms: number): Promise<void>`

**JSDoc:**
```typescript
/**
   * Delay execution for the specified milliseconds
   */
```

**Parameters:**

- **`ms`** `number`

**Returns:** `Promise<void>`

**Calls:**

- `setTimeout`

<details><summary>Code</summary>

```typescript
private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
```
</details>

### `WebCrawler.getStats(): { totalPages: number; uniqueUrls: number; maxDepthReached: number; }`

**JSDoc:**
```typescript
/**
   * Get crawl statistics
   */
```

**Returns:** `{ totalPages: number; uniqueUrls: number; maxDepthReached: number; }`

**Calls:**

- `Math.max`
- `this.results.map`

<details><summary>Code</summary>

```typescript
getStats() {
    return {
      totalPages: this.results.length,
      uniqueUrls: this.visited.size,
      maxDepthReached: Math.max(...this.results.map(r => r.depth), 0),
    };
  }
```
</details>


---

## Classes

### `WebCrawler`

<details><summary>Class Code</summary>

```ts
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
    if (depth > this.options.maxDepth || this.visited.size >= this.options.maxPages) {
      return;
    }

    // Skip if already visited
    if (this.visited.has(url)) {
      return;
    }

    // Check if domain is allowed
    if (this.options.allowedDomains.length > 0) {
      const urlObj = new URL(url);
      const isAllowed = this.options.allowedDomains.some(domain =>
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
          'User-Agent': 'Mozilla/5.0 (compatible; SimpleWebCrawler/1.0)',
        },
        timeout: 10000,
      });

      // Parse HTML
      const $ = cheerio.load(response.data);
      const title = $('title').text().trim() || 'No title';

      // Extract all links
      const links: string[] = [];
      $('a[href]').each((_, element) => {
        const href = $(element).attr('href');
        if (href) {
          try {
            const absoluteUrl = new URL(href, url).href;
            // Only include HTTP(S) URLs
            if (absoluteUrl.startsWith('http://') || absoluteUrl.startsWith('https://')) {
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
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get crawl statistics
   */
  getStats() {
    return {
      totalPages: this.results.length,
      uniqueUrls: this.visited.size,
      maxDepthReached: Math.max(...this.results.map(r => r.depth), 0),
    };
  }
}
```
</details>

#### Methods

##### `crawl(startUrl: string): Promise<CrawlResult[]>`

<details><summary>Code</summary>

```ts
async crawl(startUrl: string): Promise<CrawlResult[]> {
    this.visited.clear();
    this.results = [];

    console.log(`Starting crawl from: ${startUrl}`);
    await this.crawlUrl(startUrl, 0);

    return this.results;
  }
```
</details>

##### `crawlUrl(url: string, depth: number): Promise<void>`

<details><summary>Code</summary>

```ts
private async crawlUrl(url: string, depth: number): Promise<void> {
    // Check if we've reached our limits
    if (depth > this.options.maxDepth || this.visited.size >= this.options.maxPages) {
      return;
    }

    // Skip if already visited
    if (this.visited.has(url)) {
      return;
    }

    // Check if domain is allowed
    if (this.options.allowedDomains.length > 0) {
      const urlObj = new URL(url);
      const isAllowed = this.options.allowedDomains.some(domain =>
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
          'User-Agent': 'Mozilla/5.0 (compatible; SimpleWebCrawler/1.0)',
        },
        timeout: 10000,
      });

      // Parse HTML
      const $ = cheerio.load(response.data);
      const title = $('title').text().trim() || 'No title';

      // Extract all links
      const links: string[] = [];
      $('a[href]').each((_, element) => {
        const href = $(element).attr('href');
        if (href) {
          try {
            const absoluteUrl = new URL(href, url).href;
            // Only include HTTP(S) URLs
            if (absoluteUrl.startsWith('http://') || absoluteUrl.startsWith('https://')) {
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
```
</details>

##### `delay(ms: number): Promise<void>`

<details><summary>Code</summary>

```ts
private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
```
</details>

##### `getStats(): { totalPages: number; uniqueUrls: number; maxDepthReached: number; }`

<details><summary>Code</summary>

```ts
getStats() {
    return {
      totalPages: this.results.length,
      uniqueUrls: this.visited.size,
      maxDepthReached: Math.max(...this.results.map(r => r.depth), 0),
    };
  }
```
</details>


---

## Interfaces

### `CrawlOptions`

<details><summary>Interface Code</summary>

```ts
export interface CrawlOptions {
  maxDepth?: number;
  maxPages?: number;
  delay?: number;
  allowedDomains?: string[];
}
```
</details>

#### Properties

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `maxDepth` | `number` | ✓ |  |
| `maxPages` | `number` | ✓ |  |
| `delay` | `number` | ✓ |  |
| `allowedDomains` | `string[]` | ✓ |  |

### `CrawlResult`

<details><summary>Interface Code</summary>

```ts
export interface CrawlResult {
  url: string;
  title: string;
  links: string[];
  depth: number;
  statusCode: number;
}
```
</details>

#### Properties

| Name | Type | Optional | Description |
|------|------|----------|-------------|
| `url` | `string` | ✗ |  |
| `title` | `string` | ✗ |  |
| `links` | `string[]` | ✗ |  |
| `depth` | `number` | ✗ |  |
| `statusCode` | `number` | ✗ |  |


---