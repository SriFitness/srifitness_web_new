//features/root/indoor/components/SupportChat.tsx

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { MessageCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function SupportChat() {
  const [isChatOpen, setIsChatOpen] = useState(false)

  return (
    <div className="fixed bottom-4 right-4">
      <Button onClick={() => setIsChatOpen(!isChatOpen)} className="rounded-full w-12 h-12 shadow-lg">
        <MessageCircle className="h-6 w-6" />
      </Button>
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-16 right-0 w-80"
          >
            <Card className="shadow-xl">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2 text-gray-800">Support Chat</h3>
                <ScrollArea className="h-60 w-full rounded-md border p-4">
                  <p>Welcome to our support chat! How can we help you today?</p>
                </ScrollArea>
                <div className="mt-2 flex">
                  <Input placeholder="Type your message..." className="flex-grow" />
                  <Button className="ml-2">Send</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

