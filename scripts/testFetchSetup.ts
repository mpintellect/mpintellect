// Use your actual Firebase config from lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";

// ✅ YOUR ACTUAL FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyCzDwXsMJUgyu1z1VPgViBKwZga0chpHgU",
  authDomain: "mzprimer-livefeed.firebaseapp.com",
  projectId: "mzprimer-livefeed",
  storageBucket: "mzprimer-livefeed.firebasestorage.app",
  messagingSenderId: "195204575766",
  appId: "1:195204575766:web:a5ffcbb29c0336bda6bb37",
  measurementId: "G-Y27R5QMCLZ"
};

console.log("🔧 Initializing Firebase with project:", firebaseConfig.projectId);

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

console.log("✅ Firebase initialized successfully");

async function testFetchSetup() {
  const symbol = "XAUUSD";
  
  try {
    console.log(`\n🔍 Testing Firestore fetch for: ${symbol}`);
    console.log(`📁 Document path: trade_setups/${symbol}`);
    
    // ✅ CORRECT PATH: trade_setups/XAUUSD (document, not subcollection)
    const docRef = doc(db, "trade_setups", symbol);
    const docSnap = await getDoc(docRef);
    
    console.log(`📄 Document exists: ${docSnap.exists()}`);

    if (docSnap.exists()) {
      const data = docSnap.data();
      console.log("\n✅ SUCCESS: Document found!");
      
      // Access the nested 'latest' object
      const latestData = data.latest;
      
      if (latestData) {
        console.log("📊 LATEST SETUP DATA:");
        console.log(`   Symbol: ${latestData.symbol || symbol}`);
        console.log(`   Final Decision: ${latestData.final_decision || 'N/A'}`);
        console.log(`   Confidence: ${latestData.confidence?.confidence_score || 'N/A'}%`);
        console.log(`   Entry Zone: [${latestData.entry_zone?.entry_zone?.[0] || 0}, ${latestData.entry_zone?.entry_zone?.[1] || 0}]`);
        console.log(`   TP Level: ${latestData.tp_sl?.tp_level || 0}`);
        console.log(`   SL Level: ${latestData.tp_sl?.sl_level || 0}`);
        console.log(`   RR Ratio: ${latestData.tp_sl?.rr_ratio || 0}`);
        
        // Check for the specific issue
        const entryZone = latestData.entry_zone?.entry_zone || [0, 0];
        const hasValidEntryZone = entryZone[0] !== 0 && entryZone[1] !== 0;
        const hasValidTP = latestData.tp_sl?.tp_level && latestData.tp_sl.tp_level !== 0;
        const hasValidSL = latestData.tp_sl?.sl_level && latestData.tp_sl.sl_level !== 0;
        
        console.log("\n🔍 VALIDATION CHECK:");
        console.log(`   Entry Zone Valid: ${hasValidEntryZone ? '✅' : '❌'}`);
        console.log(`   TP Level Valid: ${hasValidTP ? '✅' : '❌'}`);
        console.log(`   SL Level Valid: ${hasValidSL ? '✅' : '❌'}`);
        
        if (!hasValidEntryZone) {
          console.log("\n⚠️  PROBLEM IDENTIFIED: Entry zone contains [0, 0] values");
          console.log("   This is why the AiChatBox shows 'Setup not available'");
        }
        
        if (hasValidEntryZone && hasValidTP && hasValidSL) {
          console.log("\n🎉 ALL CHECKS PASSED! The setup data is valid.");
        } else {
          console.log("\n❌ DATA ISSUES: Some fields contain invalid values");
        }
      } else {
        console.log("❌ No 'latest' data found in the document");
      }
      
    } else {
      console.log("\n❌ No document found at path: trade_setups/XAUUSD");
    }
    
  } catch (error) {
    console.error("\n❌ ERROR:", error);
  }
}

// Run the test
testFetchSetup().then(() => {
  console.log("\n🏁 Test completed");
  process.exit(0);
});