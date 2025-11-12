import axios from 'axios';
import * as cheerio from 'cheerio';

/**
 * Test fetching Bible data from imankatolik.or.id
 * URL Pattern: /alkitabq.php?q=[Kitab][Bab]:[Ayat]
 * Example: /alkitabq.php?q=Yoh3:16
 */

const testFetch = async () => {
  const baseUrl = 'https://www.imankatolik.or.id';

  // Test dengan Yohanes 3:16 (ayat terkenal)
  const testQuery = 'Yoh3:16';
  const url = `${baseUrl}/alkitabq.php?q=${testQuery}`;

  console.log('🔍 Testing Bible data fetch...');
  console.log(`📍 URL: ${url}\n`);

  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      },
      timeout: 10000,
    });

    console.log('✅ Request successful!');
    console.log(`📊 Status: ${response.status}`);
    console.log(`📏 Content Length: ${response.data.length} characters\n`);

    // Parse HTML
    const $ = cheerio.load(response.data);

    // Try to find the verse text
    // We need to inspect the HTML to find the right selector
    console.log('📖 Page Title:', $('title').text());
    console.log('\n📄 Full HTML (first 1000 chars):');
    console.log(response.data.substring(0, 1000));
    console.log('\n...\n');

    // Save to file for manual inspection
    const fs = await import('fs');
    const path = './scripts/import/test-response.html';
    fs.writeFileSync(path, response.data);
    console.log(`💾 Full HTML saved to: ${path}`);
    console.log('🔍 Please inspect this file to find the correct CSS selectors\n');

  } catch (error: any) {
    console.error('❌ Error fetching data:', error.message);
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Data:`, error.response.data.substring(0, 500));
    }
  }
};

testFetch();
