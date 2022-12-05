import "./App.css";
import styled from "styled-components";
import { useEffect, useState } from "react";

const COFFEE_SIZE = 20;
const GAME_WIDTH = 500;
const GAME_HEIGHT = 500;
const GRAVITY = 6;
const JUMP_HEIGHT = 100;
const OBSTACLE_WIDTH = 40;
const OBSTACLE_GAP = 300;

function App() {
  const [coffeePosition, setCoffeePosition] = useState(250);
  //starting the game on click
  const [gameStarted, setGameStarted] = useState(false);
  const [obstacleHeight, setObstacleHeight] = useState(200);
  const [obstacleLeft, setObstacleLeft] = useState(GAME_WIDTH - OBSTACLE_WIDTH);
  const [score, setScore] = useState(0);

  const bottomObstacleHeight = GAME_HEIGHT - OBSTACLE_GAP - obstacleHeight;

  useEffect(() => {
    let timeId;
    if (gameStarted && coffeePosition < GAME_HEIGHT - COFFEE_SIZE) {
      timeId = setInterval(() => {
        setCoffeePosition((coffeePosition) => coffeePosition + GRAVITY);
      }, 24);
    }

    return () => {
      clearInterval(timeId);
    };
  }, [coffeePosition, gameStarted]);

  useEffect(() => {
    let obstacleId;
    if (gameStarted && obstacleLeft >= -OBSTACLE_WIDTH) {
      obstacleId = setInterval(() => {
        setObstacleLeft((obstacleLeft) => obstacleLeft - 5);
      }, 24);

      return () => {
        clearInterval(obstacleId);
      };
    } else {
      setObstacleLeft(GAME_WIDTH - OBSTACLE_WIDTH);
      setObstacleHeight(
        Math.floor(Math.random() * (GAME_HEIGHT - OBSTACLE_GAP))
      );
      setScore((score) => score + 1);
    }
  }, [gameStarted, obstacleLeft]);

  useEffect(() => {
    const hasCollidedWithTopObstacle =
      coffeePosition >= 0 && coffeePosition < obstacleHeight;
    const hasCollidedWithBottomObstacle =
      coffeePosition <= 500 && coffeePosition >= 500 - bottomObstacleHeight;

    if (
      obstacleLeft >= 0 &&
      obstacleLeft <= OBSTACLE_WIDTH &&
      (hasCollidedWithTopObstacle || hasCollidedWithBottomObstacle)
    ) {
      setGameStarted(false);
      setScore(0);
      setCoffeePosition(250);
    }
  }, [coffeePosition, obstacleHeight, bottomObstacleHeight, obstacleLeft]);

  const handleClick = () => {
    let newCoffeePosition = coffeePosition - JUMP_HEIGHT;
    //starting the game on click
    if (!gameStarted) {
      setGameStarted(true);
    } else if (newCoffeePosition < 0) {
      setCoffeePosition(0);
    } else {
      setCoffeePosition(newCoffeePosition);
    }
  };

  return (
    <Div onClick={handleClick}>
      <GameBox height={GAME_HEIGHT} width={GAME_WIDTH}>
        <Obstacle
          top={0}
          width={OBSTACLE_WIDTH}
          height={obstacleHeight}
          left={obstacleLeft}
        />

        <Obstacle
          top={GAME_HEIGHT - (obstacleHeight + bottomObstacleHeight)}
          width={OBSTACLE_WIDTH}
          height={bottomObstacleHeight}
          left={obstacleLeft}
        />

        <Coffee size={COFFEE_SIZE} top={coffeePosition} />
      </GameBox>
      <span> {score} </span>
    </Div>
  );
}

//Coffee representation
const Coffee = styled.div`
  position: absolute;
  background-color: red;
  height: ${(props) => props.size}px;
  width: ${(props) => props.size}px;
  top: ${(props) => props.top}px;
  border-radius: 50%;
`;

const Div = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  & span {
    color: white;
    font-size: 24px;
    position: absolute;
  }
`;

const GameBox = styled.div`
  height: ${(props) => props.height}px;
  width: ${(props) => props.width}px;
  background-color: blue;
`;

const Obstacle = styled.div`
  position: relativel;
  top: ${(props) => props.top}px;
  background-color: green;
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  left: ${(props) => props.left}px;
`;

export default App;
