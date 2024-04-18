import { CorsOptions } from "cors";

const corsConfig : CorsOptions = {
  origin: (origin, callback) => {
    const whitelist = [process.env.FRONTEND_URL]

    if (whitelist.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Cors Error'), false)
    }
  }
}

export default corsConfig