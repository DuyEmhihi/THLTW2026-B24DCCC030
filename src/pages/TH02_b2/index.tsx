import { useState } from 'react';
import styles from './index.less';

// ==================== TYPES ====================
interface KnowledgeBlock {
  id: string;
  name: string;
  description: string;
}

interface Subject {
  id: string;
  code: string;
  name: string;
  credits: number;
}

type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'veryhard';
type TabType = 'blocks' | 'subjects' | 'questions' | 'exams' | 'examList';

interface Question {
  id: string;
  subjectId: string;
  blockId: string;
  content: string;
  difficulty: DifficultyLevel;
  createdAt: string;
}

interface ExamStructure {
  easy: number;
  medium: number;
  hard: number;
  veryhard: number;
}

interface Exam {
  id: string;
  name: string;
  subjectId: string;
  structure: ExamStructure;
  questions: Question[];
  createdAt: string;
}

// ==================== UTILITY FUNCTIONS ====================
const generateId = () => Math.random().toString(36).substr(2, 9);

const difficultyLabels: Record<DifficultyLevel, string> = {
  easy: '⭐ Dễ',
  medium: '⭐⭐ Trung bình',
  hard: '⭐⭐⭐ Khó',
  veryhard: '⭐⭐⭐⭐ Rất khó',
};

const selectRandomQuestions = (questions: Question[], count: number): Question[] => {
  const shuffled = [...questions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, questions.length));
};

