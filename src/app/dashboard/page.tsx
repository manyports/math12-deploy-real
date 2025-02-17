"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import axios from "axios"
import { motion } from "framer-motion"
import { BarChart3Icon, CameraIcon, LogOutIcon, MessageCircleIcon, PenIcon, TrophyIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"

interface TestTaken {
  _id: string
  topicId: {
    _id: string
    topic: string
    class: string
    term: string
  }
  score: number
  totalQuestions: number
  date: string
}

export default function DashboardPage() {
  const [userTests, setUserTests] = useState<TestTaken[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchUserTests = async () => {
      try {
        const response = await axios.get("https://www.api.math12.studio/api/getUserTests", { withCredentials: true })
        const sortedTests = response.data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        setUserTests(sortedTests)
      } catch (error) {
        console.error("Error fetching user tests:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserTests()
  }, [])

  const logout = async () => {
    try {
      await axios.get("https://www.api.math12.studio/api/logout", {
        withCredentials: true,
      })
      router.push("/login")
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }

  const ActionCard = ({ icon, title, description, onClick }) => (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          {icon}
          <span>{title}</span>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button className="w-full" onClick={onClick}>
          Начать
        </Button>
      </CardContent>
    </Card>
  )

  return (
    <div className="container mx-auto px-4 py-8 bg-white mt-12 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 space-y-4 sm:space-y-0">
        <h1 className="text-3xl sm:text-4xl font-bold text-blue-600">Личный кабинет</h1>
        <Button variant="outline" onClick={logout} className="text-blue-600 border-blue-600 hover:bg-blue-50">
          <LogOutIcon className="w-4 h-4 mr-2" />
          Выйти
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <ActionCard
          icon={<PenIcon className="w-6 h-6 text-blue-600" />}
          title="Пройти тест"
          description="Проверьте свои знания с помощью наших тестов"
          onClick={() => router.push("/test")}
        />
        <ActionCard
          icon={<MessageCircleIcon className="w-6 h-6 text-blue-600" />}
          title="Спросить вопросы"
          description="Задайте вопросы нашему ИИ-ассистенту"
          onClick={() => router.push("/chats")}
        />
        <ActionCard
          icon={<CameraIcon className="w-6 h-6 text-blue-600" />}
          title="Решение по картинкам"
          description="Загрузите фото задачи для быстрого решения"
          onClick={() => router.push("/imagesolver")}
        />
        <ActionCard
          icon={<TrophyIcon className="w-6 h-6 text-blue-600" />}
          title="Математические гонки"
          description="Соревнуйтесь с друзьями в математике"
          onClick={() => router.push("/gamification")}
        />
      </div>

      <Card className="mb-12">
        <CardHeader>
          <CardTitle className="text-2xl text-blue-600 flex items-center">
            <BarChart3Icon className="w-6 h-6 mr-2" />
            Статистика тестов
          </CardTitle>
          <CardDescription>Просмотрите свои недавние тесты и лучшие результаты</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="recent" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="recent">Недавние</TabsTrigger>
              <TabsTrigger value="best">Лучшие</TabsTrigger>
            </TabsList>
            <TabsContent value="recent">
              <div className="space-y-4">
                {loading ? (
                  Array(5)
                    .fill(0)
                    .map((_, index) => <Skeleton key={index} className="w-full h-24" />)
                ) : userTests.length > 0 ? (
                  userTests.slice(0, 5).map((test, index) => (
                    <motion.div
                      key={test._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
                        <div>
                          <h3 className="font-semibold text-blue-600">{test.topicId.topic}</h3>
                          <p className="text-sm text-gray-600">
                            Класс: {test.topicId.class} | Четверть: {test.topicId.term}
                          </p>
                        </div>
                        <div className="text-lg font-bold text-blue-600 mt-2 sm:mt-0">
                          {test.score} / {test.totalQuestions}
                        </div>
                      </div>
                      <Progress value={(test.score / test.totalQuestions) * 100} className="h-2" />
                      <p className="text-sm text-gray-500 mt-2">Дата: {new Date(test.date).toLocaleDateString()}</p>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-center text-gray-500">Вы еще не прошли ни одного теста.</p>
                )}
              </div>
            </TabsContent>
            <TabsContent value="best">
              <div className="space-y-4">
                {loading ? (
                  Array(5)
                    .fill(0)
                    .map((_, index) => <Skeleton key={index} className="w-full h-24" />)
                ) : userTests.length > 0 ? (
                  userTests
                    .sort((a, b) => b.score / b.totalQuestions - a.score / a.totalQuestions)
                    .slice(0, 5)
                    .map((test, index) => (
                      <motion.div
                        key={test._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
                          <div>
                            <h3 className="font-semibold text-blue-600">{test.topicId.topic}</h3>
                            <p className="text-sm text-gray-600">
                              Класс: {test.topicId.class} | Четверть: {test.topicId.term}
                            </p>
                          </div>
                          <div className="text-lg font-bold text-blue-600 mt-2 sm:mt-0">
                            {test.score} / {test.totalQuestions}
                          </div>
                        </div>
                        <Progress value={(test.score / test.totalQuestions) * 100} className="h-2" />
                        <p className="text-sm text-gray-500 mt-2">Дата: {new Date(test.date).toLocaleDateString()}</p>
                      </motion.div>
                    ))
                ) : (
                  <p className="text-center text-gray-500">Вы еще не прошли ни одного теста.</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {loading ? (
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2 mt-2" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {Array(3)
                .fill(0)
                .map((_, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <Skeleton className="h-6 w-1/2" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-10 w-1/3" />
                    </CardContent>
                  </Card>
                ))}
            </div>
          </CardContent>
        </Card>
      ) : userTests.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-blue-600 flex items-center">
              <BarChart3Icon className="w-6 h-6 mr-2" />
              Общая статистика
            </CardTitle>
            <CardDescription>Обзор вашей общей производительности на платформе</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Всего тестов</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-blue-600">{userTests.length}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Средний балл</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-blue-600">
                    {(
                      (userTests.reduce((acc, test) => acc + test.score / test.totalQuestions, 0) / userTests.length) *
                      100
                    ).toFixed(2)}
                    %
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Лучший результат</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-blue-600">
                    {Math.max(...userTests.map((test) => (test.score / test.totalQuestions) * 100)).toFixed(2)}%
                  </p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}

