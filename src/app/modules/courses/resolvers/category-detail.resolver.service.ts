import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { CoursesService } from '../services/courses.service';
import { map } from 'rxjs/operators';
import { Category } from '../../../shared/models/category.model';
import * as faker from 'faker';

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
        console.log('%c Resolving value ', 'background: #222; color: red');
        const categoryDetailInfo = {
          category
        };
        console.log(categoryDetailInfo);
        return categoryDetailInfo;
      })
    );
  }
}
