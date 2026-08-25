import { app } from './app.js';
import { config } from './config.js';

const PORT = config.PORT || 8080;

app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`🚀 Fundable AI Cloud Run API Service Listening`);
  console.log(`   Port: ${PORT}`);
  console.log(`   Environment: ${config.NODE_ENV}`);
  console.log(`   GCP Project: ${config.GCP_PROJECT_ID} (${config.GCP_REGION})`);
  console.log(`==================================================`);
});
