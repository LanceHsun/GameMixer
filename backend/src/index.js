import { Router } from 'itty-router';
import eventController from './controllers/eventController';

// Create router
const router = Router({ base: '/' });

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Add CORS to responses
function addCorsHeaders(response) {
  const newHeaders = new Headers(response.headers);
  Object.entries(corsHeaders).forEach(([key, value]) => {
    newHeaders.set(key, value);
  });
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
  });
}

// Routes
router
  .get('/api/check-auth', async (request, env) => {
    try {
      const testResponse = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ACCOUNT_ID}/images/v1/direct_upload`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${env.CLOUDFLARE_API_TOKEN}`
          }
        }
      );
      const result = await testResponse.json();
      return Response.json({
        success: true,
        account_id: env.CLOUDFLARE_ACCOUNT_ID,
        token_exists: !!env.CLOUDFLARE_API_TOKEN,
        can_upload: result.success,
        details: result
      });
    } catch (error) {
      return Response.json({
        success: false,
        error: error.message,
        account_id: env.CLOUDFLARE_ACCOUNT_ID,
        token_exists: !!env.CLOUDFLARE_API_TOKEN
      });
    }
  })
  .post('/api/test-image-upload', async (request, env) => {
    try {
      const formData = await request.formData();
      const imageFile = formData.get('image');
      if (!imageFile) {
        throw new Error('No image file provided');
      }
      
      const imageBuffer = await imageFile.arrayBuffer();
      const uploadFormData = new FormData();
      uploadFormData.append('file', new Blob([imageBuffer]));
      
      const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ACCOUNT_ID}/images/v1`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${env.CLOUDFLARE_API_TOKEN}`
          },
          body: uploadFormData
        }
      );
      
      const result = await response.json();
      return Response.json({
        success: true,
        upload_result: result
      });
    } catch (error) {
      return Response.json({
        success: false,
        error: error.message
      }, { status: 400 });
    }
  })
  .get('/api/events', async (request, env) => addCorsHeaders(await eventController.getEvents(request, env)))
  .get('/api/events/:id', async (request, env) => addCorsHeaders(await eventController.getEvent(request, env)))
  .post('/api/events', async (request, env) => addCorsHeaders(await eventController.createEvent(request, env)))
  .put('/api/events/:id', async (request, env) => addCorsHeaders(await eventController.updateEvent(request, env)))
  .delete('/api/events/:id', async (request, env) => addCorsHeaders(await eventController.deleteEvent(request, env)))
  .options('*', () => new Response(null, { headers: corsHeaders }))
  .all('*', () => new Response('Not Found', { status: 404, headers: corsHeaders }));

// Error handler wrapper
const handleErrors = fn => async (request, env, ctx) => {
  try {
    const response = await fn(request, env, ctx);
    return response;
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({
        success: false,
        error: err.message || 'Internal Server Error'
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    );
  }
};

// Workers entry point
export default {
  fetch: handleErrors(async (request, env, ctx) => {
    return router.handle(request, env, ctx);
  })
};