var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// .wrangler/tmp/bundle-KqtDRJ/checked-fetch.js
var urls = /* @__PURE__ */ new Set();
function checkURL(request, init) {
  const url = request instanceof URL ? request : new URL(
    (typeof request === "string" ? new Request(request, init) : request).url
  );
  if (url.port && url.port !== "443" && url.protocol === "https:") {
    if (!urls.has(url.toString())) {
      urls.add(url.toString());
      console.warn(
        `WARNING: known issue with \`fetch()\` requests to custom HTTPS ports in published Workers:
 - ${url.toString()} - the custom port will be ignored when the Worker is published using the \`wrangler deploy\` command.
`
      );
    }
  }
}
__name(checkURL, "checkURL");
globalThis.fetch = new Proxy(globalThis.fetch, {
  apply(target, thisArg, argArray) {
    const [request, init] = argArray;
    checkURL(request, init);
    return Reflect.apply(target, thisArg, argArray);
  }
});

// node_modules/itty-router/index.mjs
var e = /* @__PURE__ */ __name(({ base: e2 = "", routes: t = [], ...o2 } = {}) => ({ __proto__: new Proxy({}, { get: (o3, s2, r, n) => "handle" == s2 ? r.fetch : (o4, ...a) => t.push([s2.toUpperCase?.(), RegExp(`^${(n = (e2 + o4).replace(/\/+(\/|$)/g, "$1")).replace(/(\/?\.?):(\w+)\+/g, "($1(?<$2>*))").replace(/(\/?\.?):(\w+)/g, "($1(?<$2>[^$1/]+?))").replace(/\./g, "\\.").replace(/(\/?)\*/g, "($1.*)?")}/*$`), a, n]) && r }), routes: t, ...o2, async fetch(e3, ...o3) {
  let s2, r, n = new URL(e3.url), a = e3.query = { __proto__: null };
  for (let [e4, t2] of n.searchParams)
    a[e4] = a[e4] ? [].concat(a[e4], t2) : t2;
  for (let [a2, c2, i2, l2] of t)
    if ((a2 == e3.method || "ALL" == a2) && (r = n.pathname.match(c2))) {
      e3.params = r.groups || {}, e3.route = l2;
      for (let t2 of i2)
        if (null != (s2 = await t2(e3.proxy ?? e3, ...o3)))
          return s2;
    }
} }), "e");
var o = /* @__PURE__ */ __name((e2 = "text/plain; charset=utf-8", t) => (o2, { headers: s2 = {}, ...r } = {}) => void 0 === o2 || "Response" === o2?.constructor.name ? o2 : new Response(t ? t(o2) : o2, { headers: { "content-type": e2, ...s2.entries ? Object.fromEntries(s2) : s2 }, ...r }), "o");
var s = o("application/json; charset=utf-8", JSON.stringify);
var c = o("text/plain; charset=utf-8", String);
var i = o("text/html");
var l = o("image/jpeg");
var p = o("image/png");
var d = o("image/webp");

// src/config/cloudflare.js
async function uploadToCloudflareImages(buffer, metadata = {}, accountId, apiToken) {
  const formData = new FormData();
  formData.append("file", new Blob([buffer]));
  if (metadata) {
    formData.append("metadata", JSON.stringify(metadata));
  }
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v1`,
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiToken}`
      },
      body: formData
    }
  );
  const result = await response.json();
  if (!result.success) {
    throw new Error(result.errors[0].message);
  }
  return {
    id: result.result.id,
    url: result.result.variants[0]
  };
}
__name(uploadToCloudflareImages, "uploadToCloudflareImages");
async function uploadToCloudflareStream(buffer, metadata = {}, accountId, apiToken) {
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/stream`,
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiToken}`
      },
      body: buffer
    }
  );
  const result = await response.json();
  if (!result.success) {
    throw new Error(result.errors[0].message);
  }
  return {
    id: result.result.uid,
    url: `https://watch.cloudflarestream.com/${result.result.uid}`
  };
}
__name(uploadToCloudflareStream, "uploadToCloudflareStream");
async function deleteCloudflareImage(imageId, accountId, apiToken) {
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v1/${imageId}`,
    {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${apiToken}`
      }
    }
  );
  const result = await response.json();
  if (!result.success) {
    throw new Error(result.errors[0].message);
  }
}
__name(deleteCloudflareImage, "deleteCloudflareImage");
async function deleteCloudflareVideo(videoId2, accountId, apiToken) {
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/stream/${videoId2}`,
    {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${apiToken}`
      }
    }
  );
  const result = await response.json();
  if (!result.success) {
    throw new Error(result.errors[0].message);
  }
}
__name(deleteCloudflareVideo, "deleteCloudflareVideo");

