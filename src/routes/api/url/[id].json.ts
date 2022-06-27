import urlModel from '$lib/db/shorturl';
import type { RequestHandler, RequestEvent } from '@sveltejs/kit';

export const get:RequestHandler = async (event: RequestEvent) => {
  const id = event.params.id;
  const url = await urlModel.findOne({ path: id });
  if (!url) {
    return {
      status: 404,
      body: {
        message: 'URL not found',
      },
    };
  }
  return {
    status: 200,
    body: {
      message: "Redirecting to " + url.url,
      data: {
        url: url.url,
      }
    }
  };
}
