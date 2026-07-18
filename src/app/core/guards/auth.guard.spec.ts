import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { authGuard } from './auth.guard';
import { Auth } from '../services/auth';

describe('authGuard', () => {
  let auth: { isAuthenticated: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    auth = { isAuthenticated: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: Auth, useValue: auth },
      ],
    });
  });

  it('should allow activation when authenticated', () => {
    auth.isAuthenticated.mockReturnValue(true);

    const result = TestBed.runInInjectionContext(() => authGuard({} as never, {} as never));

    expect(result).toBe(true);
  });

  it('should redirect to login when not authenticated', () => {
    auth.isAuthenticated.mockReturnValue(false);
    const router = TestBed.inject(Router);

    const result = TestBed.runInInjectionContext(() => authGuard({} as never, {} as never));

    expect(result).toEqual(router.createUrlTree(['/login']));
  });
});
