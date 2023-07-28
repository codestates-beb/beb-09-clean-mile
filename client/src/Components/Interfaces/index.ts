interface Post {
  id: number;
  image: string | StaticImageData; // <- change here
  review_writer: string;
  review_title: string;
  review_content: string;
  date: string;
}


export { Post }