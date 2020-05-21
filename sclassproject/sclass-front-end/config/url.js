import env from './env'

const DEV_URL = 'http://127.0.0.1:8081/apis'
const PRO_URL = 'http://127.0.0.1:8081/apis'

export default env === 'development' ? DEV_URL : PRO_URL
