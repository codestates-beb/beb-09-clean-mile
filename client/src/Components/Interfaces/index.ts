interface Post {
  id: number;
  image: string | StaticImageData; // <- change here
  insta_id: string;
  insta_content: string;
  date: string;
}


export { Post }