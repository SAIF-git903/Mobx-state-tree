import React, { useState } from "react";
import { DeleteOutlined, FlagOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Checkbox, Modal, Popover } from "antd";
import { store } from "../../Mst/TodoStore";
import { observer } from "mobx-react-lite";

interface Todo {
  name: string;
  done: boolean;
  priority: number;
  user: { name: string };
  toggle: () => void;
  setUser: (user: object) => void;
}

type TodoProps = {
  todo: Todo;
};

function TodoList({ todo }: TodoProps) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleRemove = (todo: Todo) => {
    store.removeTodo(todo);
  };

  const handleOnChange = (todo: Todo) => {
    todo.toggle();
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  function handleAssigneeClick(todo: Todo, user: object) {
    todo.setUser(user);
    console.log(todo.user);
    handleCancel();
  }

  return (
    <div
      style={{
        display: "flex",
        backgroundColor: "#eeecec",
        justifyContent: "space-evenly",
        margin: "10px 100px 2px 100px",
        borderRadius: "10px",
      }}
    >
      <div className="centered" style={{ width: "100%" }}>
        <Checkbox
          value={todo.done}
          checked={todo.done}
          onChange={() => handleOnChange(todo)}
        />
      </div>
      <div style={{ width: "100%", overflow: "auto" }}>
        <p
          contentEditable={true}
          className={todo.done ? "disable-to-do" : "enable-to-do"}
        >
          {todo.name}
        </p>
      </div>
      <div className="centered" style={{ width: "100%" }}>
        <Popover
          content={
            todo.priority === 1
              ? "Red represents urgent or critical tasks"
              : todo.priority === 2
              ? "Yellow represent important but less urgent tasks"
              : "Green represent lower-priority or optional tasks"
          }
        >
          <FlagOutlined
            className="centered flag-icon-props"
            style={{
              color:
                todo.priority === 1
                  ? "red"
                  : todo.priority === 2
                  ? "goldenrod"
                  : "green",
            }}
          />
        </Popover>
        <DeleteOutlined onClick={() => handleRemove(todo)} />
        <Popover
          content={
            todo.user ? `Task assigned to ${todo.user.name}` : "Not assigned"
          }
        >
          <div
            className="centered"
            style={{ width: "100%", cursor: "pointer" }}
          >
            {todo.user ? (
              <Avatar
                style={{ backgroundColor: "greenyellow", color: "black" }}
                icon={<UserOutlined />}
              />
            ) : (
              <Avatar onClick={showModal} icon={<UserOutlined />} />
            )}
          </div>
        </Popover>
      </div>
      <Modal
        title="Select Assignee of Todo"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        style={{ width: "100px" }}
      >
        <div
          className="align-centered"
          style={{ gap: "10px", flexWrap: "wrap" }}
        >
          {store?.users?.map((user) => {
            return (
              <div
                className="centered assignee-hover-effect"
                style={{
                  backgroundColor: "#eeecec",
                  padding: "0 20px",
                  borderRadius: "10px",
                }}
                onClick={() => handleAssigneeClick(todo, user)}
              >
                <UserOutlined />
                <h5>{user.name}</h5>
              </div>
            );
          })}
        </div>
      </Modal>
    </div>
  );
}

export default observer(TodoList);