// src/controllers/eventController.js
var EventController = class {
  async createEvent(req, env) {
    try {
      console.log("Starting createEvent");
      console.log("Account ID:", env.CLOUDFLARE_ACCOUNT_ID);
      console.log("API Token length:", env.CLOUDFLARE_API_TOKEN?.length);
      console.log("API Token first 10 chars:", env.CLOUDFLARE_API_TOKEN?.substring(0, 10));
      console.log("CLOUDFLARE_ACCOUNT_ID:", env.CLOUDFLARE_ACCOUNT_ID);
      console.log("API Token exists:", !!env.CLOUDFLARE_API_TOKEN);
      const formData = await req.formData();
      const eventData = JSON.parse(formData.get("data"));
      const eventId = crypto.randomUUID();
      let videoId2 = null;
      let videoUrl = null;
      const videoFile = formData.get("video");
      console.log("Video file exists:", !!videoFile);
      console.log("Video file size:", videoFile?.size);
      if (videoFile && videoFile.size > 0) {
        const videoBuffer = await videoFile.arrayBuffer();
        const videoResult = await uploadToCloudflareStream(
          videoBuffer,
          { eventId },
          env.CLOUDFLARE_ACCOUNT_ID,
          env.CLOUDFLARE_API_TOKEN
        );
        videoId2 = videoResult.id;
        videoUrl = videoResult.url;
      }
      const images2 = [];
      for (const [key, value] of formData.entries()) {
        if (key === "images" && value.size > 0) {
          const imageBuffer = await value.arrayBuffer();
          const imageResult = await uploadToCloudflareImages(
            imageBuffer,
            { eventId },
            env.CLOUDFLARE_ACCOUNT_ID,
            env.CLOUDFLARE_API_TOKEN
          );
          images2.push({
            id: crypto.randomUUID(),
            image_id: imageResult.id,
            url: imageResult.url
          });
        }
      }
      await env.DB.batch([
        env.DB.prepare(`
            INSERT INTO events (
              id, title, time_start, time_end, 
              description_content, description_format,
              video_id, video_url,
              created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
          `).bind(
          eventId,
          eventData.title,
          eventData.time.start,
          eventData.time.end,
          eventData.description.content,
          eventData.description.format,
          videoId2,
          videoUrl
        ),
        // Insert image data
        ...images2.map(
          (img) => env.DB.prepare(`
              INSERT INTO event_images (id, event_id, image_id, url) 
              VALUES (?, ?, ?, ?)
            `).bind(img.id, eventId, img.image_id, img.url)
        ),
        // Insert link data
        ...(eventData.links || []).map(
          (link) => env.DB.prepare(`
              INSERT INTO event_links (id, event_id, type, description, url)
              VALUES (?, ?, ?, ?, ?)
            `).bind(crypto.randomUUID(), eventId, link.type, link.description, link.url)
        ),
        // Insert tag data
        ...(eventData.tags || []).map(
          (tag) => env.DB.prepare(`
              INSERT INTO event_tags (event_id, tag)
              VALUES (?, ?)
            `).bind(eventId, tag)
        )
      ]);
      const event = await this.getEventById(env.DB, eventId);
      return Response.json({
        success: true,
        data: event
      }, { status: 201 });
    } catch (error) {
      console.error("Error in createEvent:", error);
      try {
        if (typeof videoId !== "undefined" && videoId) {
          await deleteCloudflareVideo(videoId, env.CLOUDFLARE_ACCOUNT_ID, env.CLOUDFLARE_API_TOKEN);
        }
        if (typeof images !== "undefined" && images?.length > 0) {
          await Promise.all(images.map(
            (img) => deleteCloudflareImage(img.image_id, env.CLOUDFLARE_ACCOUNT_ID, env.CLOUDFLARE_API_TOKEN)
          ));
        }
      } catch (cleanupError) {
        console.error("Error during cleanup:", cleanupError);
      }
      return Response.json({
        success: false,
        error: error.message
      }, { status: 400 });
    }
  }
  async getEvents(req, env) {
    try {
      const url = new URL(req.url);
      const tags = url.searchParams.get("tags");
      let query = `
          SELECT 
            e.*,
            json_group_array(DISTINCT json_object(
              'id', ei.id,
              'url', ei.url
            )) as images,
            json_group_array(DISTINCT et.tag) as tags,
            json_group_array(DISTINCT json_object(
              'type', el.type,
              'description', el.description,
              'url', el.url
            )) as links
          FROM events e
          LEFT JOIN event_images ei ON e.id = ei.event_id
          LEFT JOIN event_tags et ON e.id = et.event_id
          LEFT JOIN event_links el ON e.id = el.event_id
        `;
      const params = [];
      if (tags) {
        query += `
            WHERE e.id IN (
              SELECT event_id 
              FROM event_tags 
              WHERE tag IN (${tags.split(",").map(() => "?").join(",")})
              GROUP BY event_id
              HAVING COUNT(DISTINCT tag) = ?
            )
          `;
        params.push(...tags.split(","), tags.split(",").length);
      }
      query += " GROUP BY e.id ORDER BY e.created_at DESC";
      const events = await env.DB.prepare(query).bind(...params).all();
      return Response.json({
        success: true,
        data: events.results.map((event) => ({
          ...event,
          images: JSON.parse(event.images),
          tags: JSON.parse(event.tags),
          links: JSON.parse(event.links)
        }))
      });
    } catch (error) {
      console.error("Error in getEvents:", error);
      return Response.json({
        success: false,
        error: error.message
      }, { status: 400 });
    }
  }
  async getEvent(req, env) {
    try {
      const { id } = req.params;
      const event = await this.getEventById(env.DB, id);
      if (!event) {
        return Response.json({
          success: false,
          error: "Event not found"
        }, { status: 404 });
      }
      return Response.json({
        success: true,
        data: event
      });
    } catch (error) {
      console.error("Error in getEvent:", error);
      return Response.json({
        success: false,
        error: error.message
      }, { status: 400 });
    }
  }
  async updateEvent(req, env) {
    try {
      const { id } = req.params;
      const formData = await req.formData();
      const eventData = JSON.parse(formData.get("data"));
      const event = await this.getEventById(env.DB, id);
      if (!event) {
        return Response.json({
          success: false,
          error: "Event not found"
        }, { status: 404 });
      }
      let videoId2 = event.video_id;
      let videoUrl = event.video_url;
      const videoFile = formData.get("video");
      if (videoFile && videoFile.size > 0) {
        if (event.video_id) {
          await deleteCloudflareVideo(event.video_id, env.CLOUDFLARE_ACCOUNT_ID, env.CLOUDFLARE_API_TOKEN);
        }
        const videoBuffer = await videoFile.arrayBuffer();
        const videoResult = await uploadToCloudflareStream(
          videoBuffer,
          { eventId: event.id },
          env.CLOUDFLARE_ACCOUNT_ID,
          env.CLOUDFLARE_API_TOKEN
        );
        videoId2 = videoResult.id;
        videoUrl = videoResult.url;
      }
      let newImages = [];
      let hasNewImages = false;
      for (const [key, value] of formData.entries()) {
        if (key === "images" && value.size > 0) {
          hasNewImages = true;
          const imageBuffer = await value.arrayBuffer();
          const imageResult = await uploadToCloudflareImages(
            imageBuffer,
            { eventId: event.id },
            env.CLOUDFLARE_ACCOUNT_ID,
            env.CLOUDFLARE_API_TOKEN
          );
          newImages.push({
            id: crypto.randomUUID(),
            image_id: imageResult.id,
            url: imageResult.url
          });
        }
      }
      if (hasNewImages && event.images) {
        await Promise.all(
          event.images.map(
            (img) => deleteCloudflareImage(img.image_id, env.CLOUDFLARE_ACCOUNT_ID, env.CLOUDFLARE_API_TOKEN)
          )
        );
      }
      await env.DB.batch([
        env.DB.prepare(`
            UPDATE events 
            SET title = ?, time_start = ?, time_end = ?, 
                description_content = ?, description_format = ?,
                video_id = ?, video_url = ?,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
          `).bind(
          eventData.title,
          eventData.time.start,
          eventData.time.end,
          eventData.description.content,
          eventData.description.format,
          videoId2,
          videoUrl,
          event.id
        ),
        // Delete old related data
        env.DB.prepare("DELETE FROM event_images WHERE event_id = ?").bind(event.id),
        env.DB.prepare("DELETE FROM event_links WHERE event_id = ?").bind(event.id),
        env.DB.prepare("DELETE FROM event_tags WHERE event_id = ?").bind(event.id),
        // Insert new image data
        ...newImages.map(
          (img) => env.DB.prepare(`
              INSERT INTO event_images (id, event_id, image_id, url)
              VALUES (?, ?, ?, ?)
            `).bind(img.id, event.id, img.image_id, img.url)
        ),
        // Insert new link data
        ...(eventData.links || []).map(
          (link) => env.DB.prepare(`
              INSERT INTO event_links (id, event_id, type, description, url)
              VALUES (?, ?, ?, ?, ?)
            `).bind(crypto.randomUUID(), event.id, link.type, link.description, link.url)
        ),
        // Insert new tag data
        ...(eventData.tags || []).map(
          (tag) => env.DB.prepare(`
              INSERT INTO event_tags (event_id, tag)
              VALUES (?, ?)
            `).bind(event.id, tag)
        )
      ]);
      const updatedEvent = await this.getEventById(env.DB, event.id);
      return Response.json({
        success: true,
        data: updatedEvent
      });
    } catch (error) {
      console.error("Error in updateEvent:", error);
      return Response.json({
        success: false,
        error: error.message
      }, { status: 400 });
    }
  }
  async deleteEvent(req, env) {
    try {
      const { id } = req.params;
      const event = await this.getEventById(env.DB, id);
      if (!event) {
        return Response.json({
          success: false,
          error: "Event not found"
        }, { status: 404 });
      }
      if (event.video_id) {
        await deleteCloudflareVideo(event.video_id, env.CLOUDFLARE_ACCOUNT_ID, env.CLOUDFLARE_API_TOKEN);
      }
      if (event.images && event.images.length > 0) {
        await Promise.all(
          event.images.map(
            (img) => deleteCloudflareImage(img.image_id, env.CLOUDFLARE_ACCOUNT_ID, env.CLOUDFLARE_API_TOKEN)
          )
        );
      }
      await env.DB.prepare("DELETE FROM events WHERE id = ?").bind(event.id).run();
      return Response.json({
        success: true,
        data: {}
      });
    } catch (error) {
      console.error("Error in deleteEvent:", error);
      return Response.json({
        success: false,
        error: error.message
      }, { status: 400 });
    }
  }
  // Helper function: Get complete event data
  async getEventById(db, eventId) {
    const query = `
        SELECT 
          e.*,
          json_group_array(DISTINCT json_object(
            'id', ei.id,
            'image_id', ei.image_id,
            'url', ei.url
          )) as images,
          json_group_array(DISTINCT et.tag) as tags,
          json_group_array(DISTINCT json_object(
            'type', el.type,
            'description', el.description,
            'url', el.url
          )) as links
        FROM events e
        LEFT JOIN event_images ei ON e.id = ei.event_id
        LEFT JOIN event_tags et ON e.id = et.event_id
        LEFT JOIN event_links el ON e.id = el.event_id
        WHERE e.id = ?
        GROUP BY e.id
      `;
    const result = await db.prepare(query).bind(eventId).first();
    if (!result)
      return null;
    return {
      ...result,
      images: JSON.parse(result.images),
      tags: JSON.parse(result.tags),
      links: JSON.parse(result.links)
    };
  }
};
__name(EventController, "EventController");
var eventController_default = new EventController();

