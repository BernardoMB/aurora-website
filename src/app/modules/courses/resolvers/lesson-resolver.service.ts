import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { LessonsService } from '../services/lessons.service';

// TODO: Implement lesson type.
@Injectable()
export class LessonResolver implements Resolve<any> {
  constructor(private lessonsService: LessonsService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return this.lessonsService.getLesson(route.params.id);
  }
}
