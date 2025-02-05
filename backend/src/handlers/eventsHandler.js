// src/handlers/eventsHandler.js
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, QueryCommand, GetCommand, PutCommand, ScanCommand } = require('@aws-sdk/lib-dynamodb');
const { v4: uuidv4 } = require('uuid');

const ddbClient = new DynamoDBClient();
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

// Get events with optional tag filter
exports.getEvents = async (event) => {
  try {
    const queryParams = event.queryStringParameters || {};
    const tag = queryParams.tag;
    const now = new Date().toISOString();

    let allEvents;
    if (tag) {
      // If tag is provided, use tag index
      const response = await ddbDocClient.send(new QueryCommand({
        TableName: process.env.EVENTS_TABLE,
        IndexName: 'tagIndex',
        KeyConditionExpression: 'tag = :tag',
        ExpressionAttributeValues: {
          ':tag': tag
        }
      }));
      allEvents = response.Items || [];
    } else {
      // If no tag, get all events
      const response = await ddbDocClient.send(new ScanCommand({
        TableName: process.env.EVENTS_TABLE
      }));
      allEvents = response.Items || [];
    }

    // Split events into upcoming and past
    const upcomingEvents = [];
    const pastEvents = [];

    allEvents.forEach(event => {
      if (event.startTime > now) {
        upcomingEvents.push(event);
      } else {
        pastEvents.push(event);
      }
    });

    // Sort events by start time
    upcomingEvents.sort((a, b) => a.startTime.localeCompare(b.startTime));
    pastEvents.sort((a, b) => b.startTime.localeCompare(a.startTime)); // Past events in reverse order

    // Process events to add duration and format times
    const processEvents = (events) => {
      return events.map(event => ({
        ...event,
        duration: calculateDuration(event.startTime, event.endTime),
        formattedStartTime: formatDateTime(event.startTime),
        formattedEndTime: formatDateTime(event.endTime)
      }));
    };

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        upcoming: processEvents(upcomingEvents),
        past: processEvents(pastEvents)
      })
    };
  } catch (error) {
    console.error('Error fetching events:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        message: 'Error fetching events',
        error: error.message
      })
    };
  }
};

// Get all available tags
exports.getTags = async () => {
  try {
    const response = await ddbDocClient.send(new ScanCommand({
      TableName: process.env.EVENTS_TABLE,
      ProjectionExpression: 'tags'
    }));

    // Collect unique tags
    const uniqueTags = new Set();
    response.Items.forEach(event => {
      if (event.tags && Array.isArray(event.tags)) {
        event.tags.forEach(tag => uniqueTags.add(tag));
      }
    });

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        tags: Array.from(uniqueTags)
      })
    };
  } catch (error) {
    console.error('Error fetching tags:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        message: 'Error fetching tags',
        error: error.message
      })
    };
  }
};

// Get single event details
exports.getEventDetails = async (event) => {
  try {
    const eventId = event.pathParameters.id;

    const { Item: eventDetails } = await ddbDocClient.send(new GetCommand({
      TableName: process.env.EVENTS_TABLE,
      Key: { id: eventId }
    }));

    if (!eventDetails) {
      return {
        statusCode: 404,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({
          message: 'Event not found'
        })
      };
    }

    // Format dates and calculate duration
    const formattedEvent = {
      ...eventDetails,
      duration: calculateDuration(eventDetails.startTime, eventDetails.endTime),
      formattedStartTime: formatDateTime(eventDetails.startTime),
      formattedEndTime: formatDateTime(eventDetails.endTime)
    };

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(formattedEvent)
    };
  } catch (error) {
    console.error('Error fetching event details:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        message: 'Error fetching event details',
        error: error.message
      })
    };
  }
};

// Create new event
exports.createEvent = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const {
      title,
      description,
      subtitle,
      mainPicture,
      pictures,
      startTime,
      endTime,
      location,
      tags,
      video,
      links
    } = body;

    // Validate required fields
    if (!title || !startTime || !endTime) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({
          message: 'Missing required fields',
          required: ['title', 'startTime', 'endTime']
        })
      };
    }

    const eventId = uuidv4();
    const timestamp = new Date().toISOString();

    const newEvent = {
      id: eventId,
      title,
      description,
      subtitle,
      mainPicture,
      pictures: pictures || [],
      startTime,
      endTime,
      location,
      tags: tags || [],
      video,
      links: links || {},
      createdAt: timestamp,
      updatedAt: timestamp
    };

    await ddbDocClient.send(new PutCommand({
      TableName: process.env.EVENTS_TABLE,
      Item: newEvent
    }));

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        message: 'Event created successfully',
        event: newEvent
      })
    };
  } catch (error) {
    console.error('Error creating event:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        message: 'Error creating event',
        error: error.message
      })
    };
  }
};

// Helper function to calculate duration
const calculateDuration = (startTime, endTime) => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const diffMs = end - start;
  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  return {
    hours: diffHrs,
    minutes: diffMins
  };
};

// Helper function to format date time
const formatDateTime = (dateTimeStr) => {
  const date = new Date(dateTimeStr);
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    hour: date.getHours(),
    minute: date.getMinutes()
  };
};