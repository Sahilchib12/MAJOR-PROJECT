# app/utils/redis_cache.py
import redis

class RedisClient:
    def __init__(self):
        self.conn = None

    def initialize(self):
        self.conn = redis.Redis(host='localhost', port=6379)
    
    def cache_embedding(self, job_id: str, embedding: list):
        self.conn.set(f"embedding:{job_id}", str(embedding))
    
    def get_embedding(self, job_id: str):
        return eval(self.conn.get(f"embedding:{job_id}"))  # Caution: Use proper serialization
    
    async def close(self):
        self.conn.close()