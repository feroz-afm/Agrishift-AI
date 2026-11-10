// Vercel serverless function: GET /api/health
import { nodeHandler } from '../server/handlers.js';

export default nodeHandler('health');
