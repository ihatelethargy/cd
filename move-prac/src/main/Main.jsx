import React, { useEffect, useState } from 'react';
import styled, { css, keyframes } from 'styled-components';

const Main = () => {
  //state정의
  const [buttonText, setButtonText] = useState('정답보기'); //클릭한 버튼명(버튼명으로 현재 상태비교)
  const [rotateSecond, setRotateSecond] = useState(0); //1초재생인지 3초재생인지 상태값(0일때는 애니메이션 없음)
  const [recordInside, isRecordInside] = useState(false); //레코드판을 넣는 애니메이션 트리거
  const [activeIndex, setActiveIndex] = useState(0); //현재 선택된 레코드판 index넘버
  const [answer, setAnswer] = useState(); //정답 text state

  //activeIndex를 주시하며 바뀔때마다 레코드판 넣는 애니메이션과 버튼명을 초기화해줌
  useEffect(() => {
    isRecordInside(false);
    setButtonText('정답보기');
    setAnswer(undefined);
  }, [activeIndex]);

  //다음문제 버튼 이벤트 정의
  const handleNextButton = () => {
    //버튼 텍스트가 '정답보기' 일때 버튼명을 '다음문제'로 변경 후 레코드 집어넣는 트리거를true로 바꿔줌
    if (buttonText === '정답보기') {
      isRecordInside(true);
      setButtonText('다음문제');
      setAnswer('Dumb Dumb');
    } else {
      //버튼 텍스트가 '다음문제'일때 선택된 레코드를 1증가하여 다음 레코드를 불러옴
      setActiveIndex(activeIndex + 1);
    }
  };

  //레코드판 돌아가는 애니메이션 핸들러
  const handleRotateAnimation = (second) => {
    //레코드판 재생시간이 0초일때만 에니메이션 실행을 하여 마구 연타하였을때 애니메이션 꼬이는것을 방지
    if (rotateSecond === 0) {
      setRotateSecond(second);

      //이곳에 사운드 재생을 넣으면 될듯합니다.
    }
  };

  //레코드 데이터 정의
  const recordList = [
    {
      recordImg: 'assets/images/record.png',
      sound: '',
    },
    {
      recordImg: 'assets/images/record.png',
      sound: '',
    },
    {
      recordImg: 'assets/images/record.png',
      sound: '',
    },
    {
      recordImg: 'assets/images/record.png',
      sound: '',
    },
  ];

  return (
    <Container>
      <BackgroundContainer>
        <BackgroundImg src='assets/images/background.png' />
        <ContentContainer>
          {recordList.map((item, index) => {
            return (
              <SwiperContainer key={index} activeIndex={activeIndex} thisIndex={index}>
                <CaseImg src='assets/images/case.png' />
                {index === activeIndex && (
                  <>
                    <AnswerText>{answer ?? '정답은?'}</AnswerText>
                    <RecordImg
                      src={item.recordImg}
                      rotateSecond={rotateSecond}
                      onAnimationEnd={() => setRotateSecond(0)} // 해당요소의 애니메이션이 종료됐을때 레코드판 돌리는 재생시간을 다시 0초로 초기화
                      inside={recordInside} //레코드가 들어가는 애니메이션을위한 트리거 변수
                    />
                  </>
                )}
              </SwiperContainer>
            );
          })}
        </ContentContainer>
      </BackgroundContainer>

      <ButtonContainer>
        <RowContainer>
          <ButtonStyle onClick={() => handleRotateAnimation(1)}>1초듣기</ButtonStyle>
          <ButtonStyle onClick={() => handleRotateAnimation(3)}>3초듣기</ButtonStyle>
        </RowContainer>
        <ButtonStyle>힌트보기</ButtonStyle>
        <ButtonStyle onClick={handleNextButton}>{buttonText}</ButtonStyle>
      </ButtonContainer>
    </Container>
  );
};

/**키프레임 시작 */

//1초 레코드판 돌리는 키프레임
const Rotate1Record = keyframes`
  0% {
    transform: rotate( 0deg )
  }
  100% {
    transform: rotate( 360deg )
  }
`;
//3초 레코드판 돌리는 키프레임
const Rotate3Record = keyframes`
  0% {
    transform: rotate( 0deg )
  }
  100% {
    transform: rotate( 1080deg )
  }
`;
//레코드판을 집어넣는 키프레임
const RecordInside = keyframes`
  0% {
    margin-left: -25%
  }
  100% {
    margin-left: -50%
  }
`;

