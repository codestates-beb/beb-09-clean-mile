import Slider from "react-slick";
import Image from "next/image";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ArrowLeftIcon from "@heroicons/react/24/solid/ArrowLeftIcon";
import ArrowRightIcon from "@heroicons/react/24/solid/ArrowRightIcon";

const PrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div className={className} style={{ ...style, display: "block" }} onClick={onClick}>
      <ArrowLeftIcon style={{ color: "black" }} />
    </div>
  );
};

const NextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div className={className} style={{ ...style, display: "block" }} onClick={onClick}>
      <ArrowRightIcon style={{ color: "black" }} />
    </div>
  );
};

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  prevArrow: <PrevArrow />,
  nextArrow: <NextArrow />,
};

export const MediaSlider = ({ media = [] }) => (
  <Slider {...settings}>
    {media.map((item, index) => {
      if (item.type && item.type === "image") {
        return <Image key={index} src={item.src} height={320} width={320} alt={`image${index}`} />;
      }

      if (item.type && item.type === "video") {
        return (
          <video key={index} height={320} controls>
            <source src={item.src} />
          </video>
        );
      }

      return;
    })}
  </Slider>
);
