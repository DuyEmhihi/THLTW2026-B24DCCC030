import { useState } from 'react';
import styles from './index.less';

type Choice = 'keo' | 'bua' | 'bao' | null;
type ChoiceValue = 'keo' | 'bua' | 'bao';
type Result = 'win' | 'loss' | 'draw' | null;

interface GameRound {
  id: number;
  playerChoice: ChoiceValue;
  computerChoice: ChoiceValue;
  result: Result;
  timestamp: string;
}

const choiceLabels: Record<string, string> = {
  keo: '✌️ Kéo',
  bua: '📄 Búa',
  bao: '✊ Bao',
};

const getComputerChoice = (): Choice => {
  const choices: Choice[] = ['keo', 'bua', 'bao'];
  return choices[Math.floor(Math.random() * choices.length)];
};

const determineResult = (player: Choice, computer: Choice): Result => {
  if (player === computer) return 'draw';

  if (
    (player === 'keo' && computer === 'bua') ||
    (player === 'bua' && computer === 'bao') ||
    (player === 'bao' && computer === 'keo')
  ) {
    return 'win';
  }

  return 'loss';
};

const getResultMessage = (result: Result): string => {
  switch (result) {
    case 'win':
      return '🎉 Bạn Thắng!';
    case 'loss':
      return '😢 Bạn Thua!';
    case 'draw':
      return '⚖️ Hòa!';
    default:
      return '';
  }
};

const getRoundMessage = (playerChoice: Choice, computerChoice: Choice): string => {
  const playerLabel = choiceLabels[playerChoice || ''];
  const computerLabel = choiceLabels[computerChoice || ''];
  return `${playerLabel} VS ${computerLabel}`;
};

export default function RockPaperScissors() {
  const [playerChoice, setPlayerChoice] = useState<Choice>(null);
  const [computerChoice, setComputerChoice] = useState<Choice>(null);
  const [result, setResult] = useState<Result>(null);
  const [gameHistory, setGameHistory] = useState<GameRound[]>([]);
  const [roundCounter, setRoundCounter] = useState(1);

  const handlePlay = (choice: Choice) => {
    const computer = getComputerChoice();
    const gameResult = determineResult(choice, computer);

    setPlayerChoice(choice);
    setComputerChoice(computer);
    setResult(gameResult);

    const newRound: GameRound = {
      id: roundCounter,
      playerChoice: choice as ChoiceValue,
      computerChoice: computer as ChoiceValue,
      result: gameResult,
      timestamp: new Date().toLocaleTimeString('vi-VN'),
    };

    setGameHistory([newRound, ...gameHistory]);
    setRoundCounter(roundCounter + 1);
  };

  const handleReset = () => {
    setPlayerChoice(null);
    setComputerChoice(null);
    setResult(null);
    setGameHistory([]);
    setRoundCounter(1);
  };

  const stats = {
    totalGames: gameHistory.length,
    wins: gameHistory.filter((r) => r.result === 'win').length,
    losses: gameHistory.filter((r) => r.result === 'loss').length,
    draws: gameHistory.filter((r) => r.result === 'draw').length,
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>🎮 Trò Chơi Kéo, Búa, Bao</h1>

      {/* Game Controls */}
      <div className={styles.gameBoard}>
        <div className={styles.choicesSection}>
          <button
            className={`${styles.choiceBtn} ${playerChoice === 'keo' ? styles.active : ''}`}
            onClick={() => handlePlay('keo')}
          >
            ✌️ Kéo
          </button>
          <button
            className={`${styles.choiceBtn} ${playerChoice === 'bua' ? styles.active : ''}`}
            onClick={() => handlePlay('bua')}
          >
            📄 Búa
          </button>
          <button
            className={`${styles.choiceBtn} ${playerChoice === 'bao' ? styles.active : ''}`}
            onClick={() => handlePlay('bao')}
          >
            ✊ Bao
          </button>
        </div>

        {/* Result Display */}
        {result && (
          <div className={styles.resultSection}>
            <div className={styles.resultMessage}>
              {getRoundMessage(playerChoice, computerChoice)}
            </div>
            <div className={`${styles.resultStatus} ${styles[result!]}`}>
              {getResultMessage(result)}
            </div>
          </div>
        )}
      </div>

      {/* Statistics */}
      {gameHistory.length > 0 && (
        <div className={styles.statsSection}>
          <h2>📊 Thống kê</h2>
          <div className={styles.stats}>
            <div className={styles.statItem}>
              <span>Tổng ván:</span>
              <strong>{stats.totalGames}</strong>
            </div>
            <div className={`${styles.statItem} ${styles.win}`}>
              <span>Thắng:</span>
              <strong>{stats.wins}</strong>
            </div>
            <div className={`${styles.statItem} ${styles.loss}`}>
              <span>Thua:</span>
              <strong>{stats.losses}</strong>
            </div>
            <div className={`${styles.statItem} ${styles.draw}`}>
              <span>Hòa:</span>
              <strong>{stats.draws}</strong>
            </div>
          </div>
        </div>
      )}

      {/* Game History */}
      {gameHistory.length > 0 && (
        <div className={styles.historySection}>
          <h2>📜 Lịch sử kết quả</h2>
          <div className={styles.historyList}>
            {gameHistory.map((round) => (
              <div key={round.id} className={`${styles.historyItem} ${styles[round.result!]}`}>
                <div className={styles.historyInfo}>
                  <span className={styles.roundNumber}>Ván {round.id}:</span>
                  <span className={styles.choices}>
                    {choiceLabels[round.playerChoice]} - {choiceLabels[round.computerChoice]}
                  </span>
                </div>
                <div className={styles.historyResult}>
                  <span className={styles.resultBadge}>
                    {getResultMessage(round.result)}
                  </span>
                  <span className={styles.time}>{round.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reset Button */}
      {gameHistory.length > 0 && (
        <button className={styles.resetBtn} onClick={handleReset}>
          🔄 Chơi lại
        </button>
      )}
    </div>
  );
}