//신규 레코드판이 선택될때 나오는 애니메이션 키프레임
const ActiveAnimation = keyframes`
0% {
    transform: translateX(60%) scale(.5);
    opacity: .5;
}
100% {
    transform: translateX(0%) scale(1);
    opacity: 1;
}
`;

//레코드판이 왼쪽으로 들어갈때 나오는 애니메이션 키프레임
const UnActiveAnimation = keyframes`
0% {
    transform: translateX(0%) scale(1);
    opacity: 1;
}
    100% {
    transform: translateX(-130%) scale(.5);
    opacity: .5;
}
`;
/**키프레임 종료 */

const Container = styled.div`
  width: 100vw;
  position: relative;
  display: flex;
  justify-content: center;
`;

const ContentContainer = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  height: 26%;
  position: absolute;
`;

const BackgroundContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
`;

const BackgroundImg = styled.img`
  width: 100%;
`;

const AnswerText = styled.p`
  font-size: 24px;
  position: absolute;
  margin-left: 50%;
  z-index: 11;
`;

const RecordImg = styled.img`
  object-fit: contain;
  z-index: 1;
  margin-left: -25%;
  animation-fill-mode: forwards;
  ${(props) =>
    props.rotateSecond > 0 && //레코드판을 돌리는 css애니메이션 추가 0초 이상일때만 작동하도록 한다.
    css`
      animation-timing-function: ease-in-out;
      animation-duration: ${props.rotateSecond}s;
      animation-iteration-count: 1;
      animation-name: ${props.rotateSecond === 1 ? Rotate1Record : Rotate3Record}; //1초일때 3초일때 분기해서 키프레임을 넣어줌
    `}
  ${(props) =>
    props.inside && //레코드판을 집어넣는 css애니메이션 추가 트리거가 true일때 실행.
    css`
      animation-timing-function: ease-in-out;
      animation-duration: 0.5s;
      animation-iteration-count: 1;
      animation-name: ${RecordInside};
    `}
`;

const SwiperContainer = styled.div`
  & > img {
    height: 100%;
  }
  display: flex;
  height: 100%;
  position: absolute;
  align-items: center;
  justify-content: center;
  animation-fill-mode: forwards;
  ${({ activeIndex, thisIndex }) => {
    // 선택된 index와 각요소의 index를 비교해서 애니메이션과 위치를 처리해줌
    const compare = Math.abs(activeIndex - thisIndex); //index비교 절대값
    if (activeIndex === thisIndex) {
      //선택된index와 현재요소의 값이 같다면(즉 active상태의 요소일때) 오른쪽에서 가운데로 나오는 애니메이션을 넣어줌
      return css`
        animation-timing-function: ease-in-out;
        animation-duration: 0.5s;
        animation-iteration-count: 1;
        animation-name: ${ActiveAnimation};
        z-index: 10;
      `;
    } else if (activeIndex > thisIndex) {
      //선택된index가 현재요소의 값보다 크다면(즉 active상태의 요소보다 왼쪽에 있을때)
      if (compare === 1) {
        //비교값이 1일때(즉 현재 active상태였다가 왼쪽으로 들어가야 하는 상태) 왼쪽으로 슬라이드되는 애니메이션을 넣어줌
        return css`
          animation-timing-function: ease-in-out;
          animation-duration: 0.5s;
          animation-iteration-count: 1;
          animation-name: ${UnActiveAnimation};
        `;
      }
      //그이외 그냥 위치만 잡아줌
      return css`
        transform: translateX(-130%) scale(0.5);
        opacity: 0.5;
      `;
    } else if (activeIndex < thisIndex) {
      //선택된index가 현재요소의 값보다 작다면(즉 active상태의 요소보다 오른쪽에 있을때)위치만 잡아줌
      return `
        transform: translateX(130%) scale(.5);
        opacity: .5;
    `;
    } else {
    }
  }}
`;

const CaseImg = styled.img`
  margin-left: 50%;
  height: auto;
  object-fit: contain;
  z-index: 2;
`;

const ButtonContainer = styled.div`
  position: absolute;
  bottom: 17%;
  display: flex;
  flex-direction: column;
  width: 24%;
`;

const ButtonStyle = styled.button`
  padding: 20px;
  flex: 1;
`;

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
`;
export default Main;
