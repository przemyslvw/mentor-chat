import { HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { LoadingService } from '../../services/loading.service';

let totalRequests = 0;

export function loadingInterceptor(request: HttpRequest<unknown>, next: HttpHandlerFn) {
  const loadingService = inject(LoadingService);
  
  // Skip loading for specific requests if needed
  if (request.url.includes('some-specific-endpoint')) {
    return next(request);
  }

  totalRequests++;
  loadingService.setLoading(true);

  return next(request).pipe(
    finalize(() => {
      totalRequests--;
      if (totalRequests === 0) {
        loadingService.setLoading(false);
      }
    })
  );
}
