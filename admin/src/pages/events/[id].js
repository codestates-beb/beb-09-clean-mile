import Head from "next/head";
import { Box, Container, Stack, Typography, Button, Tab } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import { EventDetails } from "src/components/events/event-details";
import { EventBadge } from "src/components/events/event-badge";
import { EventHost } from "src/components/events/event-host";
import { EventBadgeMintForm } from "src/components/events/event-badge-mint-form";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { EventEntryTable } from "src/components/events/event-entry-table";
import { EventQRCodeLoader } from "src/components/events/event-qr-code-loader";

const dummy = {
  host: {
    id: "3Rxv4WLTT5EqiBiVozgy4LZLW6ELRVM8",
    name: "초전도체",
    email: "Presley89@hotmail.com",
    phone_number: "010-1234-5678",
    wallet_address: "0xdefe6c0baf788845b9a59f42fdc1ccc85f3cf2cd",
    organization: "퀀텀에너지 연구소",
    created_at: "2021-10-01T00:00:00.000000Z",
  },
  event: {
    id: "3Rxv4WLTT5EqiBiVozgy4LZLW6ELRVM8",
    title: "플로깅 그랜드마스터 선발전",
    content: `초전도라는 말 뜻대로 직류 전류저항 0 Ω0Ω이 가장 큰 특성을 가리킨다. 단, 교류전류는 손실이 발생한다.

    초전도 돔은 초전도 현상이 생기기 위한 조건을 설명한다.
    
        온도가 임계 온도(TcTc​, critical temperature)보다 낮아야 한다.
        자기장이 임계 자기장(HcHc​)보다 낮아야 한다.
        전류 밀도가 임계 전류 밀도(JcJc​)보다 낮아야 한다.
    
    
    물론 여기에 도핑레벨이나 압력 등 양자 페이즈 변이에 해당하는 파라미터들도 있다. 그리고 각각의 임계 성질들의 크기는 초전도체의 성분에 따라 달라진다. 초전도 돔의 크기가 클수록 좋은 초전도체다. 연세대 초전도연구실 출처
    
    임계온도 바로 밑에서는 조금의 자기장이나 전류로도 쉽게 초전도 현상이 사라진다. 반대로 0 K0K에 가까이 갈수록 비교적 강한 자기장이나 강한 전류에도 잘 버틴다.[33] 따라서 고온초전도체는 고온에서 초전도 현상이 나타난다는 의미도 있지만 단순히 바라봤을 때 낮은 온도에서 더 많은 전류를 흘려 보낼 수 있다는 의미도 된다.
    
    하지만 교류에선 손실이 발생한다. 우리가 사용하는 보통의 전력 기기는 교류 상태에서 작동하며, 초전도 선재에는 수송전류에 의한 자기자계의 시간적인 변화로 핀중심이 이동하고, 마찰저항으로 열손실인 전력손실이 발생하는 것.
    
    이와 같은 교류손실은 구리와 같은 상전도체의 경우에 비해 1/1000 정도로 작은 양이지만 초전도체는 극저온의 액체질소나 헬륨과 같은 냉매를 사용하기 때문에 작은 양의 손실이라 할지라도 경제성에 큰 영향을 미친다. 그 이유는 열 손실로 인해 기화된 냉매를 다시 냉각하여 액체로 만들기 위해서는 수십배의 에너지가 필요하기 때문이다
    
    또한 아무리 초전도체라고 해도 도선의 기생 인덕턴스와 도선과 대지 사이의 기생 커패시턴스[34]가 어디 가는 것이 아니므로 이로 인한 무효 전력 및 전력 손실이 발생할 수 있다.
    
    많은 고체이론 물리학자들이 열과 성을 다해 연구하고 있다. 흔히 이론물리학이라고 하면 입자물리학과 천체물리학 이론쪽 정도만 떠올리는 분들이 많지만, 고체 물리학도 엄연히 이론하시는 분들이 있다. 단지 앞의 두 가지에 비해서 상호작용이 너무 많기 때문에[35] 쉬운 접근이 힘들어서 여러가지 근사법들을 가지고 이론을 펼쳐간다. 핵 물리만 해도 수 개~ 수 백개에 대해 다루기 때문에 근사법으로 다루는데 아보가드로 숫자에 해당하는 입자들의 집합인 고체는 근사가 아니면 다루는것이 불가능하다. 앞에서 언급한 오너스의 첫 발견 이후 많은 물리학자의 노고 끝에, 1950년도에 초전도체에 관한 기본 이론이 일단은 확립됐다. 이게 "일단은"인 이유는, 후에 비금속성 초전도체의 발견으로 이론의 수정이 불가피해졌기 때문. 발견에 비해 이론이 이렇게 늦어진 이유는, 위에서 언급한 세 번째 현상 때문에 양자역학의 개념이 도입되기 이전엔 설명조차 불가능했기 때문이다.[36] 구 소련에서 1950년에 비타니 레자라비치 긴즈버그와 레프 란다우가 초전도현상을 일으키는 물질의 현상학적 모델을 제시했으며(긴즈버그-란다우 이론), 이와는 별개로 서방에서 1957년에 존 바딘[37], 레온 N. 쿠퍼, 존 R. 쉬리퍼가 BCS 이론을 창립, 위의 세 가지 현상을 전부 설명하게 된다. 그리고 이 후에 Lev. P. Gorkov가 BCS이론에서 약간의 조건을 도입하여 긴즈버그-란다우 이론을 유도하면서 두 이론이 동일한 현상에 대한 다른 설명인 것이 증명됐다.
    
    초전도체에 관한 현재 유력한 설명은 BCS이론의 전자 커플링설. 이것이 메이저한 이유는 초전도체를 이동하는 양자의 전하를 qq라고 했을 때, 실험을 통해 q=2eq=2e로 밝혀졌기 때문이다. 이를 "쿠퍼 쌍(Cooper pair)"이라고 부르며, 이 쌍은 같은 스핀의 전자 2개가 같이 이동하며 하나처럼 행동하는 12+12=121​+21​=1인 보존으로 행동해버린다. 때문에 한 상태에 여러개가 저항없이 존재하기에 저항이 0 Ω0Ω이라는 설명. 쿠퍼는 두 전자 사이에 포논에 의한 인력이 있다면 이 인력이 아무리 약하더라도[38] 두 전자가 하나의 입자처럼 '묶여서' 행동한다고 이론적으로 증명했다. 이것이 바로 쿠퍼 불안정성(cooper instability). 하지만 전자가 커플링이 일어나는 방법에 대해 이론상으론 특정 상황을 만족하면 전자간 전기력이 인력일 수도 있긴 하지만 완전히 정설은 없다. 대표적으로 자기양자를 이론적으로 설명하는 부분이 오류라는 증명이 존재한다. 전자커플링 때문에 자기양자가 h2e2eh​가 아니라는 것이다.
    
    BCS이론은 type 1 초전도체를 기반으로 만들어졌고 제1초전도체의 현상을 완전히 설명한다. 하지만 type 2에는 맞아들어가지 않는다. 쿠퍼쌍(cooper pair)의 생성은 두 전자가 포논에 의해 묶여 있다고 이야기 하고있다. 이것이 BCS이론의 한 축인데 고온초전도체의 경우 이 쿠퍼쌍을 묶는 것이 포논이 아니라 다른 메커니즘(Spin Density Wave, Charge Density Wave, Orbital Ordering 등)에 의한 것이라 생각하고 연구중이다. 고온초전도체에서도 쿠퍼쌍은 존재하므로 어떤 메커니즘에 의해 두 전자가 묶여있다는 것이고 포논이 아닌 그 무언가를 찾고 있다.
    
    출처 - 나무위키`,
    poster_url: [
      "https://plohub-bucket.s3.ap-northeast-2.amazonaws.com/f8b53b11-efd9-461f-963f-6e29e0e3a302_image_0_17b2ad589801389ce.png",
      "https://plohub-bucket.s3.ap-northeast-2.amazonaws.com/f8b53b11-efd9-461f-963f-6e29e0e3a302_image_0_17b2ad589801389ce.png",
    ],
    location: "서울시",
    capacity: 10,
    remaining: 10,
    status: "progressing",
    event_type: "fcfs",
    recruitment_start_at: "2021-10-01T00:00:00.000000Z",
    recruitment_end_at: "2021-10-02T00:00:00.000000Z",
    event_start_at: "2021-10-03T00:00:00.000000Z",
    event_end_at: "2021-10-04T00:00:00.000000Z",
    view: {
      count: 1234,
    },
    created_at: "2021-10-01T00:00:00.000000Z",
  },
  // badge: {
  //   id: "3Rxv4WLTT5EqiBiVozgy4LZLW6ELRVM8",
  //   image_url: "/assets/avatars/avatar-anika-visser.png",
  //   badge_id: 1,
  //   name: "플로깅 그랜드마스터",
  //   description: "플로깅 100회 이상 달성",
  //   type: 2,
  //   token_uri: "https://badge.world/api/v1/badges/1",
  //   initial_quantity: 10,
  //   remaining_quantity: 10,
  //   created_at: "2021-10-01T00:00:00.000000Z",
  // },
};

