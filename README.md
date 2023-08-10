![header](https://capsule-render.vercel.app/api?type=Waving&color=0:C6FCA6,100:56D80C&height=220&section=header&text=Clean%20Mile&fontSize=80&fontColor=FFFFFF&fontAlignY=38)

환경 보호 행사에 대한 정보를 한 곳에 모아서 접근성과 사용자 편의성을 증진시키고, 행사에 참여하는 사용자들에게 인증 배지(NFT)를 발급하여 활발한 참여를 유도하는 것을 목표로 하는 환경 캠페인 플랫폼입니다.

이 프로젝트는 환경 보호에 관심이 있는 사람들 간의 상호작용을 촉진하고, 참여자들이 자발적으로 참여하도록 유도하여 도시 미관 훼손, 배수 시설 훼손, 생물 다양성 훼손, 대기 오염, 자원 고갈 등의 환경 문제를 해결하고 개선하는 데 기여하고자 하는 아이디어에서 시작하였습니다.

<br/>

## 🌱 프로젝트 목표 🌱

- ### 환경 보호 행사 정보 제공
  다양한 환경 보호 행사들에 대한 정보를 한 곳에 모아서 사용자들이 쉽게 접근할 수 있도록 합니다.
- ### 인증 배지(NFT) 발급 및 행사참여 점수에 따른 DNFT 업그레이드
  행사에 참여하는 사용자들에게 특별한 인증 배지(NFT)를 발급하여 참여를 유도하고, 그에 따른 점수를 합산하여 DNFT를 업그레이드하여 활발한 참여를 장려합니다.
- ### 커뮤니티 기능
  사용자들 간의 소통과 상호작용을 촉진하는 커뮤니티 기능을 제공하여 환경 보호에 대한 관심을 더욱 높이고 지속적인 참여를 유도합니다.

<br/>

## 🌍 프로젝트 주요 기능

- 플로깅, 비치 코밍 등의 환경 보호 행사에 관심이 있는 사용자들을 위한 커뮤니티 구축
- 회원가입 시 기본적으로 DNFT (ERC-721) 지급하여 활동 상태에 따라 업그레이드 제공
- 행사에 참여 후 QR 인증을 통한 참여 인증
- 사용자들이 환경 보호 행사에 참여할 때마다 행사 참여 기록을 블록체인에 저장하고, 참여자들에게 NFT (ERC-1155) 형태의 인증 배지 발급
- 관리자 페이지에서 커뮤니티 사용자, 게시글 관리

<br/>

## 🌐 서비스 아키텍처

<br/>

## 🚀 프로젝트 실행 방법

### 0. 필수 설치

- [Node.js v16.14.0](https://nodejs.org/ko/)
- [NPM v9.6.4](https://www.npmjs.com/)
- [Docker](https://www.docker.com/) (선택사항)

### 1. 프로젝트 클론

```bash
$ git clone https://github.com/codestates-beb/beb-09-clean-mile.git
```
### 2. 컨트랙트 배포

- 컨트랙트 배포를 위해 Alchemy API Key와 Private Key가 필요합니다.

```bash
$ cd contract && npm install
$ npx hardhat run scripts/deploy.js --network mumbai
```

### 3. 서버 실행

- `server/src/config/config.json` 파일을 생성합니다.

```bash
$ cd server && npm install
$ npm run dev
```

- 또는 docker-compose를 이용하여 실행할 수 있습니다.

```bash
$ docker compose up -d server
```

### 4. 사용자 & 관리자 클라이언트 실행

- `client/.env` 파일을 생성합니다.
- `admin/.env` 파일을 생성합니다.

```bash
$ cd client && npm install
$ npm run dev
```

```bash
$ cd admin && npm install
$ npm run dev
```

>> docker-compose.yml 파일에 client, admin 서비스가 추가되어 있지만, 빌드를 테스트하기 위한 용도로만 사용하였습니다.

<br/>

## 👨‍💻 팀원

| <img src="https://avatars.githubusercontent.com/u/61569834?v=4" width="150" height="150"/> | <img src="https://img.koreapas.com/i/1bbfb22/resize" width="150" height="150"/> | <img src="https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcTNvMh7Hea9AZjrCAGa2k8RfkZdcqPbU9OC2MFOqlSf6ABXFkPU" width="150" height="150"/> | <img src="https://avatars.githubusercontent.com/u/126757767?v=4" width="150" height="150"/> |
| ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| [piatoss3612](https://github.com/piatoss3612)                                              | [KimSeoYeon23](https://github.com/KimSeoYeon23)                                 | [dlwltn98](https://github.com/dlwltn98)                                                                                                        | [dokpark21](https://github.com/dokpark21)                                                   |
| 이효확(팀장)                                                                               | 김서연                                                                          | 이지수                                                                                                                                         | 박상현                                                                                      |
| 총괄                                                                                       | 프론트엔드                                                                      | 백엔드                                                                                                                                         | 컨트랙트                                                                                    |

<br/>

## 🔧 Stack

- ### Front-end

    <img src="https://img.shields.io/badge/typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=black"> 
    <img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black"> 
    <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=React&logoColor=black"> 
    <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=Next.js&logoColor=white"> 
    <img src="https://img.shields.io/badge/next_translate-000000?style=for-the-badge&logoColor=white">
    <img src="https://img.shields.io/badge/redux-764ABC?style=for-the-badge&logo=redux&logoColor=white"> 
    <img src="https://img.shields.io/badge/reduxsaga-999999?style=for-the-badge&logo=reduxsaga&logoColor=white"> 
    <img src="https://img.shields.io/badge/tailwindcss-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white"> 
    <img src="https://img.shields.io/badge/axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white"> 
    <img src="https://img.shields.io/badge/reactquery-FF4154?style=for-the-badge&logo=reactquery&logoColor=white"> 
    <img src="https://img.shields.io/badge/web3.js-F16822?style=for-the-badge&logo=web3dotjs&logoColor=white"> 
    <img src="https://img.shields.io/badge/three.js-000000?style=for-the-badge&logo=threedotjs&logoColor=white">
    <img src="https://img.shields.io/badge/mui-007FFF?style=for-the-badge&logo=mui&logoColor=white">
    <img src="https://img.shields.io/badge/eslint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white">

- ### Back-End

    <img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black"> 
    <img src="https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white"> 
    <img src="https://img.shields.io/badge/express-000000?style=for-the-badge&logo=express&logoColor=white"> 
    <img src="https://img.shields.io/badge/jsonwebtokens-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white"> 
    <img src="https://img.shields.io/badge/mongodb-47A248?style=for-the-badge&logo=mongodb&logoColor=white"> 
    <img src="https://img.shields.io/badge/mocha-8D6748?style=for-the-badge&logo=mocha&logoColor=white">
    <img src="https://img.shields.io/badge/chai-A30701?style=for-the-badge&logo=chai&logoColor=white">
    <img src="https://img.shields.io/badge/jest-C21325?style=for-the-badge&logo=jest&logoColor=white">
    <img src="https://img.shields.io/badge/postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white">
    <img src="https://img.shields.io/badge/ethers.js-3C3C3D?style=for-the-badge&logoColor=white">
    <img src="https://img.shields.io/badge/aws_sdk-232F3E?style=for-the-badge&logo=amazonaws&logoColor=white">
    <img src="https://img.shields.io/badge/amazons3-569A31?style=for-the-badge&logo=amazons3&logoColor=white">

- ### Blockchain

    <img src="https://img.shields.io/badge/solidity-363636?style=for-the-badge&logo=solidity&logoColor=white">
    <img src="https://img.shields.io/badge/openzeppelin-4E5EE4?style=for-the-badge&logo=openzeppelin&logoColor=white">
    <img src="https://img.shields.io/badge/mocha-8D6748?style=for-the-badge&logo=mocha&logoColor=white">
    <img src="https://img.shields.io/badge/chai-A30701?style=for-the-badge&logo=chai&logoColor=white">
    <img src="https://img.shields.io/badge/hardhat-000000?style=for-the-badge&logo=hardhat&logoColor=white">

- ### Daemon

    <img src="https://img.shields.io/badge/pm2-2B037A?style=for-the-badge&logo=pm2&logoColor=white">

- ### Infra
    <img src="https://img.shields.io/badge/githubactions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white">
    <img src="https://img.shields.io/badge/docker-2496ED?style=for-the-badge&logo=docker&logoColor=white">
    <img src="https://img.shields.io/badge/terraform-7B42BC?style=for-the-badge&logo=terraform&logoColor=white">
    <img src="https://img.shields.io/badge/amazon_aws-232F3E?style=for-the-badge&logo=amazonaws&logoColor=white">
    <img src="https://img.shields.io/badge/amazonec2-FF9900?style=for-the-badge&logo=amazonec2&logoColor=white">

<br/>

## 🗂️ Documents

- #### [프로젝트 소개](https://github.com/codestates-beb/beb-09-clean-mile/wiki)
- #### [아이디어 노트](https://github.com/codestates-beb/beb-09-clean-mile/wiki/Idea)
- #### [Flow chart](https://github.com/codestates-beb/beb-09-clean-mile/wiki/Flow-chart)
- #### [Wire Frame(client)](https://github.com/codestates-beb/beb-09-clean-mile/wiki/Wire-Frame-%E2%80%90-client)
- #### [Wire Frame(admin)](https://github.com/codestates-beb/beb-09-clean-mile/wiki/Wire-Frame-%E2%80%90-admin)
- #### [API 문서](https://documenter.getpostman.com/view/26736336/2s946o5pn6#7cce518f-94ac-4962-b5ce-bf200a001639)
- #### [DB Schema](https://github.com/codestates-beb/beb-09-clean-mile/wiki/DB-Schema)
- #### [발표자료](https://docs.google.com/presentation/d/12tAatS807ki-KKteL0nSU3NdAu2GexhEGhL3wRWXNLM/edit#slide=id.g239e59f90a6_0_3)

![Footer](https://capsule-render.vercel.app/api?type=waving&color=0:C6FCA6,100:56D80C&height=100&section=footer)
