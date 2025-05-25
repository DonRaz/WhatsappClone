// Simple script to test if your Mistral API key is working
// Run with: node test-api-key.js

require('dotenv').config();

async function testMistralAPIKey() {
  const apiKey = process.env.MISTRAL_API_KEY;
  
  console.log('🔍 Testing Mistral API Key...\n');
  
  // Check if API key exists
  if (!apiKey) {
    console.error('❌ MISTRAL_API_KEY not found in environment variables');
    console.log('Available env vars containing "MISTRAL":', 
      Object.keys(process.env).filter(key => key.includes('MISTRAL'))
    );
    return;
  }
  
  console.log(`✅ API Key found: ${apiKey.substring(0, 8)}... (length: ${apiKey.length})`);
  
  // Test with a simple API call (list models)
  try {
    console.log('🔄 Testing API key with Mistral models endpoint...');
    
    const response = await fetch('https://api.mistral.ai/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log(`📥 Response status: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ API Key is valid!');
      console.log('Available models:', data.data?.map(m => m.id).slice(0, 5));
      
      // Check if OCR model is available
      const ocrModel = data.data?.find(m => m.id.includes('ocr'));
      if (ocrModel) {
        console.log('✅ OCR model found:', ocrModel.id);
      } else {
        console.log('⚠️  OCR model not found in available models');
        console.log('   Your API key might not have access to OCR functionality');
      }
    } else {
      const errorText = await response.text();
      console.error('❌ API Key validation failed');
      console.error('Error:', errorText);
    }
    
  } catch (error) {
    console.error('💥 Error testing API key:', error.message);
  }
}

// Test OCR endpoint specifically
async function testOCREndpoint() {
  const apiKey = process.env.MISTRAL_API_KEY;
  
  if (!apiKey) {
    console.log('❌ Cannot test OCR endpoint without API key');
    return;
  }
  
  console.log('\n🔄 Testing OCR endpoint accessibility...');
  
  try {
    // Test with minimal payload to see if endpoint is accessible
    const response = await fetch('https://api.mistral.ai/v1/ocr', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'mistral-ocr-latest',
        document: {
          type: 'document_url',
          document_url: 'data:application/pdf;base64,invalid'
        }
      })
    });
    
    console.log(`📥 OCR endpoint response: ${response.status} ${response.statusText}`);
    
    if (response.status === 401) {
      console.error('❌ Unauthorized - API key invalid or no OCR access');
    } else if (response.status === 400) {
      console.log('✅ OCR endpoint accessible (400 expected for invalid data)');
    } else {
      console.log(`ℹ️  Unexpected status: ${response.status}`);
    }
    
  } catch (error) {
    console.error('💥 Error testing OCR endpoint:', error.message);
  }
}

// Run tests
async function runAllTests() {
  await testMistralAPIKey();
  await testOCREndpoint();
  
  console.log('\n📋 Debugging checklist:');
  console.log('1. ✅ Check if .env file exists in your server directory');
  console.log('2. ✅ Verify MISTRAL_API_KEY is set in .env file');
  console.log('3. ✅ Restart your Express server after adding the API key');
  console.log('4. ✅ Make sure you have OCR access with your Mistral subscription');
  console.log('5. ✅ Check if your API key has the correct permissions');
}

runAllTests().catch(console.error);