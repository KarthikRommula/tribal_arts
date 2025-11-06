"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import AdminLayout from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Search,
  Eye,
  Mail,
  MailOpen,
  MessageSquare
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface ContactMessage {
  _id: string
  name: string
  email: string
  subject: string
  message: string
  status: string
  userId?: string
  replies?: Array<{
    _id: string
    message: string
    from: string
    createdAt: string
  }>
  createdAt: string
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [filteredMessages, setFilteredMessages] = useState<ContactMessage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)
  const [replyMessage, setReplyMessage] = useState("")
  const [isReplyDialogOpen, setIsReplyDialogOpen] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem("admin_token")
      const response = await fetch("/api/admin/messages", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setMessages(data)
      } else {
        router.push("/signin")
      }
    } catch (error) {
      console.error("Error fetching messages:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("admin_token")
    if (!token) {
      router.push("/signin")
      return
    }

    fetchMessages()
  }, [router])

  useEffect(() => {
    filterMessages()
  }, [messages, searchTerm, statusFilter])

  const filterMessages = () => {
    let filtered = messages

    if (searchTerm) {
      filtered = filtered.filter(message =>
        message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.subject.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(message => message.status === statusFilter)
    }

    setFilteredMessages(filtered)
  }

  const updateMessageStatus = async (messageId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem("admin_token")
      const response = await fetch(`/api/admin/messages/${messageId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        fetchMessages() // Refresh the messages list
        toast({
          title: "Success",
          description: `Message marked as ${newStatus}`,
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to update message status",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating message status:", error)
      toast({
        title: "Error",
        description: "Failed to update message status",
        variant: "destructive",
      })
    }
  }

  const sendReply = async (messageId: string, reply: string) => {
    try {
      const token = localStorage.getItem("admin_token")
      const response = await fetch(`/api/admin/messages/${messageId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reply }),
      })

      if (response.ok) {
        fetchMessages() // Refresh the messages list
        setReplyMessage("")
        setIsReplyDialogOpen(false)
        toast({
          title: "Success",
          description: "Reply sent successfully",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to send reply",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error sending reply:", error)
      toast({
        title: "Error",
        description: "Failed to send reply",
        variant: "destructive",
      })
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("admin_token")
    localStorage.removeItem("user")
    // Clear cookies
    document.cookie = "admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    document.cookie = "user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    router.push("/signin")
  }

  const getStatusIcon = (status: string) => {
    return status === "read" ? (
      <MailOpen className="h-4 w-4 text-gray-600" />
    ) : (
      <Mail className="h-4 w-4 text-blue-600" />
    )
  }

  const getStatusBadgeVariant = (status: string) => {
    return status === "unread" ? "destructive" : "secondary"
  }

  if (isLoading) {
    return (
      <AdminLayout onLogout={handleLogout}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout onLogout={handleLogout}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Contact Messages</h1>
            <p className="text-gray-600">View and manage contact form submissions</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search messages by name, email, or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="unread">Unread</SelectItem>
              <SelectItem value="read">Read</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Messages Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMessages.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    No messages found
                  </TableCell>
                </TableRow>
              ) : (
                filteredMessages.map((message) => (
                  <TableRow key={message._id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(message.status)}
                        <Badge variant={getStatusBadgeVariant(message.status)}>
                          {message.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{message.name}</p>
                        <p className="text-sm text-gray-600">{message.email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <p className="truncate">{message.subject}</p>
                    </TableCell>
                    <TableCell>
                      {new Date(message.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedMessage(message)}
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
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm font-medium text-gray-700">Name</label>
                                    <p className="text-sm text-gray-900">{selectedMessage.name}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-700">Email</label>
                                    <p className="text-sm text-gray-900">{selectedMessage.email}</p>
                                  </div>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-700">Subject</label>
                                  <p className="text-sm text-gray-900">{selectedMessage.subject}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-700">Message</label>
                                  <div className="mt-1 p-3 bg-gray-50 rounded-md">
                                    <p className="text-sm text-gray-900 whitespace-pre-wrap">
                                      {selectedMessage.message}
                                    </p>
                                  </div>
                                </div>

                                {/* Display existing replies */}
                                {selectedMessage.replies && selectedMessage.replies.length > 0 && (
                                  <div>
                                    <label className="text-sm font-medium text-gray-700">Replies</label>
                                    <div className="mt-2 space-y-2">
                                      {selectedMessage.replies.map((reply) => (
                                        <div key={reply._id} className="p-3 bg-blue-50 rounded-md border-l-4 border-blue-400">
                                          <div className="flex justify-between items-start">
                                            <p className="text-sm text-blue-900 whitespace-pre-wrap">
                                              {reply.message}
                                            </p>
                                            <span className="text-xs text-blue-600 ml-2">
                                              {new Date(reply.createdAt).toLocaleString()}
                                            </span>
                                          </div>
                                          <p className="text-xs text-blue-700 mt-1">From: Admin</p>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                <div className="flex justify-end gap-2">
                                  <Button
                                    onClick={() => {
                                      setSelectedMessage(selectedMessage)
                                      setIsReplyDialogOpen(true)
                                    }}
                                    variant="default"
                                  >
                                    Reply
                                  </Button>
                                  {selectedMessage.status === "unread" && (
                                    <Button
                                      onClick={() => {
                                        updateMessageStatus(selectedMessage._id, "read")
                                        setSelectedMessage(null)
                                      }}
                                      variant="outline"
                                    >
                                      Mark as Read
                                    </Button>
                                  )}
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        {message.status === "unread" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateMessageStatus(message._id, "read")}
                          >
                            Mark Read
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Reply Dialog */}
        <Dialog open={isReplyDialogOpen} onOpenChange={setIsReplyDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Reply to Message</DialogTitle>
            </DialogHeader>
            {selectedMessage && (
              <div className="space-y-4">
                <div className="p-3 bg-gray-50 rounded-md">
                  <p className="text-sm font-medium text-gray-700">Original Message:</p>
                  <p className="text-sm text-gray-900 mt-1">{selectedMessage.message}</p>
                  <p className="text-xs text-gray-600 mt-2">From: {selectedMessage.name} ({selectedMessage.email})</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Reply</label>
                  <textarea
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Type your reply here..."
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    onClick={() => setIsReplyDialogOpen(false)}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => sendReply(selectedMessage._id, replyMessage)}
                    disabled={!replyMessage.trim()}
                  >
                    Send Reply
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Summary */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>
            Showing {filteredMessages.length} of {messages.length} messages
          </span>
          <span>
            Unread: {messages.filter(m => m.status === "unread").length}
          </span>
        </div>
      </div>
    </AdminLayout>
  )
}