import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { guestGuard } from './guest.guard';
import { AuthService } from '../services/auth.service';

describe('guestGuard', () => {
  let auth: { isAuthenticated: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    auth = { isAuthenticated: vi.fn() };

    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: AuthService, useValue: auth }],
    });
  });

  it('should allow activation when not authenticated', () => {
    auth.isAuthenticated.mockReturnValue(false);

    const result = TestBed.runInInjectionContext(() => guestGuard({} as never, {} as never));

    expect(result).toBe(true);
  });

  it('should redirect to projetos when authenticated', () => {
    auth.isAuthenticated.mockReturnValue(true);
    const router = TestBed.inject(Router);

    const result = TestBed.runInInjectionContext(() => guestGuard({} as never, {} as never));

    expect(result).toEqual(router.createUrlTree(['/projetos']));
  });
});
