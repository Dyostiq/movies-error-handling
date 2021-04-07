import { CreateMoviePolicy } from './create-movie.policy';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PremiumUserPolicy extends CreateMoviePolicy {
  canCreate(): true {
    return true;
  }
}
