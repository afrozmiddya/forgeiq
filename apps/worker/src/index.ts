import { JobOrchestrator } from './orchestrator';
import { ChunkProcessor } from './processor';

async function bootstrap() {
  console.log('🚀 ForgeIQ Worker Daemon Starting...');
  
  const orchestrator = new JobOrchestrator();
  const processor = new ChunkProcessor();
  
  // Continuous polling loop
  setInterval(async () => {
    // 1. Orchestrator polls and slices
    await orchestrator.pollAndSlice();
    
    // 2. Worker claims chunks and processes them
    let chunk = orchestrator.claimNextChunk();
    while (chunk) {
      await processor.process(chunk);
      chunk = orchestrator.claimNextChunk();
    }
  }, 5000); // Poll every 5 seconds
}

bootstrap().catch(console.error);
