// functions/api/test-r2.ts
export async function onRequestGet(context: any) {
  const { env } = context;
  
  const result: any = {
    binding_exists: !!env.VAULT,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  };
  
  if (env.VAULT) {
    try {
      // Try to list objects
      const objects = await env.VAULT.list();
      result.list_success = true;
      result.file_count = objects.objects.length;
      result.files = objects.objects.map((obj: any) => ({
        key: obj.key,
        size: obj.size,
        uploaded: obj.uploaded
      }));
      
      // Try to get the specific file
      const fileName = "MPIntellect_Scalper_X1_V.1.ex5";
      const file = await env.VAULT.get(fileName);
      result.file_exists = !!file;
      if (file) {
        result.file_size = file.size;
        result.file_key = fileName;
      }
      
      // Try to get metadata
      const headResult = await env.VAULT.head(fileName);
      result.head_exists = !!headResult;
      
    } catch (error: any) {
      result.list_error = error.message;
      result.error_stack = error.stack;
    }
  } else {
    result.binding_error = "VAULT binding is not defined";
  }
  
  // Also test D1 connection
  if (env.DB) {
    try {
      const dbTest = await env.DB.prepare("SELECT 1 as test").first();
      result.db_connection = !!dbTest;
    } catch (error: any) {
      result.db_error = error.message;
    }
  }
  
  return new Response(JSON.stringify(result, null, 2), {
    headers: { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}