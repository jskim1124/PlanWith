let todoList = [];

export default function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json(todoList);
  } else if (req.method === 'POST') {
    todoList = req.body.todo;
    res.status(200).json({ message: 'Todo added successfully' });
  }
}