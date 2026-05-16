import { loginSchema, registerSchema } from '../auth.schemas';

describe('auth.schemas', () => {
  it('login accepts valid payloads', () => {
    expect(() =>
      loginSchema.parse({ email: 'ada@example.com', password: 'hunter123' }),
    ).not.toThrow();
  });

  it('login rejects invalid email', () => {
    const r = loginSchema.safeParse({ email: 'nope', password: 'hunter123' });
    expect(r.success).toBe(false);
  });

  it('login rejects short password', () => {
    const r = loginSchema.safeParse({ email: 'ada@example.com', password: 'short' });
    expect(r.success).toBe(false);
  });

  it('register requires name', () => {
    const r = registerSchema.safeParse({
      name: '',
      email: 'ada@example.com',
      password: 'hunter123',
    });
    expect(r.success).toBe(false);
  });

  it('register accepts valid payloads', () => {
    expect(() =>
      registerSchema.parse({
        name: 'Ada',
        email: 'ada@example.com',
        password: 'hunter123',
      }),
    ).not.toThrow();
  });
});
