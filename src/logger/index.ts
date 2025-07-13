import pino from 'pino'

const devOpts = {
  level: 'debug',
  timestamp: pino.stdTimeFunctions.isoTime,
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname',
      singleLine: false,
    },
  },
}

const prodOpts = {
  level: 'info',
  timestamp: pino.stdTimeFunctions.isoTime,
}

export default pino(process.env.NODE_ENV === 'production' ? prodOpts : devOpts)

