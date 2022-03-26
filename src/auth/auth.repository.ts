import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class AuthRepository {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async saveToken(uuid: string, token: string, ttl: number): Promise<void> {
    await this.cacheManager.set(uuid, token, { ttl });
  }

  async findToken(uuid: string): Promise<string | null> {
    return this.cacheManager.get(uuid);
  }

  async deleteToken(uuid: string): Promise<void> {
    await this.cacheManager.del(uuid);
  }

  async resetTokens(): Promise<void> {
    await this.cacheManager.reset();
  }
}
