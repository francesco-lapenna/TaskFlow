import { get, ResponseObject } from '@loopback/rest';

const PING_RESPONSE: ResponseObject = {
  description: 'Health response',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          status: { type: 'string' },
          uptime: { type: 'number' },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    },
  },
};

export class PingController {
  @get('/ping', { responses: { '200': PING_RESPONSE } })
  ping() {
    return {
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    };
  }
}
