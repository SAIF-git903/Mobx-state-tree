import React, { RefObject, useEffect, useState } from "react";
import { Avatar, Button, Input, Modal, Select } from "antd";
import { store } from "../../Mst/TodoStore";
import { observer } from "mobx-react-lite";
import { FlagOutlined, FlagFilled, UserOutlined } from "@ant-design/icons";
import { Dropdown } from "antd";
import "./style.css";
// import Todolist from "../Todolist";
import Todolist from "../Todolist";

// type User = {
//   id: number;
//   name: string;
// };

// type users = {};

const TodoView = () => {
  // REACT USESTATE HOOKS
  const inputRef = React.useRef<any>("");
  const [inputVal, setInputVal] = useState("");
  const [priorityNum, setPriorityNum] = useState("0");
  const [isPriority, setIsPriority] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [searchInp, setSearchInp] = React.useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchedTodos, setSearchedTodos] = React.useState([]);
  // const [users, setUsers] = React.useState<User[]>([]);
  const [assignee, setAssignee] = React.useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // JSX DATA
  const items = [
    {
      label: "Priority 1",
      key: "1",
      icon: <FlagFilled />,
    },
    {
      label: "Priority 2",
      key: "2",
      icon: <FlagFilled />,
    },
    {
      label: "Priority 3",
      key: "3",
      icon: <FlagFilled />,
    },
  ];

  const OPTIONS = [
    { label: "Completed", value: true },
    { label: "Priority 1st", value: 1 },
    { label: "Priority 2nd", value: 2 },
    { label: "Priority 3rd", value: 3 },
  ];

  //  CLICK EVENTS
  function handleAddTodo() {
    store.addTodo(inputVal, false, +priorityNum, assignee?.id);
    setInputVal("");
    setIsPriority(false);
    setPriorityNum("0");
    setAssignee(null);
  }

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleAddTodo();
    }
  };

  const onClick = ({ key }) => {
    setIsPriority(true);
    setPriorityNum(key);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  function handleAssigneeClick(user) {
    setAssignee(user);
    handleCancel();
  }

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // ONCHANGE METHODS
  const handleFilterChange = (value) => {
    setSelectedItems(value);
  };

  const handleChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInp(e.target.value);
    let searchedInputs: any = store.handleTodoSearch(searchInp);
    setSearchedTodos(searchedInputs);
  };

  // REACT USEEFFECT HOOKS
  useEffect(() => {
    inputRef.current.focus();
  }, [inputVal]);

  useEffect(() => {
    if (!searchInp.length) {
      setSearchedTodos([]);
    }
  }, [searchInp]);

  useEffect(() => {
    let data: any = store.handleFilteredTodos(selectedItems);
    setFilteredData(data);
  }, [selectedItems]);

  useEffect(() => {
    store.fetchData();
  }, []);

  return (
    <div>
      <div className="align-centered">
        <div style={{ width: "50%" }}>
          <h2 className="align-centered">MobX</h2>
          <div style={{ display: "flex", gap: "30px" }}>
            <Input
              placeholder="Task to-do..."
              onChange={(e) => setInputVal(e.target.value)}
              value={inputVal}
              ref={inputRef}
              onKeyPress={handleKeyPress}
            />
            <div className="align-centered" style={{ gap: "10px" }}>
              <div
                className="centered"
                style={{ width: "100%", cursor: "pointer" }}
              >
                <Avatar onClick={showModal} icon={<UserOutlined />} />
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
                        onClick={() => handleAssigneeClick(user)}
                      >
                        <UserOutlined />
                        <h5>{user.name}</h5>
                      </div>
                    );
                  })}
                </div>
              </Modal>
              <Dropdown menu={{ items, onClick }}>
                {isPriority ? (
                  <FlagFilled
                    className="centered flag-icon-props"
                    style={{
                      backgroundColor:
                        priorityNum === "1"
                          ? "red"
                          : priorityNum === "2"
                          ? "goldenrod"
                          : "#36a836",
                      color: "white",
                    }}
                  />
                ) : (
                  <FlagOutlined className="centered flag-icon-props" />
                )}
              </Dropdown>
              <Button
                type="primary"
                style={{
                  backgroundColor:
                    priorityNum === "1"
                      ? "red"
                      : priorityNum === "2"
                      ? "goldenrod"
                      : "#36a836",
                }}
                onClick={handleAddTodo}
              >
                Add To do
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginRight: "30px",
          gap: "30px",
        }}
      >
        <div className="centered">
          <Input
            placeholder="Search todo"
            value={searchInp}
            onChange={(e) => handleChangeSearch(e)}
          />
        </div>
        {/* <h3>{store.getCompletedTodosLength} / {searchedTodos.length >= 1 ? searchedTodos.length : store.getTodoLength}</h3> */}
      </div>
      {/* {!searchInp.length > 0 && ( */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginRight: "30px",
        }}
      >
        <Select
          mode="multiple"
          placeholder="Select Filter"
          value={selectedItems}
          onChange={(value) => handleFilterChange(value)}
          style={{ width: "120px" }}
          options={OPTIONS}
        />
      </div>
      {/* )} */}
      {searchInp.length > 0
        ? searchedTodos.map((todo, index) => {
            return <Todolist todo={todo} key={index} />;
          })
        : filteredData
        ? filteredData.map((todo, index) => {
            return <Todolist todo={todo} key={index} />;
          })
        : store.todos.map((todo, index) => {
            return <Todolist todo={todo} key={index} />;
          })}
    </div>
  );
};

export default observer(TodoView);
