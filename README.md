# TypeScript Web Crawler

A simple, educational web crawler built with TypeScript. This project demonstrates how to build a basic web scraper that can crawl websites, extract links, and respect crawling limits.

## Features

- Recursive link crawling with configurable depth
- Domain restrictions to keep crawls focused
- Configurable rate limiting to be respectful to servers
- Link extraction and page metadata collection
- Built-in statistics tracking
- Clean TypeScript implementation with type safety

## Installation

First, install the dependencies:

```bash
npm install
```

## Usage

### Running the Examples

The project includes example usage in `src/example.ts`. You can run it in two ways:

**Development mode (with ts-node):**
```bash
npm run dev
```

**Production mode (compiled):**
```bash
npm run build
npm start
```

### Using the Crawler in Your Code

```typescript
import { WebCrawler } from './crawler';

const crawler = new WebCrawler({
  maxDepth: 2,        // How deep to crawl from starting URL
  maxPages: 50,       // Maximum number of pages to crawl
  delay: 1000,        // Delay between requests in milliseconds
  allowedDomains: ['example.com'], // Restrict to specific domains
});

const results = await crawler.crawl('https://example.com');

// Access results
results.forEach(result => {
  console.log(result.title);
  console.log(result.url);
  console.log(result.links);
});

// Get statistics
const stats = crawler.getStats();
console.log(stats);
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `maxDepth` | number | 2 | Maximum depth to crawl from starting URL |
| `maxPages` | number | 50 | Maximum total pages to crawl |
| `delay` | number | 1000 | Delay in milliseconds between requests |
| `allowedDomains` | string[] | [] | Whitelist of allowed domains (empty = all domains) |

## Project Structure

```
.
├── src/
│   ├── crawler.ts    # Main crawler implementation
│   └── example.ts    # Example usage
├── dist/             # Compiled JavaScript output
├── package.json
├── tsconfig.json
└── README.md
```

## Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run the compiled code
- `npm run dev` - Run directly with ts-node
- `npm run clean` - Remove compiled files

## How It Works

1. **URL Queue**: Starting from an initial URL, the crawler fetches the page content
2. **HTML Parsing**: Uses Cheerio to parse HTML and extract links
3. **Link Discovery**: Finds all `<a>` tags and converts relative URLs to absolute
4. **Recursive Crawling**: Follows discovered links up to the configured depth
5. **Rate Limiting**: Waits between requests to avoid overwhelming servers
6. **Domain Filtering**: Optionally restricts crawling to specific domains

## Dependencies

- **axios** - HTTP client for fetching web pages
- **cheerio** - Fast, flexible HTML parsing (jQuery-like API)
- **typescript** - Type-safe JavaScript
- **ts-node** - Execute TypeScript directly for development

## Notes for Production Use

This is an educational example. For production use, consider:

- Adding robots.txt parsing and respect
- Implementing better error handling and retry logic
- Adding request queuing and concurrency control
- Implementing caching to avoid re-crawling pages
- Adding content extraction and storage
- Implementing politeness policies per domain
- Adding proxy support for large-scale crawling

## License

MIT
