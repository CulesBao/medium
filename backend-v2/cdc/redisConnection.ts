import { createClient } from "redis";

const client = createClient({
    url: 'redis://localhost:6488'
})

client.on('connect', async() => {
    console.log('Redis client connected');
});

client.connect().catch((error: any) => {
    console.log(error);
});
export default client