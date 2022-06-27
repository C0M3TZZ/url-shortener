import urlModel from '$lib/db/shorturl';
import type { RequestHandler, RequestEvent } from '@sveltejs/kit';
import { customAlphabet } from 'nanoid';const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const nanoid = customAlphabet(alphabet, 8);
export const post:RequestHandler = async (event: RequestEvent) => {
  const bodyReq = await event.request.json();
  if (bodyReq.path === undefined || bodyReq.path.length === 0) {
    let newUrl:string = nanoid();
    while (await urlModel.findOne({ path: newUrl })) {
      newUrl = nanoid();
    }
    bodyReq.path = newUrl;
  };
  const isAlreayExists = await urlModel.findOne({ path: bodyReq.path });
  if (isAlreayExists) {
    return {
      status: 400,
      body: {
        message: 'path already exists',
      },
    };
  };
  const url = await urlModel.create(bodyReq);
  return {
    status: 200,
    body: {
      data: {
        url: url.url,
        path: url.path,
      },
    },
  };
};

