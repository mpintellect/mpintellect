// functions/utils/state-manager.ts

// This uses Cloudflare KV to track last post times across cron runs

export interface PostState {
  lastPostTimes: Record<string, number>;  // symbol -> timestamp
  dailyCounts: Record<string, number>;    // symbol_date -> count
  lastDate: string;                       // YYYY-MM-DD
}

export async function getPostState(kv: any): Promise<PostState> {
  const state = await kv.get('telegram_post_state', 'json');
  const today = new Date().toISOString().split('T')[0];
  
  if (state && state.lastDate === today) {
    return state as PostState;
  }
  
  // New day - reset counters
  const newState: PostState = {
    lastPostTimes: {},
    dailyCounts: {},
    lastDate: today,
  };
  
  await kv.put('telegram_post_state', JSON.stringify(newState));
  return newState;
}

export async function updatePostState(kv: any, symbol: string, currentState: PostState): Promise<void> {
  const now = Date.now();
  
  // Update last post time
  currentState.lastPostTimes[symbol] = now;
  
  // Update daily count
  const today = new Date().toISOString().split('T')[0];
  const countKey = `${symbol}_${today}`;
  currentState.dailyCounts[countKey] = (currentState.dailyCounts[countKey] || 0) + 1;
  
  await kv.put('telegram_post_state', JSON.stringify(currentState));
}