import React, { useState, useEffect } from 'react'
import { ActionCable } from 'actioncable'

const App = () => {

  const [messages, setMessages] = useState([])
  const [cable, setCable] = useState

  useEffect(() => {
    createCable()
    fetchMessages()
    createSubscription()
  }, [])


  const createCable = () => {
    setCable(ActionCable.createConsumer('ws://localhost:3000/cable'))
  }

  const fetchMessages = () => {
    fetch('http://localhost:3000/messages')
      .then(res => res.json())
      .then(messages => setMessages({ messages: messages }))
  }

  const createSubscription = () => {
    cable.subscriptions.create(
      { channel: 'MessagesChannel' },
      { received: message => handleReceivedMessage(message) }
    )
  }

  const mapMessages = () => {
    return messages.map((message, i) => 
      <li key={i}>{message.content}</li>)
  }

  const handleReceivedMessage = message => {
    setMessages({ messages: [...messages, message] })
  }

  const handleMessageSubmit = e => {
    e.preventDefault();
    const messageObj = {
      message: {
        content: e.target.message.value
      }
    }
    const fetchObj = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(messageObj)
    }
    fetch('http://localhost:3000/messages', fetchObj)
    e.target.reset()
  }

  return (
    <div>
      <ActionCable 
          channel={{ channel: 'MessagesChannel' }}
          onReceived={() => handleReceivedMessage()}
        />
        <h2>Messages</h2>

        <ul>{() => mapMessages()}</ul>

        <form onSubmit={() => handleMessageSubmit()}>
          <input name='message' type='text' />
          <input type='submit' value='Send message' />
        </form>
    </div>
  )
}

export default App
