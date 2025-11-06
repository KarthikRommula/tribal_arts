"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useAuth } from "@/lib/auth-context"
import { MessageSquare, Eye } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface UserMessage {
  _id: string
  name: string
  email: string
  subject: string
  message: string
  status: string
  replies?: Array<{
    _id: string
    message: string
    from: string
    createdAt: string
  }>
  createdAt: string
}

export default function UserMessagesPage() {
  const { user, isLoading } = useAuth()
  const { toast } = useToast()
  const [messages, setMessages] = useState<UserMessage[]>([])
  const [isLoadingMessages, setIsLoadingMessages] = useState(true)
  const [selectedMessage, setSelectedMessage] = useState<UserMessage | null>(null)
  const router = useRouter()

  const getStatusBadgeVariant = (status: string) => {
    return status === "unread" ? "destructive" : "secondary"
  }

  const fetchMessages = async () => {
    if (!user) return

    try {
      const response = await fetch(`/api/user/messages?userId=${user._id}`)

      if (response.ok) {
        const data = await response.json()
        setMessages(data)
      } else if (response.status === 401) {
        router.push("/signin")
      }
    } catch (error) {
      console.error("Error fetching messages:", error)
    } finally {
      setIsLoadingMessages(false)
    }
  }

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/signin")
      return
    }

    if (user) {
      fetchMessages()
    }
  }, [user, isLoading, router])

  const handleViewMessage = (message: UserMessage) => {
    setSelectedMessage(message)
    if (message.status === 'unread') {
      toast({
        title: "Message Marked as Read",
        description: "This message has been marked as read.",
      })
      // Update local state to reflect read status
      setMessages(prev => prev.map(msg => 
        msg._id === message._id ? { ...msg, status: 'read' } : msg
      ))
    }
  }

  if (isLoading || isLoadingMessages) {
    return (
      <>
        <Header />
        <main className="min-h-screen py-12">
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  if (!user) {
    return null // Will redirect to signin
  }

  return (
    <>
      <Header />
      <main className="min-h-screen py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">My Messages</h1>
            <p className="text-xl text-muted-foreground">
              View your messages and admin replies
            </p>
          </div>

          <div className="mb-6 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-semibold">Your Messages</h2>
              <p className="text-muted-foreground">
                {messages.length} message{messages.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {messages.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No messages yet</h3>
                <p className="text-muted-foreground text-center">
                  You haven't sent any messages yet. Visit our contact page to get in touch.
                </p>
                <Button
                  onClick={() => router.push("/contact")}
                  className="mt-4"
                >
                  Contact Us
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <Card key={message._id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">{message.subject}</CardTitle>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{new Date(message.createdAt).toLocaleDateString()}</span>
                          <Badge variant={getStatusBadgeVariant(message.status)}>
                            {message.status}
                          </Badge>
                          {message.replies && message.replies.length > 0 && (
                            <Badge variant="default">
                              {message.replies.length} repl{message.replies.length !== 1 ? 'ies' : 'y'}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewMessage(message)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                              <MessageSquare className="h-5 w-5" />
                              Message Details
                            </DialogTitle>
                          </DialogHeader>
                          {selectedMessage && (
                            <div className="space-y-4">
                              <div>
                                <label className="text-sm font-medium text-gray-700">Subject</label>
                                <p className="text-sm text-gray-900 mt-1">{selectedMessage.subject}</p>
                              </div>

                              <div>
                                <label className="text-sm font-medium text-gray-700">Your Message</label>
                                <div className="mt-1 p-3 bg-gray-50 rounded-md">
                                  <p className="text-sm text-gray-900 whitespace-pre-wrap">
                                    {selectedMessage.message}
                                  </p>
                                </div>
                                <p className="text-xs text-gray-600 mt-1">
                                  Sent on {new Date(selectedMessage.createdAt).toLocaleString()}
                                </p>
                              </div>

                              {/* Display admin replies */}
                              {selectedMessage.replies && selectedMessage.replies.length > 0 && (
                                <div>
                                  <label className="text-sm font-medium text-gray-700">Admin Replies</label>
                                  <div className="mt-2 space-y-3">
                                    {selectedMessage.replies.map((reply) => (
                                      <div key={reply._id} className="p-3 bg-blue-50 rounded-md border-l-4 border-blue-400">
                                        <p className="text-sm text-blue-900 whitespace-pre-wrap">
                                          {reply.message}
                                        </p>
                                        <p className="text-xs text-blue-700 mt-2">
                                          Replied on {new Date(reply.createdAt).toLocaleString()}
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {(!selectedMessage.replies || selectedMessage.replies.length === 0) && (
                                <div className="p-3 bg-yellow-50 rounded-md border-l-4 border-yellow-400">
                                  <p className="text-sm text-yellow-800">
                                    No replies yet. We'll get back to you soon!
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground line-clamp-2">
                      {message.message}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}