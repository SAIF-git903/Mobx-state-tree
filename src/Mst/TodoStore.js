import { types, flow } from "mobx-state-tree"

const User = types.model({
    id: types.identifierNumber,
    name: types.string,
});

const Todo = types
    .model({
        name: types.string,
        done: types.optional(types.boolean, false),
        priority: types.optional(types.number, 3),
        user: types.maybeNull(types.reference(User))
    })
    .actions(self => ({
        toggle() {
            self.done = !self.done
        },
        setUser(user) {
            self.user = user
        }
    }))


const RootStore = types
    .model({
        todos: types.array(Todo),
        users: types.array(User),
    })
    .views(self => ({
        get getTodoLength() {
            return self.todos.length
        },
        get getCompletedTodosLength() {
            return self.todos.filter((todo) => todo.done === true).length
        },
    }))
    .actions(self => ({
        addTodo(name, done, priority, userId) {
            const user = store.users.find((u) => u.id === userId);
            if (!name) return
            self.todos.push({ name, done, priority, user: userId && user })
        },
        removeTodo(todo) {
            self.todos.remove(todo)
        },
        handleTodoSearch(inputVal) {
            const filter = inputVal
            const matchesFilter = new RegExp(filter, "i");
            return self.todos.filter((todo) => matchesFilter.test(todo.name))
        },
        handleFilteredTodos(data) {
            let matchingObjects = [];
            for (let i = 0; i < data.length; i++) {
                let filters = data[i]
                const s = self.todos.filter((item) => item.done === filters || item.priority === filters)
                matchingObjects = matchingObjects.concat(s);
                return matchingObjects
            }
        },
        fetchData: flow(function* () {
            try {
                const response = yield fetch("https://fakestoreapi.com/users")
                const data = yield response.json()
                data.forEach((user) => {
                    return self.users.push({ id: user.id, name: user.name.firstname })
                })
            } catch (error) {
                console.log(error)
            }
        })
    }))


const store = RootStore.create({
    users: [],
    todos: [],
})


export { store }