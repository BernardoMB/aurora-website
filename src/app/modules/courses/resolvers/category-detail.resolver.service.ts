import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { CoursesService } from '../services/courses.service';
import { map } from 'rxjs/operators';
import { Category } from '../../../shared/models/category.model';

/**
 * This resolver resolves the category for the category detail view.
 *
 * @export
 */
@Injectable()
export class CategoryDetailResolver implements Resolve<any> {

  constructor(
    private coursesService: CoursesService
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return this.coursesService.getCategory(route.params.id).pipe(
      map((category: Category) => {
        const categoryDetailInfo = {
          category
        };
        return categoryDetailInfo;
      })
    );
  }
}
