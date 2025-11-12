import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  category: string;
}

const questions: Question[] = [
  {
    id: 1,
    question: 'Какая концентрация сероводорода в воздухе считается предельно допустимой (ПДК) для рабочей зоны?',
    options: ['5 мг/м³', '10 мг/м³', '15 мг/м³', '20 мг/м³'],
    correctAnswer: 1,
    category: 'Сероводород'
  },
  {
    id: 2,
    question: 'Какие средства индивидуальной защиты обязательны при работе в зоне возможного выделения H₂S?',
    options: ['Только респиратор', 'Противогаз и спецодежда', 'Только перчатки', 'Защитные очки'],
    correctAnswer: 1,
    category: 'СИЗ'
  },
  {
    id: 3,
    question: 'При какой концентрации сероводорода необходима немедленная эвакуация?',
    options: ['Выше 10 мг/м³', 'Выше 20 мг/м³', 'Выше 50 мг/м³', 'Выше 100 мг/м³'],
    correctAnswer: 0,
    category: 'Экстренные меры'
  },
  {
    id: 4,
    question: 'Как часто должен проводиться инструктаж по работе с H₂S?',
    options: ['Раз в год', 'Раз в полгода', 'Раз в квартал', 'Ежемесячно'],
    correctAnswer: 2,
    category: 'Инструктаж'
  },
  {
    id: 5,
    question: 'Какой цвет имеет газоанализатор при обнаружении сероводорода?',
    options: ['Зелёный', 'Жёлтый', 'Красный', 'Синий'],
    correctAnswer: 2,
    category: 'Оборудование'
  }
];

const courses = [
  {
    title: 'Работа с сероводородом',
    description: 'Требования безопасности при работе в зонах с H₂S',
    icon: 'Flame',
    color: 'from-purple-500 to-pink-500',
    lessons: 12,
    duration: '4 часа'
  },
  {
    title: 'Первая помощь',
    description: 'Оказание первой помощи при отравлении газами',
    icon: 'Heart',
    color: 'from-orange-500 to-red-500',
    lessons: 8,
    duration: '2 часа'
  },
  {
    title: 'Средства защиты',
    description: 'Использование СИЗ и газоанализаторов',
    icon: 'Shield',
    color: 'from-blue-500 to-cyan-500',
    lessons: 10,
    duration: '3 часа'
  }
];

export default function Index() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([]);
  const { toast } = useToast();

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    const isCorrect = answerIndex === questions[currentQuestion].correctAnswer;

    if (isCorrect) {
      setScore(score + 1);
      toast({
        title: '✅ Правильно!',
        description: 'Вы ответили верно',
        duration: 2000,
      });
    } else {
      toast({
        title: '❌ Неправильно',
        description: `Правильный ответ: ${questions[currentQuestion].options[questions[currentQuestion].correctAnswer]}`,
        duration: 3000,
        variant: 'destructive'
      });
    }

    setAnsweredQuestions([...answeredQuestions, currentQuestion]);

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
      } else {
        setShowResult(true);
      }
    }, 2000);
  };

  const restartTest = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
    setAnsweredQuestions([]);
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-3 mb-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full shadow-lg">
            <Icon name="GraduationCap" size={32} />
            <h1 className="text-3xl font-bold font-heading">Охрана Труда PRO</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Образовательная платформа для подготовки специалистов по охране труда
          </p>
        </header>

        {!showResult ? (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6 animate-slide-up">
              <Card className="shadow-xl border-2 overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500" />
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                      {questions[currentQuestion].category}
                    </Badge>
                    <span className="text-sm font-semibold text-muted-foreground">
                      Вопрос {currentQuestion + 1} из {questions.length}
                    </span>
                  </div>
                  <CardTitle className="text-2xl font-heading">
                    {questions[currentQuestion].question}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {questions[currentQuestion].options.map((option, index) => (
                    <Button
                      key={index}
                      onClick={() => handleAnswer(index)}
                      disabled={selectedAnswer !== null}
                      variant={selectedAnswer === index ? 'default' : 'outline'}
                      className={`w-full h-auto py-4 px-6 text-left justify-start text-base transition-all hover:scale-[1.02] ${
                        selectedAnswer === index
                          ? index === questions[currentQuestion].correctAnswer
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white border-green-600'
                            : 'bg-gradient-to-r from-red-500 to-pink-500 text-white border-red-600'
                          : selectedAnswer !== null && index === questions[currentQuestion].correctAnswer
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white border-green-600'
                          : 'hover:bg-gradient-to-r hover:from-purple-100 hover:to-pink-100'
                      }`}
                    >
                      <span className="mr-3 font-bold text-lg">
                        {String.fromCharCode(65 + index)}.
                      </span>
                      {option}
                    </Button>
                  ))}
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold">Прогресс теста</span>
                    <span className="text-sm font-bold text-purple-600">{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-3" />
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <Card className="shadow-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Trophy" size={24} />
                    Текущий результат
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-5xl font-bold mb-2">{score}</div>
                    <div className="text-lg opacity-90">из {answeredQuestions.length} ответов</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Lightbulb" size={24} />
                    Совет
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Внимательно читайте каждый вопрос. Сероводород (H₂S) — опасный газ, 
                    знание правил безопасности может спасти жизнь!
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto space-y-6 animate-scale-in">
            <Card className="shadow-2xl border-2">
              <div className="h-3 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500" />
              <CardHeader className="text-center pb-2">
                <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Icon name="Award" size={48} className="text-white" />
                </div>
                <CardTitle className="text-3xl font-heading mb-2">Тест завершён!</CardTitle>
                <CardDescription className="text-lg">
                  Вот ваши результаты
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-8 text-center">
                  <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-2">
                    {score}/{questions.length}
                  </div>
                  <div className="text-xl font-semibold mb-4">
                    {Math.round((score / questions.length) * 100)}% правильных ответов
                  </div>
                  <Progress 
                    value={(score / questions.length) * 100} 
                    className="h-4 mb-4"
                  />
                  <Badge className={`text-lg px-4 py-2 ${
                    score / questions.length >= 0.8 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                      : score / questions.length >= 0.6
                      ? 'bg-gradient-to-r from-orange-500 to-yellow-500'
                      : 'bg-gradient-to-r from-red-500 to-pink-500'
                  }`}>
                    {score / questions.length >= 0.8 
                      ? '🎉 Отлично!' 
                      : score / questions.length >= 0.6
                      ? '👍 Хорошо!'
                      : '📚 Нужно подучить'}
                  </Badge>
                </div>

                <Button 
                  onClick={restartTest} 
                  className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  <Icon name="RotateCcw" size={20} className="mr-2" />
                  Пройти тест заново
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        <section className="mt-16">
          <h2 className="text-3xl font-bold font-heading text-center mb-8 animate-fade-in">
            Доступные курсы
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {courses.map((course, index) => (
              <Card 
                key={index} 
                className="shadow-lg hover:shadow-2xl transition-all hover:scale-105 overflow-hidden animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`h-2 bg-gradient-to-r ${course.color}`} />
                <CardHeader>
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${course.color} flex items-center justify-center mb-4`}>
                    <Icon name={course.icon as any} size={32} className="text-white" />
                  </div>
                  <CardTitle className="font-heading">{course.title}</CardTitle>
                  <CardDescription>{course.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Icon name="BookOpen" size={16} />
                      <span>{course.lessons} уроков</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Icon name="Clock" size={16} />
                      <span>{course.duration}</span>
                    </div>
                  </div>
                  <Button className={`w-full bg-gradient-to-r ${course.color} hover:opacity-90`}>
                    Начать обучение
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
