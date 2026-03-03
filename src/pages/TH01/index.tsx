import React, { useState, useEffect } from 'react';
import { Card, Input, Button, message, Space, Row, Col, Statistic, Tag } from 'antd';
import { CheckOutlined, CloseOutlined, ReloadOutlined } from '@ant-design/icons';
import styles from './index.less';

const GuessNumberGame: React.FC = () => {
  // Game state
  const [secretNumber, setSecretNumber] = useState<number>(0);
  const [guess, setGuess] = useState<string>('');
  const [attempts, setAttempts] = useState<number>(0);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [feedback, setFeedback] = useState<string>('');
  const [feedbackType, setFeedbackType] = useState<'success' | 'error' | 'warning'>('warning');
  const [guessHistory, setGuessHistory] = useState<number[]>([]);

  // Initialize game
  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const randomNum = Math.floor(Math.random() * 100) + 1;
    setSecretNumber(randomNum);
    setGuess('');
    setAttempts(0);
    setGameStatus('playing');
    setFeedback('Hãy nhập số của bạn (từ 1 đến 100)');
    setFeedbackType('warning');
    setGuessHistory([]);
  };

  const handleGuess = () => {
    const guessNum = parseInt(guess, 10);

    // Validation
    if (!guess) {
      message.error('Vui lòng nhập một số!');
      return;
    }

    if (isNaN(guessNum) || guessNum < 1 || guessNum > 100) {
      message.error('Vui lòng nhập số từ 1 đến 100!');
      return;
    }

    // Prevent duplicate guess
    if (guessHistory.includes(guessNum)) {
      message.warning('Bạn đã dự đoán số này rồi!');
      return;
    }

    // Update game state
    const newAttempts = attempts + 1;
    const newHistory = [...guessHistory, guessNum];
    setAttempts(newAttempts);
    setGuessHistory(newHistory);

    // Check guess
    if (guessNum === secretNumber) {
      setGameStatus('won');
      setFeedback(`🎉 Chúc mừng! Bạn đã đoán đúng! Số chính xác là ${secretNumber}. Bạn dùng ${newAttempts} lượt.`);
      setFeedbackType('success');
      message.success('Bạn thắng!');
    } else if (guessNum < secretNumber) {
      setFeedback('⬆️ Bạn đoán quá thấp!');
      setFeedbackType('error');
      
      if (newAttempts === 10) {
        setGameStatus('lost');
        setFeedback(`❌ Bạn đã hết lượt! Số đúng là ${secretNumber}.`);
        setFeedbackType('error');
        message.error('Bạn thua!');
      }
    } else {
      setFeedback('⬇️ Bạn đoán quá cao!');
      setFeedbackType('error');
      
      if (newAttempts === 10) {
        setGameStatus('lost');
        setFeedback(`❌ Bạn đã hết lượt! Số đúng là ${secretNumber}.`);
        setFeedbackType('error');
        message.error('Bạn thua!');
      }
    }

    setGuess('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && gameStatus === 'playing') {
      handleGuess();
    }
  };

  const isGameOver = gameStatus !== 'playing';

  return (
    <div className={styles.gameContainer}>
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={24} md={16}>
          <Card
            title="🎮 Trò Chơi Đoán Số"
            bordered={false}
            className={styles.mainCard}
          >
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              {/* Game Info */}
              <Row gutter={16}>
                <Col xs={12} sm={8}>
                  <Statistic
                    title="Lượt dự đoán"
                    value={attempts}
                    suffix="/ 10"
                    valueStyle={{
                      color: attempts >= 7 ? '#f5222d' : '#1890ff',
                    }}
                  />
                </Col>
                <Col xs={12} sm={8}>
                  <Statistic
                    title="Còn lại"
                    value={10 - attempts}
                    suffix="lượt"
                    valueStyle={{
                      color: 10 - attempts <= 3 ? '#f5222d' : '#52c41a',
                    }}
                  />
                </Col>
                <Col xs={24} sm={8}>
                  {gameStatus === 'won' && (
                    <Tag color="success" style={{ fontSize: '14px' }}>
                      <CheckOutlined /> Thắng
                    </Tag>
                  )}
                  {gameStatus === 'lost' && (
                    <Tag color="error" style={{ fontSize: '14px' }}>
                      <CloseOutlined /> Thua
                    </Tag>
                  )}
                  {gameStatus === 'playing' && (
                    <Tag color="processing" style={{ fontSize: '14px' }}>
                      Đang chơi
                    </Tag>
                  )}
                </Col>
              </Row>

              {/* Game Description */}
              <div className={styles.description}>
                <p>
                  <strong>Mục tiêu:</strong> Đoán số ngẫu nhiên từ 1 đến 100
                </p>
                <p>
                  <strong>Lượt chơi:</strong> Bạn có tối đa 10 lượt để đoán đúng số
                </p>
              </div>

              {/* Feedback */}
              <div
                className={`${styles.feedback} ${
                  feedbackType === 'success'
                    ? styles.feedbackSuccess
                    : feedbackType === 'error'
                    ? styles.feedbackError
                    : styles.feedbackWarning
                }`}
              >
                {feedback}
              </div>

              {/* Input Section */}
              {gameStatus === 'playing' && (
                <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                  <Input
                    type="number"
                    placeholder="Nhập số của bạn (1-100)"
                    value={guess}
                    onChange={(e) => setGuess(e.target.value)}
                    onKeyPress={handleKeyPress}
                    min={1}
                    max={100}
                    size="large"
                    disabled={isGameOver}
                  />
                  <Button
                    type="primary"
                    size="large"
                    onClick={handleGuess}
                    disabled={isGameOver}
                  >
                    Đoán
                  </Button>
                </div>
              )}

              {/* Game Over Buttons */}
              {isGameOver && (
                <Button
                  type="primary"
                  size="large"
                  icon={<ReloadOutlined />}
                  onClick={initializeGame}
                  block
                >
                  Chơi lại
                </Button>
              )}
            </Space>
          </Card>
        </Col>

        {/* Guess History */}
        <Col xs={24} sm={24} md={8}>
          <Card
            title="📋 Lịch sử dự đoán"
            bordered={false}
            className={styles.historyCard}
          >
            {guessHistory.length === 0 ? (
              <p style={{ color: '#999', textAlign: 'center' }}>
                Chưa có dự đoán nào
              </p>
            ) : (
              <div className={styles.guessHistory}>
                {guessHistory.map((g, idx) => (
                  <div key={idx} className={styles.guessItem}>
                    <span className={styles.attempt}>Lần {idx + 1}:</span>
                    <span className={styles.number}>{g}</span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default GuessNumberGame;
