type SweetAlertIcon = undefined | "success" | "error" | "warning" | "info" | "question";

interface Post {
  id: number;
  image: string | StaticImageData; // <- change here
  review_writer: string;
  review_title: string;
  review_content: string;
  date: string;
}

interface Alert {
  title: string,
  text: string,
  icon: SweetAlertIcon,
  confirmButtonText: string
  confirmButtonColor: string,
}

interface AlertState {
  visible: boolean;
  alert: Alert;
}


export type { Post, Alert, AlertState }