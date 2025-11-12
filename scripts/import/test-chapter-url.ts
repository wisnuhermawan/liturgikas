import axios from 'axios';
import * as cheerio from 'cheerio';

/**
 * Test fetching a full chapter (not just a single verse)
 * to see what HTML structure we get
 */

const testChapterFetch = async () => {
  const baseUrl = 'https://www.imankatolik.or.id';

  // Test patterns:
  // 1. Just chapter: Yoh3
  // 2. Chapter with verse range: Yoh3:1-36
  // 3. Chapter with all verses: Yoh3:1-

  const testUrls = [
    `${baseUrl}/alkitabq.php?q=Yoh3`, // Full chapter
    `${baseUrl}/alkitabq.php?q=Yoh3:1-36`, // Verse range
    `${baseUrl}/alkitabq.php?q=Yoh3:1-`, // All verses from 1
  ];

  for (const url of testUrls) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Testing: ${url}`);
    console.log('='.repeat(60));

    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        },
        timeout: 10000,
      });

      const $ = cheerio.load(response.data);

      // Count verses
      const verses = $('table tr').filter((i, el) => {
        const cells = $(el).find('td.v');
        return cells.length === 2;
      });

      console.log(`✅ Response received (${response.data.length} bytes)`);
      console.log(`📊 Verses found: ${verses.length}`);

      if (verses.length > 0) {
        console.log('\n📖 Sample verses:');
        verses.slice(0, 3).each((i, el) => {
          const cells = $(el).find('td.v');
          const ref = $(cells[0]).text().trim();
          const text = $(cells[1]).text().trim().substring(0, 80);
          console.log(`   ${ref}: ${text}...`);
        });
      } else {
        console.log('\n⚠️  No verses found! HTML structure:');
        console.log(response.data.substring(0, 1000));
      }
    } catch (error: any) {
      console.error(`❌ Error: ${error.message}`);
    }

    // Delay between requests
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
};

testChapterFetch();
