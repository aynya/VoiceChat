const express = require('express');
const app = express()
const cors = require('cors')

let rooms = [
    {
      "key": "1",
      "label": "1",
      "type": "text",
      "users": [
        {
          "id": "1",
          "username": "张三",
          "avatar": "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
        },
        {
          "id": "2",
          "username": "李四",
          "avatar": "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
        },
        {
          "id": "3",
          "username": "王五",
          "avatar": "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
        }
      ],
      "messages": [
        {
          "id": "1",
          "type": "system",
          "content": "欢迎来到聊天室",
          "timestamp": "2023-07-01 12:00:00"
        },
        {
          "id": "2",
          "type": "user",
          "username": "用户A",
          "avatar": "https://example.com/avatar1.png",
          "content": "大家好",
          "timestamp": "2023-07-01 12:01:00"
        },
        {
          "id": "3",
          "type": "user",
          "username": "用户B",
          "avatar": "https://example.com/avatar2.png",
          "content": "我是用户B",
          "timestamp": "2023-07-01 12:02:00"
        }
      ],
      "id": "1"
    },
    {
      "key": "2",
      "label": "2",
      "type": "text",
      "users": [
        {
          "id": "4",
          "username": "赵六",
          "avatar": "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
        },
        {
          "id": "5",
          "username": "钱七",
          "avatar": "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
        }
      ],
      "messages": [
        {
          "id": "4",
          "type": "system",
          "content": "欢迎来到聊天室2",
          "timestamp": "2023-07-02 12:00:00"
        },
        {
          "id": "5",
          "type": "user",
          "username": "用户C",
          "avatar": "https://example.com/avatar3.png",
          "content": "这是另一个聊天室",
          "timestamp": "2023-07-02 12:01:00"
        }
      ],
      "id": "2"
    },
    {
      "key": "3",
      "label": "3",
      "type": "voice",
      "users": [
        {
          "id": "6",
          "username": "孙八",
          "avatar": "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
        }
      ],
      "messages": [
        {
          "id": "6",
          "type": "system",
          "content": "欢迎来到聊天室3",
          "timestamp": "2023-07-03 12:00:00"
        },
        {
          "id": "7",
          "type": "user",
          "username": "用户D",
          "avatar": "https://example.com/avatar4.png",
          "content": "这是第三个聊天室",
          "timestamp": "2023-07-03 12:01:00"
        }
      ],
      "id": "3"
    },
    {
      "id": "4",
      "key": "4",
      "label": "4",
      "type": "text",
      "users": [],
      "messages": []
    }
  ]

// let users = [
//     {
//         "id": 1,
//         "roomId": 1,
//         "username": "张三",
//         "avatar": "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
//     },
//     {
//         "id": 2,
//         "roomId": 1,
//         "username": "李四",
//         "avatar": "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnV"
//     }
// ]

app.use(cors())
app.use(express.json())

app.get('/', (request, response) => {
    response.send(`<h1>hello<h1>`)
})

app.get(`/api/rooms`, (request, response) => { // 获取所有房间
    response.json(rooms)
})

// 获取对应房间的用户
app.get(`/api/rooms/:roomId/users`, (request, response) => {
    const roomId = request.params.roomId
    const room = rooms.find(room => room.id === roomId)

    if(!room) {
        return response.status(404).json({
            error: 'room not found'
        })
    }
    response.json(room.users);
})

// 用户加入房间
app.post(`/api/rooms/:roomId/users`, (request, response) => {
    const body = request.body
    const roomId = (request.params.roomId)
    const room = rooms.find(room => room.id === roomId)
    if(!room) {
        return response.status(404).json({
            error: 'room not found'
        })
    }
    const newUser = {
        id: body.id,
        username: body.username,
        avatar: body.avatar,
    }
    // console.log(newUser);
    room.users = room.users.concat(newUser)
    response.json(newUser)
})

// 用户退出房间
app.delete(`/api/rooms/:roomId/users/:userId`, (request, response) => {
    const roomId = (request.params.roomId)
    const room = rooms.find(room => room.id === roomId)
    if(!room) {
        return response.status(404).json({
            error: 'room not found'
        })
    }
    // console.log((request.params.userId))
    room.users = room.users.filter(user => user.id !== (request.params.userId))
    // console.log(room.users);
    response.status(204).end()
})

// 获取对应房间的消息
app.get(`/api/rooms/:roomId/messages`, (request, response) => {
    const roomId = (request.params.roomId)
    const room = rooms.find(room => room.id === roomId)
    if(!room) {
        return response.status(404).json({
            error: 'room not found'
        })
    }
    response.json(room.messages)
})

// 发送消息
app.post(`/api/rooms/:roomId/messages`, (request, response) => {
    const body = request.body
    const roomId = (request.params.roomId)
    const room = rooms.find(room => room.id === roomId)
    // console.log(body)
    if(!room) {
        return response.status(404).json({
            error: 'room not found'
        })
    }
    const message = {
        id: generatMessageId(room),
        type: body.type,
        username: body.username,
        avatar: body.avatar,
        content: body.content,
        timestamp: body.timestamp
    }
    room.messages = room.messages.concat(message)
    // console.log(room.messages)
    response.json(message)
})

app.get(`/api/rooms/:roomId`, (request, response) => {
    const roomId = (request.params.roomId)
    const room = rooms.find(room => room.id === roomId)
    if(!room) {
        return response.status(404).json({
            error: 'room not found'
        })
    }
    response.json(room)
})

const generatMessageId = (room) => {
    const maxId = room.messages.length > 0
      ? Math.max(...room.messages.map(n => n.id))
      : 0
    return (maxId + 1) + ''
}


app.post(`/api/rooms`, (request, response) => { // 创建房间
    const body = request.body
    console.log(body)

    if(!body) {
        return response.status(400).json({ // 客户端错误响应
            error: 'content missing'
        })
    }

    const room = {
        label: body.label,
        type: body.type,
        users: body.users,
        messages: body.messages,
        id: body.id,
        key: body.id,
    }

    rooms = rooms.concat(room)

    response.json(room)

})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
