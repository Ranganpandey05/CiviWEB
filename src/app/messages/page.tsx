'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { supabase } from '@/lib/supabase'
import Layout from '@/components/Layout/Layout'
import { MessageCircle, Send, User, Clock, Search, Filter } from 'lucide-react'

interface Message {
  id: string
  content: string
  sender_id: string
  sender_name: string
  sender_role: 'citizen' | 'worker' | 'admin'
  created_at: string
  message_type: 'text' | 'image' | 'system'
  task_id?: string
  read: boolean
}

export default function MessagesPage() {
  const { t } = useTranslation()
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState<'all' | 'citizen' | 'worker' | 'admin'>('all')
  const [newMessage, setNewMessage] = useState('')
  const [sendingMessage, setSendingMessage] = useState(false)

  const fetchMessages = async () => {
    try {
      setLoading(true)
      
      // First, try to fetch with profiles join
      let { data, error } = await supabase
        .from('community_messages')
        .select(`
          id,
          content,
          sender_id,
          created_at,
          message_type,
          profiles!community_messages_sender_id_fkey (
            full_name,
            role
          )
        `)
        .order('created_at', { ascending: false })
        .limit(100)

      let messagesData: any[] = []

      // If the foreign key relationship doesn't exist, try without it
      if (error && error.message.includes('foreign key')) {
        console.log('Foreign key relationship not found, fetching without profiles join...')
        const result = await supabase
          .from('community_messages')
          .select('id, content, sender_id, created_at, message_type')
          .order('created_at', { ascending: false })
          .limit(100)
        
        messagesData = result.data || []
        error = result.error
      } else if (!error && data) {
        messagesData = data
      }

      // If table doesn't exist, create some default messages
      if (error && (error.message.includes('does not exist') || error.message.includes('relation'))) {
        console.log('Community messages table not found, using default messages...')
        messagesData = [
          {
            id: '1',
            content: 'Welcome to CiviSamadhan Admin Dashboard! The community messages feature will be available once the database is properly set up.',
            sender_id: 'system',
            created_at: new Date().toISOString(),
            message_type: 'system',
            profiles: { full_name: 'System', role: 'admin' }
          },
          {
            id: '2',
            content: 'To set up community messages, run the CREATE_MESSAGES_TABLE.sql script in your Supabase database.',
            sender_id: 'system',
            created_at: new Date(Date.now() - 60000).toISOString(),
            message_type: 'system',
            profiles: { full_name: 'System', role: 'admin' }
          }
        ]
        error = null
      }

      if (error) throw error

      const formattedMessages = messagesData.map(msg => ({
        id: msg.id,
        content: msg.content,
        sender_id: msg.sender_id || 'system',
        sender_name: (msg.profiles as any)?.full_name || 'System',
        sender_role: (msg.profiles as any)?.role || 'admin',
        created_at: msg.created_at,
        message_type: (msg.message_type as 'text' | 'image' | 'system') || 'system',
        read: true
      }))

      setMessages(formattedMessages)
    } catch (error) {
      console.error('Error fetching messages:', error)
      // Set default message on error
      setMessages([
        {
          id: 'error',
          content: 'Unable to load community messages. Please check your database setup.',
          sender_id: 'system',
          sender_name: 'System',
          sender_role: 'admin',
          created_at: new Date().toISOString(),
          message_type: 'system',
          read: true
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim()) return

    try {
      setSendingMessage(true)
      const { data: user } = await supabase.auth.getUser()
      if (!user.user) return

      const { error } = await supabase
        .from('community_messages')
        .insert({
          content: newMessage.trim(),
          sender_id: user.user.id,
          message_type: 'text'
        })

      if (error) throw error

      setNewMessage('')
      fetchMessages() // Refresh messages
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setSendingMessage(false)
    }
  }

  useEffect(() => {
    fetchMessages()

    // Subscribe to real-time messages
    const subscription = supabase
      .channel('community_messages')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'community_messages' },
        () => {
          fetchMessages()
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.sender_name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === 'all' || message.sender_role === filterRole
    return matchesSearch && matchesRole
  })

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800'
      case 'worker': return 'bg-blue-100 text-blue-800'
      case 'citizen': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <MessageCircle className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">{t('messages')}</h1>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder={t('searchMessages')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">{t('allRoles')}</option>
              <option value="admin">{t('admin')}</option>
              <option value="worker">{t('worker')}</option>
              <option value="citizen">{t('citizen')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Messages List */}
      <div className="bg-white rounded-lg shadow-sm h-96 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>{t('noMessages')}</p>
              </div>
            </div>
          ) : (
            filteredMessages.map((message) => (
              <div key={message.id} className="flex space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-gray-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <p className="text-sm font-medium text-gray-900">{message.sender_name}</p>
                    <span className={`px-2 py-1 text-xs rounded-full ${getRoleColor(message.sender_role)}`}>
                      {message.sender_role}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{message.content}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <Clock className="h-3 w-3 text-gray-400" />
                    <p className="text-xs text-gray-500">{formatTime(message.created_at)}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Message Input */}
        <div className="border-t p-4">
          <div className="flex space-x-3">
            <input
              type="text"
              placeholder={t('typeMessage')}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={sendMessage}
              disabled={!newMessage.trim() || sendingMessage}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Send className="h-4 w-4" />
              <span>{sendingMessage ? t('sending') : t('send')}</span>
            </button>
          </div>
        </div>
      </div>
      </div>
    </Layout>
  )
}