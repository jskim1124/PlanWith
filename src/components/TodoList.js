import React, { useState, useEffect } from "react";
import TodoItem from "@/components/TodoItem";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "@/styles/TodoList.module.css";

// TodoList 컴포넌트를 정의합니다.
export default function TodoList () {
  // 상태를 관리하는 useState 훅을 사용하여 할 일 목록과 입력값을 초기화합니다.
  const [todos, setTodos] = useState([]);

  const [input, setInput] = useState("");
  const [errorcode, seterrorcode] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [deadline, setDeadline] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    fetch('/api/todo')
      .then(res => res.json())
      .then(data => setTodos(data));
  }, []);

  const postTodo = (todoList) => {
    fetch('/api/todo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ todo: todoList })
    })
      .then(res => res.json())
      .then(data => {
        console.log(data.message);
      })
  }


  postTodo(todos)


  // addTodo 함수는 입력값을 이용하여 새로운 할 일을 목록에 추가하는 함수입니다.
  const addTodo = () => {
    // 입력값이 비어있는 경우 함수를 종료합니다.
    if (input.trim() === "" || deadline === "" || category === "" ) {
      setIsButtonDisabled(true); // 버튼 비활성화
      seterrorcode("할 일과 마감일, 카테고리를 다시 확인하십시오")
      setTimeout(() => {
        setIsButtonDisabled(false); // 1초 후 버튼 활성화
      }, 1000);
      return;
    }    
    // 기존 할 일 목록에 새로운 할 일을 추가하고, 입력값을 초기화합니다.
    // {
    //   id: 할일의 고유 id,
    //   text: 할일의 내용,
    //   completed: 완료 여부,
    // }
    // ...todos => {id: 1, text: "할일1", completed: false}, {id: 2, text: "할일2", completed: false}}, ..
    const newTodo = {id: Date.now(), text: input, completed: false, deadline: deadline, category: category, dday: Math.ceil((deadline - Date.now()) / (1000 * 60 * 60 * 24)).toString()};
    setTodos([...todos, newTodo]);
    setInput("");
    setDeadline("");
    setCategory("");
    setIsButtonDisabled(true); // 버튼 비활성화
    seterrorcode("");
    setTimeout(() => {
      setIsButtonDisabled(false); // 버튼 활성화
    }, 1000);



  };

  // toggleTodo 함수는 체크박스를 눌러 할 일의 완료 상태를 변경하는 함수입니다.
  const toggleTodo = (id) => {
    // 할 일 목록에서 해당 id를 가진 할 일의 완료 상태를 반전시킵니다.
    setTodos(
      // todos.map((todo) =>
      //   todo.id === id ? { ...todo, completed: !todo.completed } : todo
      // )
      // ...todo => id: 1, text: "할일1", completed: false
      todos.map((todo) => {
        return todo.id === id ? { ...todo, completed: !todo.completed } : todo;
      })
      
    );

  };

  // deleteTodo 함수는 할 일을 목록에서 삭제하는 함수입니다.
  const deleteTodo = (id) => {
    // 해당 id를 가진 할 일을 제외한 나머지 목록을 새로운 상태로 저장합니다.
    // setTodos(todos.filter((todo) => todo.id !== id));
    setTodos(
      todos.filter((todo) => {
        return todo.id !== id;
      })
    );
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      addTodo();
    }
  };

  const borderStyle = " text-center border border-blue-500 rounded ";
  


  // 컴포넌트를 렌더링합니다.
  return (
    <div className={styles.container}>
      <h1 className="text-xl mb-4 font-bold underline underline-offset-4 decoration-wavy">
        학습플랜 설계 플랫폼 - PlanWith
      </h1>
      {/* 할 일을 입력받는 텍스트 필드입니다. */}

      <li className="mb-1">
        <input
        type="text"
        className="shadow-lg w-full p-1 mb-4 border border-gray-300 rounded"
        style={{ width: "500%" }}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={handleKeyPress} 
        
        />

        <DatePicker 
        className="shadow-lg w-40 p-1 text-center ml-3 mb-4 border border-gray-300 rounded"
        selected={deadline}
        onChange={(date) => setDeadline(date)}
        placeholderText="Select deadline"
        minDate={new Date()}
        onKeyDown={(e) => handleKeyPress(e)}
        
        />
    
        <select
          className="shadow-lg w-40 p-1 text-center ml-3 mb-4 border border-gray-300 rounded"
          value={category}
          selected={category}
          onKeyPress={handleKeyPress} 
          onChange={(e) => {
            if (e.target.value === "other") {
              setCategory(prompt("Please enter a category"));
            } else  {
              setCategory(e.target.value);
            }
          }}
        >
          <option value="">Select category</option>
          <option value="Work">Work</option>
          <option value="Study">Study</option>
          <option value="Exercise">Exercise</option>
          <option value="other">Other</option>
        </select>

      </li>

      {/* 할 일을 추가하는 버튼입니다. */}
      <li>
        <span className= "w-full pl-5 text-red-500 mr-10 mb-7 ">{errorcode}</span>
        <button
          className={`w-1/5 justify-self-end p-1 mb-7 bg-blue-500 text-white border border-blue-500 rounded hover:bg-white hover:text-blue-500 ${isButtonDisabled && "bg-red-500 border-red-500 hover:bg-red hover:text-red-500 cursor-not-allowed"}`}
          onClick={addTodo}
          disabled={isButtonDisabled}
        >
          Add Todo
        </button>
      </li>

      <li className="mb-1">
        <div className={`${borderStyle} w-12`}>완료</div>
        <div className={`${borderStyle} ml-2 w-64`}>할 일</div>
        <div className={`${borderStyle} ml-2 w-24`}>카테고리</div>
        <button 
        className={`${borderStyle} ml-2 w-24`}
        >D-Day</button>
        <div className={`${borderStyle} ml-2 w-32`}>마감일</div>
        <div className={`${borderStyle} ml-2 w-16`}>제거</div>
      </li>

      {/* 할 일 목록을 렌더링합니다. */}
      <ul>
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={() => toggleTodo(todo.id)}
            onDelete={() => deleteTodo(todo.id)}
          />
        ))}
      </ul>
      <script src="https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js?v=1"></script>
      <df-messenger
        intent="WELCOME"
        chat-title="AIED-Tutor"
        agent-id="bcf6e68b-bd69-450a-92f6-22bedab1ff1b"
        language-code="ko"
      ></df-messenger>
    </div>
  );
}
