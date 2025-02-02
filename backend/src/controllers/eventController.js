import {
    uploadToCloudflareImages,
    uploadToCloudflareStream,
    deleteCloudflareImage,
    deleteCloudflareVideo
  } from '../config/cloudflare';
  
  class EventController {
    async createEvent(req, env) {
      try {
        console.log('Starting createEvent');
        console.log('Account ID:', env.CLOUDFLARE_ACCOUNT_ID);
        console.log('API Token length:', env.CLOUDFLARE_API_TOKEN?.length);
        console.log('API Token first 10 chars:', env.CLOUDFLARE_API_TOKEN?.substring(0, 10));
        console.log('CLOUDFLARE_ACCOUNT_ID:', env.CLOUDFLARE_ACCOUNT_ID);
        console.log('API Token exists:', !!env.CLOUDFLARE_API_TOKEN);
  
        const formData = await req.formData();
        const eventData = JSON.parse(formData.get('data'));
        const eventId = crypto.randomUUID();
        
        // Handle video upload
        let videoId = null;
        let videoUrl = null;
        const videoFile = formData.get('video');
        console.log('Video file exists:', !!videoFile);
        console.log('Video file size:', videoFile?.size);
        
        if (videoFile && videoFile.size > 0) {
          const videoBuffer = await videoFile.arrayBuffer();
          const videoResult = await uploadToCloudflareStream(
            videoBuffer,
            { eventId },
            env.CLOUDFLARE_ACCOUNT_ID,
            env.CLOUDFLARE_API_TOKEN
          );
          videoId = videoResult.id;
          videoUrl = videoResult.url;
        }
  
        // Handle image uploads
        const images = [];
        for (const [key, value] of formData.entries()) {
          if (key === 'images' && value.size > 0) {
            const imageBuffer = await value.arrayBuffer();
            const imageResult = await uploadToCloudflareImages(
              imageBuffer,
              { eventId },
              env.CLOUDFLARE_ACCOUNT_ID,
              env.CLOUDFLARE_API_TOKEN
            );
            images.push({
              id: crypto.randomUUID(),
              image_id: imageResult.id,
              url: imageResult.url
            });
          }
        }
  
        // Database transaction
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
            videoId,
            videoUrl
          ),
  
          // Insert image data
          ...images.map(img => 
            env.DB.prepare(`
              INSERT INTO event_images (id, event_id, image_id, url) 
              VALUES (?, ?, ?, ?)
            `).bind(img.id, eventId, img.image_id, img.url)
          ),
  
          // Insert link data
          ...(eventData.links || []).map(link =>
            env.DB.prepare(`
              INSERT INTO event_links (id, event_id, type, description, url)
              VALUES (?, ?, ?, ?, ?)
            `).bind(crypto.randomUUID(), eventId, link.type, link.description, link.url)
          ),
  
          // Insert tag data
          ...(eventData.tags || []).map(tag =>
            env.DB.prepare(`
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
        console.error('Error in createEvent:', error);
        try {
          // Cleanup uploaded files if error occurs
          if (typeof videoId !== 'undefined' && videoId) {
            await deleteCloudflareVideo(videoId, env.CLOUDFLARE_ACCOUNT_ID, env.CLOUDFLARE_API_TOKEN);
          }
          if (typeof images !== 'undefined' && images?.length > 0) {
            await Promise.all(images.map(img => 
              deleteCloudflareImage(img.image_id, env.CLOUDFLARE_ACCOUNT_ID, env.CLOUDFLARE_API_TOKEN)
            ));
          }
        } catch (cleanupError) {
          console.error('Error during cleanup:', cleanupError);
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
        const tags = url.searchParams.get('tags');
        
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
              WHERE tag IN (${tags.split(',').map(() => '?').join(',')})
              GROUP BY event_id
              HAVING COUNT(DISTINCT tag) = ?
            )
          `;
          params.push(...tags.split(','), tags.split(',').length);
        }
  
        query += ' GROUP BY e.id ORDER BY e.created_at DESC';
  
        const events = await env.DB.prepare(query)
          .bind(...params)
          .all();
  
        return Response.json({
          success: true,
          data: events.results.map(event => ({
            ...event,
            images: JSON.parse(event.images),
            tags: JSON.parse(event.tags),
            links: JSON.parse(event.links)
          }))
        });
      } catch (error) {
        console.error('Error in getEvents:', error);
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
            error: 'Event not found'
          }, { status: 404 });
        }
  
        return Response.json({
          success: true,
          data: event
        });
      } catch (error) {
        console.error('Error in getEvent:', error);
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
        const eventData = JSON.parse(formData.get('data'));
        
        const event = await this.getEventById(env.DB, id);
        if (!event) {
          return Response.json({
            success: false,
            error: 'Event not found'
          }, { status: 404 });
        }
  
        // Handle video update
        let videoId = event.video_id;
        let videoUrl = event.video_url;
        const videoFile = formData.get('video');
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
          videoId = videoResult.id;
          videoUrl = videoResult.url;
        }
  
        // Handle image updates
        let newImages = [];
        let hasNewImages = false;
        for (const [key, value] of formData.entries()) {
          if (key === 'images' && value.size > 0) {
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
  
        // Delete old images if new ones are uploaded
        if (hasNewImages && event.images) {
          await Promise.all(
            event.images.map(img => 
              deleteCloudflareImage(img.image_id, env.CLOUDFLARE_ACCOUNT_ID, env.CLOUDFLARE_API_TOKEN)
            )
          );
        }
  
        // Update database
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
            videoId,
            videoUrl,
            event.id
          ),
  
          // Delete old related data
          env.DB.prepare('DELETE FROM event_images WHERE event_id = ?').bind(event.id),
          env.DB.prepare('DELETE FROM event_links WHERE event_id = ?').bind(event.id),
          env.DB.prepare('DELETE FROM event_tags WHERE event_id = ?').bind(event.id),
  
          // Insert new image data
          ...newImages.map(img => 
            env.DB.prepare(`
              INSERT INTO event_images (id, event_id, image_id, url)
              VALUES (?, ?, ?, ?)
            `).bind(img.id, event.id, img.image_id, img.url)
          ),
  
          // Insert new link data
          ...(eventData.links || []).map(link =>
            env.DB.prepare(`
              INSERT INTO event_links (id, event_id, type, description, url)
              VALUES (?, ?, ?, ?, ?)
            `).bind(crypto.randomUUID(), event.id, link.type, link.description, link.url)
          ),
  
          // Insert new tag data
          ...(eventData.tags || []).map(tag =>
            env.DB.prepare(`
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
        console.error('Error in updateEvent:', error);
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
            error: 'Event not found'
          }, { status: 404 });
        }
  
        // Delete associated media files
        if (event.video_id) {
          await deleteCloudflareVideo(event.video_id, env.CLOUDFLARE_ACCOUNT_ID, env.CLOUDFLARE_API_TOKEN);
        }
        
        if (event.images && event.images.length > 0) {
          await Promise.all(
            event.images.map(img => 
              deleteCloudflareImage(img.image_id, env.CLOUDFLARE_ACCOUNT_ID, env.CLOUDFLARE_API_TOKEN)
            )
          );
        }
  
        // Delete database record (cascade delete will handle related tables)
        await env.DB.prepare('DELETE FROM events WHERE id = ?')
          .bind(event.id)
          .run();
  
        return Response.json({
          success: true,
          data: {}
        });
      } catch (error) {
        console.error('Error in deleteEvent:', error);
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
  
      const result = await db.prepare(query)
        .bind(eventId)
        .first();
  
      if (!result) return null;
  
      return {
        ...result,
        images: JSON.parse(result.images),
        tags: JSON.parse(result.tags),
        links: JSON.parse(result.links)
      };
    }
  }
  
  export default new EventController();