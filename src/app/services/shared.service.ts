import { Injectable, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
    private toastr = inject(ToastrService)
  
  loggerSuccess(msg: string, timeOut = 2500) {
    this.toastr.success(msg, 'Success', {
      timeOut: timeOut,
      progressBar: true,
    });
  }

  loggerInfo(msg: string, timeOut = 3500) {
    this.toastr.info(msg, 'Info', { timeOut: timeOut, progressBar: true });
  }

  loggerError(msg: string, timeOut = 3500) {
    
        this.toastr.error(msg, 'Error', {
          timeOut: timeOut,
          progressBar: true,
        });
  }

  loggerWarning(msg: string, timeOut = 3500) {
    this.toastr.warning(msg, 'Warning', {
      timeOut: timeOut,
      progressBar: true,
    });
  }
}
