import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Unstable_Grid2 as Grid,
} from "@mui/material";
import Slider from "react-slick";
import Image from "next/image";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export const PostDetails = () => {
  const [values, setValues] = useState({
    id: "1omtaZQtQZmgja6d54rof8zbV2pA5",
    category: "general",
    title: "펭귄은 정말 날 수 없는걸까?",
    writer: "엄준식",
    view: 102,
    created_at: "2021-10-01 00:00:00",
    content: `검고 미끈한 광택이 도는 탓에 간혹 펭귄의 외피가 가죽이 드러난 모습이라고 생각하는 사람들도 있다. 사실 빽빽하게 들어찬 검은 깃털들이다. 보온을 위해 긴 깃털과 짧은 솜깃털이 이중으로 발달해있으며, 매일 펭귄이 깃털을 다듬으며 부리로 기름분비샘의 기름을 찍어 바르는 탓에 펭귄의 깃털들은 반지르르한 상태를 유지한다. 윤기를 보면 알 수 있듯 방수 기능도 엄청나다.

    지적설계의 반대 증거로 사용되기도 했다. 조류는 뼈 속이 비어 있는 경우가 많기 때문에 펭귄 역시 조류라 뼈가 비어 있을 것이라 생각됐다. 하지만 펭귄은 잠수해서 물고기를 잡는 동물이기 때문에, 뼈가 비어서 공기가 차 있으면 오히려 잠수하기 힘들어진다. 지적인 존재가 생물을 만들었다면 이런 멍청한 짓을 왜 했겠냐는 논리인데, 이는 사실과는 다른 것으로 밝혀졌다. 2012년 2월 27일에 방송된 KBS 과학카페에서 나온 자카스펭귄과 비둘기의 X선 촬영사진 비교 결과 속이 비어 있는 비둘기의 뼈와 달리 펭귄의 뼈는 속이 꽉 차 있었다.[6] 당연히 펭귄은 극지방의 환경에 매우 적합하게 진화한 동물이다. 사실 얘보다는 사랑니로 따지는게 더 효과적이다
    
    뒤뚱거리고 동료들과 같이 다녀서 그런지 겁쟁이에 느긋한 동물로 보이지만 의외로 경계심이 강하다.
    
    날개 형태와 신체 구조를 보면 감이 오겠지만, 펭귄은 전혀 날지 못한다. 종류에 따라 살짝씩 날 수 있는 닭과 달리 펭귄은 모든 종이 조금도 날 수 없는 신체구조다. 어떤 네티즌들이 아래 동영상을 가지고 "펭귄이 날아다닌다."고 주장하지만, 이건 어디까지나 영국의 BBC가 인터넷 VOD 서비스 개시를 기념해 만우절에 맞춰 내놓은 홍보영상일 뿐. 2010년에는 한국의 L통신사 계열의 합병기념 런칭 광고가 이 영상과 상당히 유사했다(정식 라이센스를 받았다고 한다). 이 동영상은 카사네 테토의 거짓의 가희 동영상의 초반부에 몇 초 정도 나온다. 애초에 합성티 팍팍난다 웅장한 브금과 감탄하는 나레이션의 목소리가 어우러져 쓸데없이 감동적이다.
    
    출처 - 나무위키
    `,
    media: {
      img: [
        "https://plohub-bucket.s3.ap-northeast-2.amazonaws.com/f8b53b11-efd9-461f-963f-6e29e0e3a302_image_0_17b2ad589801389ce.png",
        "https://plohub-bucket.s3.ap-northeast-2.amazonaws.com/ce7f04e6-d93c-4441-a719-15fc9dd7d4b2_image_0_%E1%84%92%E1%85%A9%E1%84%88%E1%85%A1%E1%86%BC%E1%84%86%E1%85%A2%E1%86%AB.jpeg",
      ],
      video: [
        "https://plohub-bucket.s3.ap-northeast-2.amazonaws.com/file_example_MP4_480_1_5MG.mp4",
        "https://plohub-bucket.s3.ap-northeast-2.amazonaws.com/793688941acc296eae536eb5d1332f94.mp4",
      ],
    },
  });

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <Card sx={{ p: 3 }}>
      <CardHeader title="Detail" />
      <CardContent sx={{ pt: 0 }}>
        <Box sx={{ m: -1.5 }}>
          <Grid container spacing={3}>
            <Grid xs={12} md={6}>
              <TextField
                fullWidth
                label="ID"
                name="id"
                value={values.id}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid xs={12} md={6}>
              <TextField
                fullWidth
                label="Category"
                name="category"
                value={values.category}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid xs={12} md={6}>
              <TextField
                fullWidth
                label="Title"
                name="title"
                value={values.title}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid xs={12} md={6}>
              <TextField
                fullWidth
                label="Writer"
                name="writer"
                value={values.writer}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid xs={12} md={6}>
              <TextField
                fullWidth
                label="View"
                name="view"
                value={values.view}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            {values.event_id && (
              <Grid xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Event ID"
                  name="event_id"
                  value={event_id}
                  InputProps={{
                    readOnly: true,
                  }}
                ></TextField>
              </Grid>
            )}
            <Grid xs={12} md={6}>
              <TextField
                fullWidth
                label="Created At"
                name="created_at"
                value={values.created_at}
                InputProps={{
                  readOnly: true,
                }}
              ></TextField>
            </Grid>
            <Grid xs={12} md={12}>
              <TextField
                fullWidth
                multiline
                label="Content"
                name="content"
                value={values.content}
                InputProps={{
                  readOnly: true,
                }}
              ></TextField>
            </Grid>
            {values.media && (
              <Grid
                sx={{
                  justifyContent: "center",
                  alignItems: "center",
                  display: "flex",
                }}
              >
                <Grid xs={12} sm={12} md={6} spacing={3}>
                  <Slider {...settings}>
                    {[
                      ...values.media.img?.map((item) => ({ src: item, type: "image" })),
                      ...values.media.video?.map((item) => ({ src: item, type: "video" })),
                    ].map((item, index) => {
                      if (item.type === "image") {
                        return (
                          <Image
                            key={index}
                            src={item.src}
                            height={320}
                            width={320}
                            alt={`image${index}`}
                          />
                        );
                      }

                      if (item.type === "video") {
                        return (
                          <video key={index} height={320} controls>
                            <source src={item.src} />
                          </video>
                        );
                      }

                      return;
                    })}
                  </Slider>
                </Grid>
              </Grid>
            )}
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};
