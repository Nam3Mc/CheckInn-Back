import { SensitiveInfoInterceptor } from './sensitive-info.interceptor';

describe('SensitiveInfoInterceptor', () => {
  it('should be defined', () => {
    expect(new SensitiveInfoInterceptor()).toBeDefined();
  });
});