// ==================== MAIN COMPONENT ====================
export default function ExamBankManager() {
  // ==================== STATE ====================
  const [activeTab, setActiveTab] = useState<TabType>('blocks');
  
  // Knowledge Blocks
  const [knowledgeBlocks, setKnowledgeBlocks] = useState<KnowledgeBlock[]>([
    { id: '1', name: 'Tổng quan', description: 'Kiến thức cơ bản' },
    { id: '2', name: 'Chuyên sâu', description: 'Kiến thức nâng cao' },
  ]);
  const [newBlock, setNewBlock] = useState({ name: '', description: '' });

  // Subjects
  const [subjects, setSubjects] = useState<Subject[]>([
    { id: '1', code: 'CS101', name: 'Lập trình Web', credits: 3 },
  ]);
  const [newSubject, setNewSubject] = useState({ code: '', name: '', credits: 0 });

  // Questions
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: '1',
      subjectId: '1',
      blockId: '1',
      content: 'Giải thích khái niệm HTML là gì?',
      difficulty: 'easy',
      createdAt: new Date().toLocaleDateString('vi-VN'),
    },
  ]);
  const [newQuestion, setNewQuestion] = useState({
    subjectId: '1',
    blockId: '1',
    content: '',
    difficulty: 'easy' as DifficultyLevel,
  });
  const [filterSubject, setFilterSubject] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('');
  const [filterBlock, setFilterBlock] = useState('');

  // Exams
  const [exams, setExams] = useState<Exam[]>([]);
  const [examStructure, setExamStructure] = useState<ExamStructure>({
    easy: 2,
    medium: 3,
    hard: 3,
    veryhard: 2,
  });
  const [selectedSubjectForExam, setSelectedSubjectForExam] = useState('');
  const [examName, setExamName] = useState('');

  // ==================== KNOWLEDGE BLOCKS HANDLERS ====================
  const addKnowledgeBlock = () => {
    if (newBlock.name.trim()) {
      setKnowledgeBlocks([
        ...knowledgeBlocks,
        { id: generateId(), ...newBlock },
      ]);
      setNewBlock({ name: '', description: '' });
    }
  };

  const deleteKnowledgeBlock = (id: string) => {
    setKnowledgeBlocks(knowledgeBlocks.filter((b) => b.id !== id));
  };

  // ==================== SUBJECTS HANDLERS ====================
  const addSubject = () => {
    if (newSubject.code.trim() && newSubject.name.trim()) {
      setSubjects([
        ...subjects,
        { id: generateId(), ...newSubject },
      ]);
      setNewSubject({ code: '', name: '', credits: 0 });
    }
  };

  const deleteSubject = (id: string) => {
    setSubjects(subjects.filter((s) => s.id !== id));
    setQuestions(questions.filter((q) => q.subjectId !== id));
    setExams(exams.filter((e) => e.subjectId !== id));
  };

  // ==================== QUESTIONS HANDLERS ====================
  const addQuestion = () => {
    if (newQuestion.content.trim()) {
      setQuestions([
        ...questions,
        {
          id: generateId(),
          ...newQuestion,
          createdAt: new Date().toLocaleDateString('vi-VN'),
        },
      ]);
      setNewQuestion({
        subjectId: selectedSubjectForExam || '1',
        blockId: '1',
        content: '',
        difficulty: 'easy',
      });
    }
  };

  const deleteQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id));
    setExams(
      exams.map((e) => ({
        ...e,
        questions: e.questions.filter((q) => q.id !== id),
      }))
    );
  };

  const filteredQuestions = questions.filter((q) => {
    const matchSubject = !filterSubject || q.subjectId === filterSubject;
    const matchDifficulty = !filterDifficulty || q.difficulty === filterDifficulty;
    const matchBlock = !filterBlock || q.blockId === filterBlock;
    return matchSubject && matchDifficulty && matchBlock;
  });

  // ==================== EXAMS HANDLERS ====================
  const createExam = () => {
    if (!selectedSubjectForExam || !examName.trim()) {
      alert('Vui lòng chọn môn học và nhập tên đề thi');
      return;
    }

    const availableQuestions = questions.filter((q) => q.subjectId === selectedSubjectForExam);

    // Group by difficulty
    const byDifficulty = {
      easy: availableQuestions.filter((q) => q.difficulty === 'easy'),
      medium: availableQuestions.filter((q) => q.difficulty === 'medium'),
      hard: availableQuestions.filter((q) => q.difficulty === 'hard'),
      veryhard: availableQuestions.filter((q) => q.difficulty === 'veryhard'),
    };

    // Check if enough questions
    if (
      byDifficulty.easy.length < examStructure.easy ||
      byDifficulty.medium.length < examStructure.medium ||
      byDifficulty.hard.length < examStructure.hard ||
      byDifficulty.veryhard.length < examStructure.veryhard
    ) {
      const missing = [];
      if (byDifficulty.easy.length < examStructure.easy)
        missing.push(`${examStructure.easy - byDifficulty.easy.length} câu Dễ`);
      if (byDifficulty.medium.length < examStructure.medium)
        missing.push(`${examStructure.medium - byDifficulty.medium.length} câu Trung bình`);
      if (byDifficulty.hard.length < examStructure.hard)
        missing.push(`${examStructure.hard - byDifficulty.hard.length} câu Khó`);
      if (byDifficulty.veryhard.length < examStructure.veryhard)
        missing.push(`${examStructure.veryhard - byDifficulty.veryhard.length} câu Rất khó`);

      alert(`❌ Không đủ câu hỏi:\n${missing.join('\n')}`);
      return;
    }

    // Select questions
    const selectedQuestions = [
      ...selectRandomQuestions(byDifficulty.easy, examStructure.easy),
      ...selectRandomQuestions(byDifficulty.medium, examStructure.medium),
      ...selectRandomQuestions(byDifficulty.hard, examStructure.hard),
      ...selectRandomQuestions(byDifficulty.veryhard, examStructure.veryhard),
    ];

    const newExam: Exam = {
      id: generateId(),
      name: examName,
      subjectId: selectedSubjectForExam,
      structure: examStructure,
      questions: selectedQuestions,
      createdAt: new Date().toLocaleDateString('vi-VN'),
    };

    setExams([newExam, ...exams]);
    setExamName('');
    alert('✅ Tạo đề thi thành công!');
  };

  const deleteExam = (id: string) => {
    setExams(exams.filter((e) => e.id !== id));
  };

  // ==================== RENDER FUNCTIONS ====================
  const renderKnowledgeBlocks = () => (
    <div className={styles.section}>
      <h2>📚 Danh mục Khối Kiến Thức</h2>
      <div className={styles.formGroup}>
        <div className={styles.inputGroup}>
          <input
            type="text"
            placeholder="Tên khối kiến thức (VD: Tổng quan, Chuyên sâu)"
            value={newBlock.name}
            onChange={(e) => setNewBlock({ ...newBlock, name: e.target.value })}
          />
          <textarea
            placeholder="Mô tả"
            value={newBlock.description}
            onChange={(e) => setNewBlock({ ...newBlock, description: e.target.value })}
          />
          <button onClick={addKnowledgeBlock} className={styles.btnPrimary}>
            ➕ Thêm khối kiến thức
          </button>
        </div>
      </div>

      <div className={styles.itemList}>
        {knowledgeBlocks.map((block) => (
          <div key={block.id} className={styles.item}>
            <div className={styles.itemContent}>
              <h4>{block.name}</h4>
              <p>{block.description}</p>
            </div>
            <button
              onClick={() => deleteKnowledgeBlock(block.id)}
              className={styles.btnDelete}
            >
              🗑️
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSubjects = () => (
    <div className={styles.section}>
      <h2>📖 Danh mục Môn Học</h2>
      <div className={styles.formGroup}>
        <div className={styles.inputGroup}>
          <input
            type="text"
            placeholder="Mã môn (VD: CS101)"
            value={newSubject.code}
            onChange={(e) => setNewSubject({ ...newSubject, code: e.target.value })}
          />
          <input
            type="text"
            placeholder="Tên môn"
            value={newSubject.name}
            onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
          />
          <input
            type="number"
            placeholder="Số tín chỉ"
            min="1"
            value={newSubject.credits}
            onChange={(e) => setNewSubject({ ...newSubject, credits: parseInt(e.target.value) })}
          />
          <button onClick={addSubject} className={styles.btnPrimary}>
            ➕ Thêm môn học
          </button>
        </div>
      </div>

      <div className={styles.itemList}>
        {subjects.map((subject) => (
          <div key={subject.id} className={styles.item}>
            <div className={styles.itemContent}>
              <h4>
                {subject.code} - {subject.name}
              </h4>
              <p>Số tín chỉ: {subject.credits}</p>
            </div>
            <button
              onClick={() => deleteSubject(subject.id)}
              className={styles.btnDelete}
            >
              🗑️
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderQuestions = () => (
    <div className={styles.section}>
      <h2>❓ Quản lý Câu Hỏi</h2>
      
      <div className={styles.formGroup}>
        <h3>Thêm câu hỏi mới</h3>
        <div className={styles.inputGroup}>
          <select
            value={newQuestion.subjectId}
            onChange={(e) => setNewQuestion({ ...newQuestion, subjectId: e.target.value })}
          >
            <option value="">-- Chọn môn học --</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          <select
            value={newQuestion.blockId}
            onChange={(e) => setNewQuestion({ ...newQuestion, blockId: e.target.value })}
          >
            <option value="">-- Chọn khối kiến thức --</option>
            {knowledgeBlocks.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>

          <select
            value={newQuestion.difficulty}
            onChange={(e) => setNewQuestion({ ...newQuestion, difficulty: e.target.value as DifficultyLevel })}
          >
            <option value="easy">⭐ Dễ</option>
            <option value="medium">⭐⭐ Trung bình</option>
            <option value="hard">⭐⭐⭐ Khó</option>
            <option value="veryhard">⭐⭐⭐⭐ Rất khó</option>
          </select>

          <textarea
            placeholder="Nội dung câu hỏi"
            value={newQuestion.content}
            onChange={(e) => setNewQuestion({ ...newQuestion, content: e.target.value })}
            rows={3}
          />

          <button onClick={addQuestion} className={styles.btnPrimary}>
            ➕ Thêm câu hỏi
          </button>
        </div>
      </div>

      <div className={styles.formGroup}>
        <h3>Bộ lọc</h3>
        <div className={styles.filterGroup}>
          <select
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
          >
            <option value="">-- Tất cả môn --</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          <select
            value={filterBlock}
            onChange={(e) => setFilterBlock(e.target.value)}
          >
            <option value="">-- Tất cả khối --</option>
            {knowledgeBlocks.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>

          <select
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value)}
          >
            <option value="">-- Tất cả độ khó --</option>
            <option value="easy">⭐ Dễ</option>
            <option value="medium">⭐⭐ Trung bình</option>
            <option value="hard">⭐⭐⭐ Khó</option>
            <option value="veryhard">⭐⭐⭐⭐ Rất khó</option>
          </select>
        </div>
        <p className={styles.info}>📊 Tìm thấy {filteredQuestions.length} câu hỏi</p>
      </div>

      <div className={styles.itemList}>
        {filteredQuestions.map((q) => {
          const subject = subjects.find((s) => s.id === q.subjectId);
          const block = knowledgeBlocks.find((b) => b.id === q.blockId);
          return (
            <div key={q.id} className={styles.questionItem}>
              <div className={styles.questionContent}>
                <h4>{q.content}</h4>
                <div className={styles.tags}>
                  <span className={styles.tag}>{subject?.name}</span>
                  <span className={styles.tag}>{block?.name}</span>
                  <span className={styles.tag}>{difficultyLabels[q.difficulty]}</span>
                  <span className={styles.tag}>{q.createdAt}</span>
                </div>
              </div>
              <button
                onClick={() => deleteQuestion(q.id)}
                className={styles.btnDelete}
              >
                🗑️
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderExams = () => (
    <div className={styles.section}>
      <h2>📝 Tạo Đề Thi</h2>

      <div className={styles.formGroup}>
        <div className={styles.inputGroup}>
          <input
            type="text"
            placeholder="Tên đề thi (VD: Đề thi giữa kỳ)"
            value={examName}
            onChange={(e) => setExamName(e.target.value)}
          />

          <select
            value={selectedSubjectForExam}
            onChange={(e) => setSelectedSubjectForExam(e.target.value)}
          >
            <option value="">-- Chọn môn học --</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <h3>Cấu trúc đề thi (số câu mỗi mức độ)</h3>
        <div className={styles.structureGrid}>
          <div className={styles.structureItem}>
            <label>⭐ Dễ:</label>
            <input
              type="number"
              min="0"
              value={examStructure.easy}
              onChange={(e) =>
                setExamStructure({ ...examStructure, easy: parseInt(e.target.value) || 0 })
              }
            />
          </div>
          <div className={styles.structureItem}>
            <label>⭐⭐ Trung bình:</label>
            <input
              type="number"
              min="0"
              value={examStructure.medium}
              onChange={(e) =>
                setExamStructure({ ...examStructure, medium: parseInt(e.target.value) || 0 })
              }
            />
          </div>
          <div className={styles.structureItem}>
            <label>⭐⭐⭐ Khó:</label>
            <input
              type="number"
              min="0"
              value={examStructure.hard}
              onChange={(e) =>
                setExamStructure({ ...examStructure, hard: parseInt(e.target.value) || 0 })
              }
            />
          </div>
          <div className={styles.structureItem}>
            <label>⭐⭐⭐⭐ Rất khó:</label>
            <input
              type="number"
              min="0"
              value={examStructure.veryhard}
              onChange={(e) =>
                setExamStructure({ ...examStructure, veryhard: parseInt(e.target.value) || 0 })
              }
            />
          </div>
        </div>

        <div className={styles.summaryInfo}>
          <p>📊 <strong>Tổng số câu:</strong> {examStructure.easy + examStructure.medium + examStructure.hard + examStructure.veryhard}</p>
        </div>

        <button onClick={createExam} className={styles.btnSuccess}>
          ✨ Tạo đề thi
        </button>
      </div>
    </div>
  );

  const renderExamList = () => (
    <div className={styles.section}>
      <h2>📋 Danh sách Đề Thi</h2>

      {exams.length === 0 ? (
        <p className={styles.emptyMessage}>Chưa có đề thi nào. Hãy tạo đề thi mới!</p>
      ) : (
        <div className={styles.examList}>
          {exams.map((exam) => {
            const subject = subjects.find((s) => s.id === exam.subjectId);
            return (
              <div key={exam.id} className={styles.examCard}>
                <div className={styles.examHeader}>
                  <h3>{exam.name}</h3>
                  <p className={styles.examMeta}>
                    {subject?.name} • {exam.createdAt}
                  </p>
                </div>

                <div className={styles.examStructure}>
                  <span>
                    {difficultyLabels.easy}: {exam.structure.easy}
                  </span>
                  <span>
                    {difficultyLabels.medium}: {exam.structure.medium}
                  </span>
                  <span>
                    {difficultyLabels.hard}: {exam.structure.hard}
                  </span>
                  <span>
                    {difficultyLabels.veryhard}: {exam.structure.veryhard}
                  </span>
                </div>

                <div className={styles.examQuestions}>
                  <h4>Câu hỏi trong đề:</h4>
                  <ol className={styles.questionOl}>
                    {exam.questions.map((q) => (
                      <li key={q.id}>
                        <span>{q.content}</span>
                        <small>{difficultyLabels[q.difficulty]}</small>
                      </li>
                    ))}
                  </ol>
                </div>

                <button
                  onClick={() => deleteExam(exam.id)}
                  className={styles.btnDelete}
                >
                  🗑️ Xóa
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  // ==================== MAIN RENDER ====================
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>🏦 Hệ Thống Quản Lý Ngân Hàng Câu Hỏi</h1>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'blocks' ? styles.active : ''}`}
          onClick={() => setActiveTab('blocks')}
        >
          📚 Khối Kiến Thức
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'subjects' ? styles.active : ''}`}
          onClick={() => setActiveTab('subjects')}
        >
          📖 Môn Học
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'questions' ? styles.active : ''}`}
          onClick={() => setActiveTab('questions')}
        >
          ❓ Câu Hỏi
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'exams' ? styles.active : ''}`}
          onClick={() => setActiveTab('exams')}
        >
          📝 Tạo Đề
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'examList' ? styles.active : ''}`}
          onClick={() => setActiveTab('examList')}
        >
          📋 Đề Thi ({exams.length})
        </button>
      </div>

      <div className={styles.content}>
        {activeTab === 'blocks' && renderKnowledgeBlocks()}
        {activeTab === 'subjects' && renderSubjects()}
        {activeTab === 'questions' && renderQuestions()}
        {activeTab === 'exams' && renderExams()}
        {activeTab === 'examList' && renderExamList()}
      </div>
    </div>
  );
}
