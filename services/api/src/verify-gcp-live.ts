import { Firestore } from '@google-cloud/firestore';
import { Storage } from '@google-cloud/storage';
import path from 'node:path';
import fs from 'node:fs';

const PROJECT_ID = process.env.GCP_PROJECT_ID || 'qwiklabs-gcp-04-4ec1124148fe';

function getCredentialsPath(): string | undefined {
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS && fs.existsSync(process.env.GOOGLE_APPLICATION_CREDENTIALS)) {
    return process.env.GOOGLE_APPLICATION_CREDENTIALS;
  }
  const defaultLocalSa = path.resolve(process.cwd(), 'services/api/service-account.json');
  if (fs.existsSync(defaultLocalSa)) {
    return defaultLocalSa;
  }
  return undefined;
}

async function main() {
  const saPath = getCredentialsPath();
  console.log(`Live Verification Credentials: ${saPath || 'ADC / Runtime Environment Credentials'}`);

  console.log('\n--- 1. Testing Firestore Live Write/Read/Delete ---');
  try {
    const firestore = new Firestore({ projectId: PROJECT_ID, keyFilename: saPath });
    const docRef = firestore.collection('_system_verification').doc(`live_test_${Date.now()}`);
    
    // WRITE
    await docRef.set({
      service: 'firestore',
      status: 'VERIFIED_LIVE',
      timestamp: new Date().toISOString()
    });
    console.log('✅ Firestore Write: SUCCESS');

    // READ
    const snap = await docRef.get();
    if (snap.exists && snap.data()?.status === 'VERIFIED_LIVE') {
      console.log('✅ Firestore Read: SUCCESS', snap.data());
    } else {
      console.error('❌ Firestore Read: FAILED snapshot not found');
    }

    // DELETE
    await docRef.delete();
    const deletedSnap = await docRef.get();
    if (!deletedSnap.exists) {
      console.log('✅ Firestore Delete: SUCCESS');
    }
  } catch (err: any) {
    console.error('❌ Firestore Test Failed:', err.message);
  }

  console.log('\n--- 2. Testing Cloud Storage Live Upload/Read/Delete ---');
  try {
    const storage = new Storage({ projectId: PROJECT_ID, keyFilename: saPath });
    const bucketName = 'fundable-ai-documents-qwiklabs';
    const bucket = storage.bucket(bucketName);
    const fileName = `live_test_${Date.now()}.txt`;
    const file = bucket.file(fileName);

    // UPLOAD
    await file.save('Fundable AI Live GCS Verification Token', { contentType: 'text/plain' });
    console.log('✅ Cloud Storage Upload: SUCCESS');

    // GET METADATA
    const [meta] = await file.getMetadata();
    console.log(`✅ Cloud Storage Metadata: SUCCESS (Name: ${meta.name}, Size: ${meta.size} bytes)`);

    // DOWNLOAD / READ
    const [buf] = await file.download();
    console.log(`✅ Cloud Storage Download: SUCCESS ("${buf.toString('utf-8')}")`);

    // DELETE
    await file.delete();
    console.log('✅ Cloud Storage Delete: SUCCESS');
  } catch (err: any) {
    console.error('❌ Cloud Storage Test Failed:', err.message);
  }
}

main().catch(console.error);
