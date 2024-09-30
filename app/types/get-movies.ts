export interface IGetTrendingMovies {
  page: number;
  results: IGetTrendingMoviesResults[];
  total_pages: number;
  total_results: number;
}

export interface IGetTrendingMoviesResults {
  backdrop_path: string;
  id: number;
  title: string;
  original_title: string;
  name: string;
  overview: string;
  poster_path: string;
  media_type: string;
  adult: boolean;
  original_language: string;
  genre_ids: Array<number>;
  popularity: number;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  origin_country: Array<string>;
}