const Page = () => {
  const [data, setData] = useState(dummy);
  const [tabNum, setTabNum] = useState("1");
  const [entryPage, setEntryPage] = useState(1);
  const [entryPageCount, setEntryPageCount] = useState(5);
  const router = useRouter();

  const { id } = router.query;

  const handleEntryPageChange = useCallback((event, value) => {
    setEntryPage(value);
  }, []);

  const handleEntryExport = useCallback(() => {
    console.log("handleEntryExport");
  }, []);

  const handleMintBadge = useCallback((values) => {
    setData((prev) => ({
      ...prev,
      badge: {
        id: "3Rxv4WLTT5EqiBiVozgy4LZLW6ELRVM8",
        image_url: "/assets/avatars/avatar-anika-visser.png",
        badge_id: 1,
        name: values.name,
        description: values.description,
        type: values.type,
        token_uri: "https://badge.world/api/v1/badges/1",
        initial_quantity: 10,
        remaining_quantity: 10,
        created_at: "2021-10-01T00:00:00.000000Z",
        preview: values.preview,
      },
    }));
    setTabNum("3");
  }, []);

  const handleTabChange = (event, value) => {
    setTabNum(value);
  };

  return (
    <>
      <Head>
        <title>Event</title>
      </Head>
      <Box
        sx={{
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={3}>
            <Stack direction={"row"} justifyContent="space-between" spacing={3}>
              <Typography variant="h4">Event</Typography>
              <Stack direction={"row"} spacing={1}>
                <Button variant="contained" color="warning">
                  Delete
                </Button>
                <Button variant="contained" onClick={() => router.back()}>
                  Back
                </Button>
              </Stack>
            </Stack>
            <TabContext value={tabNum}>
              <TabList onChange={handleTabChange}>
                <Tab label="Host" value="1" />
                <Tab label="Detail" value="2" />
                {data.badge ? <Tab label="Badge" value="3" /> : <Tab label="Mint" value="4" />}

                <Tab label="Entry" value="5" />
                <Tab label="QR Code" value="6" />
              </TabList>
              <TabPanel value={"1"}>
                <EventHost host={data.host} />
              </TabPanel>
              <TabPanel value={"2"}>
                <EventDetails event={data.event} />
              </TabPanel>
              {data.badge ? (
                <TabPanel value={"3"}>
                  <EventBadge badge={data.badge} />
                </TabPanel>
              ) : (
                <TabPanel value={"4"}>
                  <EventBadgeMintForm handleMintBadge={handleMintBadge} />
                </TabPanel>
              )}
              <TabPanel value={"5"}>
                <EventEntryTable
                  page={entryPage}
                  pageCount={entryPageCount}
                  handlePageChange={handleEntryPageChange}
                  handleEntryExport={handleEntryExport}
                  items={[
                    {
                      _id: "3Rxv4WLTT5EqiBiVozgy4LZLW6ELRVM8",
                      user_id: {
                        name: "초전도체",
                        email: "chogeondochi@hotmail.com",
                        wallet: {
                          address: "0xdefe6c0baf788845b9a59f42fdc1ccc85f3cf2cd",
                        },
                      },
                      is_confirmed: true,
                      is_nft_issued: true,
                      is_token_rewarded: false,
                      created_at: "2021-10-01T00:00:00.000000Z",
                    },
                  ]}
                />
              </TabPanel>
              <TabPanel value={"6"}>
                <EventQRCodeLoader eventId={id} />
              </TabPanel>
            </TabContext>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