// src/index.js
var router = e({ base: "/" });
var corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization"
};
function addCorsHeaders(response) {
  const newHeaders = new Headers(response.headers);
  Object.entries(corsHeaders).forEach(([key, value]) => {
    newHeaders.set(key, value);
  });
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders
  });
}
__name(addCorsHeaders, "addCorsHeaders");
router.get("/api/check-auth", async (request, env) => {
  try {
    const testResponse = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ACCOUNT_ID}/images/v1/direct_upload`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${env.CLOUDFLARE_API_TOKEN}`
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
}).post("/api/test-image-upload", async (request, env) => {
  try {
    const formData = await request.formData();
    const imageFile = formData.get("image");
    if (!imageFile) {
      throw new Error("No image file provided");
    }
    const imageBuffer = await imageFile.arrayBuffer();
    const uploadFormData = new FormData();
    uploadFormData.append("file", new Blob([imageBuffer]));
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ACCOUNT_ID}/images/v1`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${env.CLOUDFLARE_API_TOKEN}`
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
}).get("/api/events", async (request, env) => addCorsHeaders(await eventController_default.getEvents(request, env))).get("/api/events/:id", async (request, env) => addCorsHeaders(await eventController_default.getEvent(request, env))).post("/api/events", async (request, env) => addCorsHeaders(await eventController_default.createEvent(request, env))).put("/api/events/:id", async (request, env) => addCorsHeaders(await eventController_default.updateEvent(request, env))).delete("/api/events/:id", async (request, env) => addCorsHeaders(await eventController_default.deleteEvent(request, env))).options("*", () => new Response(null, { headers: corsHeaders })).all("*", () => new Response("Not Found", { status: 404, headers: corsHeaders }));
var handleErrors = /* @__PURE__ */ __name((fn) => async (request, env, ctx) => {
  try {
    const response = await fn(request, env, ctx);
    return response;
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({
        success: false,
        error: err.message || "Internal Server Error"
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      }
    );
  }
}, "handleErrors");
var src_default = {
  fetch: handleErrors(async (request, env, ctx) => {
    return router.handle(request, env, ctx);
  })
};

// node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e2) {
      console.error("Failed to drain the unused request body.", e2);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e2) {
  return {
    name: e2?.name,
    message: e2?.message ?? String(e2),
    stack: e2?.stack,
    cause: e2?.cause === void 0 ? void 0 : reduceError(e2.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e2) {
    const error = reduceError(e2);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-KqtDRJ/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = src_default;

// node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-KqtDRJ/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof __Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
__name(__Facade_ScheduledController__, "__Facade_ScheduledController__");
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = (request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    };
    #dispatcher = (type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    };
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=index.js.map
